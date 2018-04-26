import React from 'react';

const DirectorItem = props => {
    return (
        <li className="director-item">
            <p onClick={ evt => { 
                evt.preventDefault()
                props.onClick(props.name)
            }}>
                <b>{props.name}</b>
            </p>
        </li>
    )
}

export default DirectorItem;