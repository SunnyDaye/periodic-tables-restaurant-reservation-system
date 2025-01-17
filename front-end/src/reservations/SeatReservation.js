import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { occupyTable } from "../utils/api";
import { changeReservationStatus, listReservations } from "../utils/api";

export default function SeatReservation({
  reservations,
  setReservations,
  tables,
  loadDashboard,
}) {
  
  const history = useHistory();

  // here are the states we need to keep track of
  const [tableId, setTableId] = useState(1);
  const [errors, setErrors] = useState([]);
  const { reservation_id } = useParams();

  if (!tables || !reservations) return null;

  // change handler sets tableId state
  function handleChange({ target }) {
    setTableId(target.value);
  }

  // submit handler does nothing as of yet
  function handleSubmit(event) {
   
    event.preventDefault();
    const abortController = new AbortController();

    // we will be creating a validation function as well
    if (validateSeat()) {
      occupyTable(reservation_id, tableId, abortController.signal)
        .then(
          changeReservationStatus(
            reservation_id,
            "seated",
            abortController.signal
          )
        )
        .then(loadDashboard)
        .then(() => history.push(`/dashboard`))
        .catch(console.error);
    }
  }

  // validation function uses the same principles from my other vaidation functions in previous sections
  function validateSeat() {
    const foundErrors = [];
    // we will need to use the find method here to get the actual table/reservation objects from their ids
    const foundTable = tables.find((table) => table.table_id == tableId);
    console.log("What reservations looks like:", reservations);
    const foundReservation = reservations.find(
      (reservation) => reservation.reservation_id == reservation_id
    );
    console.log("Found reservation looks like this:", foundReservation);
    if (!foundTable) {
      foundErrors.push({ message: "The table you selected does not exist." });
    } else if (!foundReservation) {
      foundErrors.push({ message: "This reservation does not exist." });
    } else {
      if (foundTable.status === "occupied") {
        foundErrors.push({
          message: "The table you selected is currently occupied.",
        });
      }

      if (foundTable.capacity < foundReservation.people) {
        foundErrors.push({
          message: `The table you selected cannot seat ${foundReservation.people} people.`,
        });
      }
    }

    setErrors(foundErrors);
    // this conditional will either return true or false based off of whether foundErrors is equal to 0
    return foundErrors.length === 0;
  }

  const tableOptionsJSX = () => {
    return tables.map((table) => (
      // make sure to include the value
      // the option text i have here is required for the tests as included in the instructions
      <option value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
  };

  const errorsJSX = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  return (
    <form>
      {errorsJSX()}
      <label htmlFor="table_id">Choose table:</label>
      <select
        name="table_id"
        id="table_id"
        value={tableId}
        onChange={handleChange}
      >
        {tableOptionsJSX()}
      </select>

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
