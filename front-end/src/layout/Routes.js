import React, { useEffect, useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";

import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../search/Search";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = (query.get("date")) ? query.get("date") : today();


  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [reservationsToDisplay, setReservationsToDisplay] = useState([]); 
  const [reservationsToDisplayError, setReservationsToDisplayError] = useState([]);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const [rerender,setRerender] = useState(false);

  useEffect(loadDashboard, [date, rerender]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listReservations({ date }, abortController.signal)
      .then(setReservationsToDisplay)
      .catch(setReservationsToDisplayError);
    listTables(abortController.signal)
    .then(setTables)
    .catch(setTablesError);

    console.log("When dashboard loads, reservations look like this: ",reservations);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation setRerender={setRerender}/>
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation reservations={reservations} setReservations={setReservations} tables={tables} setRerender={setRerender}/>
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <NewReservation edit={true} reservations={reservations} />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable setRerender={setRerender} />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsToDisplay={reservationsToDisplay}
          reservationsToDisplayError={reservationsToDisplayError}
          tables={tables}
          tablesError={tablesError}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
