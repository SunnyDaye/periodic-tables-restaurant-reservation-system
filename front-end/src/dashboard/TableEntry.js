import React from "react";
import { useHistory } from "react-router-dom";

export default function TableEntry({ table }) {
  const history = useHistory();

  if (!table) return null;

  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      // delete request here, we will add this later
      history.push("/dashboard");
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
