import express from "express";
import neo4j from "neo4j-driver";

const app = express();
const driver = neo4j.driver('bolt://neo4j_db:7687', neo4j.auth.basic("neo4j", "password"));

app.get('/', (req, res) => {
    res.send("I'm working");
});

app.get('/movies', (req, res) => {
    const session = driver.session();
    session.run("MATCH (n:Movie) RETURN n")
        .then( result => {
            res.send(result.records);
            session.close();
        });
});

app.get('/directors', (req, res) => {
    const session = driver.session();
    session.run("MATCH (n:Director) RETURN n")
    .then( result => {
        res.send(result.records);
        session.close();
    });
});

app.get('/director_of_movie', (req, res) => {
    const title = req.query.title;
    const session = driver.session();
    session.run(`MATCH (:Movie { title: $title })--(m:Director) 
                RETURN m`, { title: title })
    .then( result => {
        res.send(result.records);
        session.close();
    });
});

app.get('/movies_of_director', (req, res) => {
    const director = req.query.director
    const session = driver.session();
    session.run(`MATCH (:Director { name: $name })--(m:Movie)   
                RETURN m`, { name: director })
    .then( result => {
        res.send(result.records);
        session.close();
    });
})

app.listen(4000, () => {
    console.log("Server listening on port 4000!");
});