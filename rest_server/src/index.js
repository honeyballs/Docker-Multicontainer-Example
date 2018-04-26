import express from "express";
import fetch from "isomorphic-fetch"

const app = express();

app.get('/', (req, res) => {
    fetch('http://db_server:4000/')
    .then( db_resp => db_resp.text())
    .then( text => res.send(text));
});

app.get('/movies', (req, res) => {
    fetch('http://db_server:4000/movies')
    .then( db_resp => db_resp.json())
    .then( json => {
        res.send(json)
    });
});

app.get('/directors', (req, res) => {
    fetch('http://db_server:4000/directors')
    .then( db_resp => db_resp.json())
    .then( json => res.send(json));
});

app.get('/director_of_movie', (req, res) => {
    const title = req.query.title;
    fetch(`http://db_server:4000/director_of_movie?title=${title}`)
    .then( db_resp => db_resp.json())
    .then( json => res.send(json));
});

app.get('/movies_of_director', (req, res) => {
    const director = req.query.director;
    fetch(`http://db_server:4000/movies_of_director?director=${director}`)
    .then( db_resp => db_resp.json())
    .then( json => res.send(json));
});


app.listen(4001, () => {
    console.log("Server listening on port 4001!");
});