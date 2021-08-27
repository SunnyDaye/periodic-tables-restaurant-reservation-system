import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";
import { useTimer, useTime } from "react-timer-hook";
import "./Layout.css";

export default function ReservationWatcher({ reservations, loadDashboard }) {
  let reservationDate;
  const history = useHistory();
  const [alert,setAlert] = useState(false);
  const { seconds, minutes, hours } = useTime({}); //forces rerender every second
  
  if (reservations && reservations.length > 0) {
    const nextReservation = reservations.filter( //resrvations is already in order so the filtered array will be sorted by time as well
      (reservation) => reservation.status === "booked"
    )[0];
    if (nextReservation) {
      const targetHours = Number(nextReservation.reservation_time.slice(0, 2));
      const targetMinutes = Number(
        nextReservation.reservation_time.slice(3, 5)
      );
      const targetSeconds = Number(nextReservation.reservation_time.slice(6));
      console.log(targetHours, targetMinutes, targetSeconds);

      if (
        hours === targetHours &&
        minutes === targetMinutes &&
        seconds === targetSeconds
      ) {
        window.alert(`${nextReservation.first_name}'s reservation starts now. Go to dashboard`);
        loadDashboard();
      }
    }
  }

  return null;
}
