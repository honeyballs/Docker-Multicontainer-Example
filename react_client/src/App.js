import React, { Component } from 'react';
import MovieList from "./MovieList";
import DirectorList from "./DirectorList";

class App extends Component {
  
  state = {
    movies: [],
    directors: []
  }
  
  componentDidMount() {
    this.fetchAllMovies();
    this.fetchAllDirectors();
  }

  fetchAllMovies = () => {
    fetch('http://localhost:4001/movies')
    .then( response => response.json())
    .then( json => {
        const movies = json.map( item => {
          var movie = { title: item._fields[0].properties.title, 
            year: item._fields[0].properties.year.low }
          return movie
        });
        this.setState({movies: movies});
    });
  }

  fetchAllDirectors = () => {
    fetch('http://localhost:4001/directors')
    .then( response => response.json() )
    .then( json => {
        const directors = json.map( item => {
          var director = item._fields[0].properties.name
          return director
        });
        this.setState({directors: directors});
    });
  }

  fetchMoviesOfDirector = director => {
    fetch(`http://localhost:4001/movies_of_director?director=${encodeURIComponent(director)}`)
    .then( response => response.json() )
    .then( json => {
      const movies = json.map( item => {
        var movie = { title: item._fields[0].properties.title, 
          year: item._fields[0].properties.year.low }
        return movie
      });
      this.setState({movies: movies});
    });
  }

  fetchDirectorOfMovie = movie => {
    fetch(`http://localhost:4001/director_of_movie?title=${encodeURIComponent(movie)}`)
    .then( response => response.json() )
    .then( json => {
      const directors = json.map( item => {
        var director = item._fields[0].properties.name
        return director
      });
      this.setState({directors: directors});
    });
  }

  render() {
    return (
      <div className="App">
        <MovieList movies={this.state.movies} onClick={this.fetchDirectorOfMovie}/>
        <DirectorList directors={this.state.directors} onClick={this.fetchMoviesOfDirector}/>
      </div>
    );
  }
}

export default App;
