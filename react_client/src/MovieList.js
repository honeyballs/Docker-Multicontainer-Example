import React from "react";
import MovieItem from "./MovieItem";

const MovieList = props => {
  return (
    <div className="movie-list-div">
      <ul className="movie-list">
        {props.movies.map((item, index) => (
          <MovieItem key={index} title={item.title} year={item.year} onClick={props.onClick}/>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
