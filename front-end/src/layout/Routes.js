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
import ReservationWatcher from "./ReservationWatcher";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState([]);



  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);



  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
      
    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  return (
    <React.Fragment>
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation loadDashboard={loadDashboard} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation
          reservations={reservations}
          setReservations={setReservations}
          tables={tables}
          loadDashboard={loadDashboard}
        />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <NewReservation edit={true} reservations={reservations} loadDashboard={loadDashboard}/>
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable loadDashboard={loadDashboard} />
      </Route>
      <Route exact={true} path="/tables/:table_id/edit">
        <NewTable edit={true} tables={tables} loadDashboard={loadDashboard} />
      </Route>
      <Route exact={true} path="/search">
        <Search loadDashboard={loadDashboard} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
    <ReservationWatcher reservations={reservations} loadDashboard={loadDashboard}/>
    </React.Fragment>
  );
}

export default Routes;
