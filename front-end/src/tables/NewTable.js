import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable, editTable } from "../utils/api";

export default function NewTable({ edit, tables, loadDashboard }) {
  const history = useHistory();
  const { table_id } = useParams();

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // initial (default) data
    table_name: "",
    capacity: null,
  });
  const [denyEdit, setDenyEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(editMode, [edit, table_id, tables]);

  function editMode() {
    if (edit) {
      if (!tables || !table_id) return null;

      // let's try to find the corresponding table:
     
      const foundTable = tables.find(
        (table) => table.table_id === Number(table_id)
      );
      console.log("Table found", foundTable);
      // if it doesn't exist, or the table is occupied, we cannot edit.
      if(foundTable){
      if (foundTable.status === "occupied") {
        console.log("Will deny edit");
        setDenyEdit(true);
        setLoading(false);
      }else{
        setLoading(false);
        setFormData({
        table_name: foundTable.table_name,
        capacity: foundTable.capacity,
      });
      }
    }
      
    }else{
      setLoading(false);
    }
  }

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
    if (target.name === "capacity")
      setFormData({ ...formData, [target.name]: parseInt(target.value) });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    if (validateFields()) {
      if (edit) {
        editTable(table_id, formData, abortController.signal)
          .then(loadDashboard)
          .then(history.goBack())
          .catch(console.error);
      } else {
        createTable(formData, abortController.signal)
          .then(loadDashboard)
          .catch(console.error);
      }

      history.push(`/dashboard`);
    }
  }

  function validateFields() {
    let foundError = null;

    if (formData.table_name === "" || formData.capacity === null) {
      foundError = { message: "Please fill out all fields." };
    } else if (formData.table_name.length < 2) {
      foundError = { message: "Table name must be at least 2 characters." };
    }

    setError(foundError);

    return foundError === null;
  }
  console.log("Loading is", loading);
  console.log('Deny edit', denyEdit);



  return (
    <React.Fragment>

    { !loading ? (!denyEdit ? 
      <form>
      <ErrorAlert error={error} />

      <label htmlFor="table_name">Table Name:&nbsp;</label>
      <input
        name="table_name"
        id="table_name"
        type="text"
        minLength="2"
        onChange={handleChange}
        value={formData.table_name}
        required
      />

      <label htmlFor="capacity">Capacity:&nbsp;</label>
      <input
        name="capacity"
        id="capacity"
        type="number"
        min="1"
        onChange={handleChange}
        value={formData.capacity}
        required
      />

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>: <h1>This table is occupied. You cannot edit.</h1>) : <h3>Loading...</h3>
    }
    </React.Fragment>
  );
}
