import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

export default function NewReservation({ edit, reservations, setRerender}) {
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
  
  /*------------------------VALIDATION----------------------*/
  if (edit) {
    // if either of these don't exist, we cannot continue.
    if (!reservations || !reservation_id) return null;

    // let's try to find the corresponding reservation:
    const foundReservation = reservations.find(
      (reservation) => reservation.reservation_id === Number(reservation_id)
    );

    // if it doesn't exist, or the reservation is booked, we cannot edit.
    if (!foundReservation || foundReservation.status !== "booked") {
      return <p>Only booked reservations can be edited.</p>;
    }
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

  function validateDate() {
    
    const reservationDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );
    const todaysDate = new Date();
    const foundErrors = [];
    if(formData.reservation_date.indexOf('-') > 4) foundErrors.push({message: "Use correct data format"});
    if (reservationDate.getDay() === 2)
      foundErrors.push({
        message:
          "Reservations cannot be made on a Tuesday (Restaurant is closed).",
      });
    if (reservationDate < todaysDate)
      foundErrors.push({ message: "Uh Oh! The date of reservation has past." });

    console.log("Hours and minutes:",reservationDate.getHours(), reservationDate.getMinutes());
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
    if(target.name === "people") setFormData({ ...formData, [target.name]:parseInt(target.value)});
  }

  function validateFields(){
    let foundErrors = [];
    if(!formData.first_name || formData.first_name === "") foundErrors.push({message:"First name required"});
    if(!formData.last_name || formData.last_name === "") foundErrors.push({message:"Last name required"});
    if(!formData.mobile_number || formData.mobile_number === "") foundErrors.push({message:"Mobile required"});
    if(!formData.people || formData.people === "") foundErrors.push({message:"Party size required"});
    if(!formData.reservation_date || formData.reservation_date === "") foundErrors.push({message:"Date required"});
    if(!formData.reservation_time || formData.reservation_time === "") foundErrors.push({message:"Time required"});
    setErrors([...errors,...foundErrors]);
    return foundErrors.length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault(); //Prevents page from refreshing and losing form data
    if(!validateFields()) return null;
    //You will need to make a POST to reservations here
    const abortController = new AbortController();
    createReservation(formData, abortController.signal) //formdata is the body
      .then((newRes) => {
        setRerender(true);
      }) //force rerender
      .catch((error) => {
        console.log(error);
      }); //catch erros
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
