import React from "react";

// note that i pass in a reservation object as a prop:
export default function ReservationEntry({ reservation }) {
 // if the reservation is finished, we do not want it to be shown on the dashboard
 if(!reservation || reservation.status === "finished") return null;

 return (
   <tr>
     <th scope="row">{reservation.reservation_id}</th>
     <td>{reservation.first_name}</td>
     <td>{reservation.last_name}</td>
     <td>{reservation.mobile_number}</td>
     <td>{reservation.reservation_time}</td>
     <td>{reservation.people}</td>
     
     { /* the instructions ask to include a data-reservation-id-status so the tests can find it */ }
     <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>

     { /* i am using the exact same logic i used for the finish button in 5.2 */ }
     {reservation.status === "booked" &&
       <td>
         <a href={`/reservations/${reservation.reservation_id}/seat`}>
           <button type="button">Seat</button>
         </a>
       </td>
     }
   </tr>
 );
}
