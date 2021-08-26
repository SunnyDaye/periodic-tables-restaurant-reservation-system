import React from "react";
import {useTimer, useTime} from 'react-timer-hook';
import "./Layout.css";

export default function ReservationWatcher({reservations}) {

  console.log(reservations);
  
  return (
    <div className="card watcher" style={{width:"275px",height:"100px"}}>
      <div className="card-body">This is some text within a card body.</div>
    </div>
  );
}
