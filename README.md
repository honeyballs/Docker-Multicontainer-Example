# Docker Multicontainer Example

This is a small example on how to run a multicontainer environment with docker. The apps running on the containers are implemented as Node express servers. The frontend is a a React app.

`db_server` communicates directly with a Neo4j databse. `rest_server` is a proxy for the `db_server` where additional functionality could reside. 

## Get it running

### Build the apps

Make sure you have [Node](https://nodejs.org/en/) installed. 

Open a console in the location of `db_server`. Run `npm install` to install all dependencies declared in `package.json`. Next run `npm run build`. This will create a folder called `dist` and copy the built `index.js` into it.

Repeat the steps for `rest_server`.

### Build the images

Now you can create the images.

Make sure Docker is running. Open a console in the location of `db_server`. 

To build the image run `docker build -t <IMAGE NAME> .`.

Repeat the build process for `rest_server`.

### Modify the compose file

The last step is to modify the `docker-compose.yml`.

Replace the `<IMAGE NAME>` of the service `rest` with the name you gave the `rest_server` image. Replace the `<IMAGE NAME>` of the service `db_server` with the name you gave the `db_server` image.

Next you need to set the paths to `data` and `logs` for the Neo4j database. The paths have to be absolute. They don't have to point to the `neo4j` directory in the project but it helps to keep it organized. 

### Start the containers

Open a console at the root of the project where the `docker-compose.yml` is located. 

Run `docker compose up` to start all containers. 

To check if the system is working go to `http://localhost:4001`.

### Add data to the database

Go to `http://localhost:7474` to access the Neo4j console. Login using the account data `neo4j/password`.

Copy this into the Neo4j console:

````cypher
CREATE (n:Director {name: 'Tommy Wiseau'});
CREATE (n:Movie {title: 'The Room', year: 2003});
MATCH (a:Director),(b:Movie)
WHERE a.name = 'Tommy Wiseau' AND b.title = 'The Room'
CREATE (a)-[r:DIRECTED]->(b);
````

### Start the React client

Open a console in the `react_client` directory. Run `npm install`. Run `npm start`. The app is running at `http://localhost:3000`.

### Stop the containers

Run `docker compose down` to stop all containers.

### Clean up

If you want to remove the containers and images created complete the following steps:

Run `docker container ls` and find the containers. 

Run `docker container rm -f <CONTAINER NAME OR CONTAINER ID> ` for the containers you want to remove.

Run `docker image ls` and find the created images.

Run `docker image rm -f <IMAGE NAME>`.



## Explanation

The following section explains the composition of the docker related files.

### Dockerfile

`FROM mhart/alpine-node`

Define the base image - in this case a minimal linux distribution with node installed.

`WORKDIR /usr/src/app`

Set the working directory. All following commands will be executed at this location.

````
COPY package*.json ./
RUN npm install --only=production
````

Copy the `package.json` to the working directory and install the dependencies.

`COPY dist ./dist`

Copy the built app files.

`EXPOSE 4000`

Make port 4000 accessible.

`CMD [ "npm", "run", "serve" ]`

Define the command that will be executed when the container is started to run the app.

### docker-compose

Let's look at the network definition at the bottom of the file first:

````
networks:
  web_network:
    driver: bridge
  db_network:
    driver: bridge
````

Two networks are created to seperate the database from the frontend.

````
neo4j_db:
    image: neo4j:latest
    ports:
      - 7474:7474
      - 7687:7687
    networks: 
      - db_network
    volumes:
      - <ABSOLUTE/PATH/TO>/neo4j/data:/data
      - <ABSOLUTE/PATH/TO>/neo4j/logs:/logs
    environment:
      - NEO4J_AUTH=neo4j/password
````

The database service uses an image from the Docker Hub created by the Neo4j Team. We expose the ports to the admin console and REST api for testing. The database is using the `db_network` we defined before.

Since containers are stateless we have to set volumes to save the data to the host machine in order to preserve it when the container shuts down.

As the last step we set the login data for the database using environment variables.

````
rest:
    image: <IMAGE NAME>
    ports:
      - 4001:4001
    networks: 
      - web_network
    depends_on:
      - neo4j_db
      - db_server
  db_server:
    image: <IMAGE NAME>
    ports:
      - 4000:4000
    networks: 
      - web_network
      - db_network
    depends_on:
      - neo4j_db
````

The two services are quite similar. By setting `depends_on` to other services the service starts when the service it depends on is started. 

The `db_server` uses both the `web_network` and the `db_network`, the `rest` service uses only the `web_network`. In doing this we can make only the `rest` service accessible. Since the services are connected by networks we could remove the `ports` command for every service except the `rest` service. In a real environmet a client would only have direct access to the `rest` service, the database would be protected.



