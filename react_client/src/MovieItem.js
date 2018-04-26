import React from 'react';

const MovieItem = props => {
    return (
        <li className="movie-item">
            <p onClick={ evt => {
                evt.preventDefault();
                props.onClick(props.title);
            }}>
                <b>{props.title}</b>
            </p>
            <p>{props.year}</p>
        </li>
    )
}

export default MovieItem;