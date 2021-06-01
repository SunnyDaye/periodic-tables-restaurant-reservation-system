import React from "react";
import { useHistory } from "react-router-dom";
import { freeTable, changeReservationStatus } from "../utils/api";

export default function TableEntry({ table, loadDashboard }) {
  const history = useHistory();

  if (!table) return null;

  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      // delete request here, we will add this later
      freeTable(table.table_id,abortController.signal)
      .then((response)=>changeReservationStatus(response,null,abortController.signal))
      .then(loadDashboard)

      return () => abortController.abort();
    }
  }

  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>

      {/* the instructions say the tests are looking for this data-table-id-status, so be sure to include it. */}
      <td data-table-id-status={table.table_id}>{table.status}</td>
      {table.status === "occupied" && (
        <td data-table-id-finish={table.table_id}>
          <button onClick={handleFinish} type="button">
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}
