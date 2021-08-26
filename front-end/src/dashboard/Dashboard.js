import React, {useEffect} from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import ReservationEntry from "./ReservationEntry";
import TableEntry from "./TableEntry";

import "./Dashboard.css";
import {useTimer, useTime} from 'react-timer-hook';
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  loadDashboard,
}) {
  
  const history = useHistory();
  
  const reservationsList = () => {
    return reservations.map((reservation) => (
      <ReservationEntry
        key={reservation.reservation_id}
        reservation={reservation}
        loadDashboard={loadDashboard}

      />
    ));
  };

  const tablesList = () => {
    return tables.map((table) => (
      <TableEntry key={table.table_id} table={table} loadDashboard={loadDashboard}/>
    ));
  };
  console.log("Tables looks like", tables);
  
  return (
    <main className="w-100">
      <h1>Dashboard</h1>
      <div className="container-fluid d-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      {(reservationsError && reservationsError.length > 0) ? <ErrorAlert error={reservationsError} />: null} 
      <table className="table">
        {/* "thead" is the table header, meant for the column labels */}
        <thead>
          {/* "tr" means table row */}
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
          </tr>
        </thead>

        {/* "tbody" is the table body. */}
        <tbody>{reservationsList()}</tbody>
      </table>

      <h4 className="mb-0">Tables</h4>

      <ErrorAlert error={tablesError} />

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Occupant Reservation ID</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>

        <tbody>{tablesList()}</tbody>
      </table>
      <div className = "dayNavigator d-flex">
        <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
      </div>
      
    </main>
  );
}

export default Dashboard;
