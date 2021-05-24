import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
export default function NewReservation() {
  /*---------------------HOOKS------------------------*/
  const history = useHistory();

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
  /*------------------------VALIDATION----------------------*/
  function validateDate() {
    const reservationDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );
    const todaysDate = new Date();
    const foundErrors = [];
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
  }
  function handleSubmit(event) {
    event.preventDefault(); //Prevents page from refreshing and losing form data
    //You will ween to make a POST to reservations here

    if (validateDate())
      history.push(`/dashboard?date=${formData.reservation_date}`); //Take us back to the dashboard with reservations of the data given by the new reservation
  }

  /*--------------------VISUALS---------------------------*/
  return (
    <form>
      {errorsMapped()}
      <label htmlFor="first_name">First Name:&nbsp;</label>
      <input
        name="first_name"
        id="first_name"
        type="text"
        onChange={handleChange}
        value={formData.first_name}
        required
      />
      <label htmlFor="last_name">Last Name:&nbsp;</label>
      <input
        name="last_name"
        type="text"
        id="last_name"
        onChange={handleChange}
        value={formData.last_name}
        required
      />
      <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
      <input
        name="mobile_number"
        type="tel"
        id="mobile_number"
        onChange={handleChange}
        value={formData.mobile_number}
        required
      />
      <label htmlFor="reservation_date">Date:&nbsp;</label>
      <input
        name="reservation_date"
        type="date"
        onChange={handleChange}
        value={formData.reservation_date}
        required
      />
      <label htmlFor="reservation_time">Time:&nbsp;</label>
      <input
        name="reservation_time"
        type="time"
        onChange={handleChange}
        value={formData.reservation_time}
        required
      />
      <label htmlFor="people">Party size:&nbsp;</label>
      <input
        name="people"
        type="number"
        placeholder="0"
        onChange={handleChange}
        value={formData.people}
        required
      />
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}