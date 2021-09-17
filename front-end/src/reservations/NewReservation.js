import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, editReservation } from "../utils/api";

export default function NewReservation({ edit, reservations, loadDashboard }) {
  /*---------------------HOOKS------------------------*/
  const history = useHistory();
  const { reservation_id } = useParams();

  /*---------------------STATES-------------------------*/
  const [formData, setFormData] = useState({
    //The form needs to rerender when the user types
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const [errors, setErrors] = useState([]);
  const [denyEdit, setDenyEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(editMode, [edit, reservation_id, reservations]);

  function editMode() {
    if (edit) {
      if (!reservations || !reservation_id) return null;

      // let's try to find the corresponding reservation:
      const foundReservation = reservations.find(
        (reservation) => reservation.reservation_id === Number(reservation_id)
      );
      console.log("foundRes:", foundReservation);
      // if it doesn't exist, or the reservation is seated, we cannot edit.
      if (foundReservation) {
        if (foundReservation.status === "seated") {
          console.log("Will deny edit");
          setDenyEdit(true);
          setLoading(false);
        } else {
          setLoading(false);
          setFormData({
            first_name: foundReservation.first_name,
            last_name: foundReservation.last_name,
            mobile_number: foundReservation.mobile_number,
            reservation_date: foundReservation.reservation_date,
            reservation_time: foundReservation.reservation_time,
            people: foundReservation.people,
            reservation_id: foundReservation.reservation_id,
          });
        }
      }
    } else {
      setLoading(false);
    }
  }

  /*------------------------VALIDATION----------------------*/

  function validateDate() {
    const reservationDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );
    const todaysDate = new Date();
    const foundErrors = [];
    if (formData.reservation_date.indexOf("-") > 4)
      foundErrors.push({ message: "Use correct data format" });

    if (reservationDate.getDay() === 2)
      foundErrors.push({
        message:
          "Reservations cannot be made on a Tuesday (Restaurant is closed).",
      });
    if (reservationDate < todaysDate)
      foundErrors.push({ message: "Uh Oh! The date of reservation has past." });

    if (
      reservationDate.getHours() < 10 ||
      (reservationDate.getHours() === 10 && reservationDate.getMinutes() < 30)
    ) {
      foundErrors.push({
        message:
          "Reservation cannot be made: Restaurant is not open until 10:30AM.",
      });
    } else if (
      reservationDate.getHours() > 22 ||
      (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30)
    ) {
      foundErrors.push({
        message:
          "Reservation cannot be made: Restaurant is closed after 10:30PM.",
      });
    } else if (
      reservationDate.getHours() > 21 ||
      (reservationDate.getHours() === 21 && reservationDate.getMinutes() > 30)
    ) {
      foundErrors.push({
        message:
          "Reservation cannot be made: Reservation must be made at least an hour before closing (10:30PM).",
      });
    }
    setErrors(foundErrors);
    return foundErrors.length > 0 ? false : true;
  }

  const errorsMapped = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };
  /*--------------------HANDLERS--------------------------*/
  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
    if (target.name === "people")
      setFormData({ ...formData, [target.name]: parseInt(target.value) });
  }

  function validateFields() {
    let foundErrors = [];
    let pattern = /^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-/\s.]?[0-9]{4}$/;
    if (!formData.first_name || formData.first_name === "")
      foundErrors.push({ message: "First name required" });
    if (!formData.last_name || formData.last_name === "")
      foundErrors.push({ message: "Last name required" });
    if (!formData.mobile_number || formData.mobile_number === "")
      foundErrors.push({ message: "Mobile required" });
    if (!formData.people || formData.people === "")
      foundErrors.push({ message: "Party size required" });
    if (!formData.reservation_date || formData.reservation_date === "")
      foundErrors.push({ message: "Date required" });
    if (!formData.reservation_time || formData.reservation_time === "")
      foundErrors.push({ message: "Time required" });
    console.log(!pattern.test(formData.mobile_number));
    if (!pattern.test(formData.mobile_number))
      foundErrors.push({ message: "Must use valid phone number" });
    setErrors(foundErrors);
    return foundErrors.length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault(); //Prevents page from refreshing and losing form data
    if (!validateFields()) return null;
    //You will need to make a POST to reservations here
    if (validateDate()) {
      const abortController = new AbortController();
      console.log("About to make put req");
      if (edit) {
        editReservation(reservation_id, formData, abortController.signal)
          .then(loadDashboard)
          .then(history.goBack())
          .catch(console.error);
      } else {
        createReservation(formData, abortController.signal) //formdata is the body
          .then(loadDashboard)
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
          .catch(console.error); //catch erros
        //Take us back to the dashboard with reservations of the data given by the new reservation
      }
      return () => abortController.abort();
    }
  }
  console.log("Loading is", loading);
  console.log("Deny edit", denyEdit);
  console.log(errors);
  /*--------------------VISUALS---------------------------*/

  //If the loading state is still true at the time of render, the reservation is outdated
  return (
    <React.Fragment>
      {!loading ? (
        !denyEdit ? (
          <div className=" container-fluid d-flex justify-content-center align-items-center">
            <form>
              {errorsMapped()}
              <div className="row d-flex mb-3 justify-content-center">
                <label className="col-2 col-form-label" htmlFor="first_name">
                  First Name:&nbsp;
                </label>
                <div className="col-10">
                  <input
                    className="form-control"
                    name="first_name"
                    type="text"
                    id="first_name"
                    onChange={handleChange}
                    value={formData.first_name}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-2 col-form-label" htmlFor="last_name">
                  Last Name:&nbsp;
                </label>
                <div className="col-10">
                  <input
                    className="form-control"
                    name="last_name"
                    type="text"
                    id="last_name"
                    onChange={handleChange}
                    value={formData.last_name}
                    required
                  />
                </div>
              </div>
              <div className="row d-flex mb-3 justify-content-center">
                <label className="col-2 col-form-label" htmlFor="mobile_number">
                  Mobile Number:&nbsp;
                </label>
                <div className="col-10">
                  <input
                    className="form-control"
                    name="mobile_number"
                    type="tel"
                    id="mobile_number"
                    onChange={handleChange}
                    value={formData.mobile_number}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  className="col-1 col-form-label"
                  htmlFor="reservation_date"
                >
                  Date:&nbsp;
                </label>
                <div className="col-3">
                  <input
                    className="form-control"
                    name="reservation_date"
                    type="date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                    required
                  />
                </div>

                <label
                  className="col-1 col-form-label"
                  htmlFor="reservation_time"
                >
                  Time:&nbsp;
                </label>
                <div className="col-3">
                  <input
                    className="form-control"
                    name="reservation_time"
                    type="time"
                    onChange={handleChange}
                    value={formData.reservation_time}
                    required
                  />
                </div>

                <label className="col-1" htmlFor="people">
                  Party size:&nbsp;
                </label>
                <div className="col-3">
                  <input
                    className="form-control"
                    name="people"
                    type="number"
                    placeholder="0"
                    onChange={handleChange}
                    value={formData.people}
                    required
                  />
                </div>
              </div>
              <div className="row d-flex mb-3 justify-content-center">
                <button
                  className="btn btn-danger m-1"
                  type="button"
                  onClick={history.goBack}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success m-1"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <h1>This reservation is already seated.</h1>
        )
      ) : (
        <h3>Reservation is outdated.</h3>
      )}
    </React.Fragment>
  );
}
