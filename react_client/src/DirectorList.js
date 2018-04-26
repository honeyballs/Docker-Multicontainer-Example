import React from "react";
import DirectorItem from "./DirectorItem";

const DirectorList = props => {
  return (
    <div className="director-list-div">
      <ul className="director-list">
        {props.directors.map((item, index) => (
          <DirectorItem key={index} name={item} onClick={props.onClick}/>
        ))}
      </ul>
    </div>
  );
};

export default DirectorList;
