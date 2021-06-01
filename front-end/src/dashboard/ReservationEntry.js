import React from "react";
import {changeReservationStatus} from "../utils/api";
// note that i pass in a reservation object as a prop:

export default function ReservationEntry({ reservation, loadDashboard}) {
  function handleCancel() {
    // revisiting our friend window.confirm:
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      // api call will go here eventually
      const abortController = new AbortController();

			changeReservationStatus(reservation.reservation_id, "cancelled", abortController.signal)
				.then(loadDashboard);

			return () => abortController.abort();
      // window.location.reload();
    }
  }
  // if the reservation is finished, we do not want it to be shown on the dashboard
  if (!reservation || reservation.status === "finished") return null;

  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>

      <td>
        <a href={`/reservations/${reservation.reservation_id}/edit`}>
          <button type="button">Edit</button>
        </a>
      </td>

      <td>
        {/* the cancel button requires a data-reservation-id-cancel attribute for the tests */}
        <button
          type="button"
          onClick={handleCancel}
          data-reservation-id-cancel={reservation.reservation_id}
        >
          Cancel
        </button>
      </td>

      {(reservation.status === "booked") && (
        <td>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button">Seat</button>
          </a>
        </td>
      )}
    </tr>
  );
}
