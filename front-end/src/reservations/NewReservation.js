import React, { useState } from "react";
import { useHistory } from "react-router-dom";

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

  /*--------------------HANDLERS--------------------------*/
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault(); //Prevents page from refreshing and losing form data
    //You will ween to make a POST to reservations here
    history.push(`/dashboard?date=${formData.reservation_date}`); //Take us back to the dashboard with reservations of the data given by the new reservation
  };

  /*--------------------VISUALS---------------------------*/
  return (
    <form>
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
      <input name="last_name" type="text" id="last_name"onChange={handleChange} value={formData.last_name}/>
      <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
      <input name="mobile_number" type="text" id="mobile_number" onChange={handleChange} value={formData.mobile_number}/>
      <label htmlFor="reservation_date">Date:&nbsp;</label>
      <input name="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" onChange={handleChange} value={formData.reservation_date}/>
      <label htmlFor="reservation_time">Time:&nbsp;</label>
      <input name="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" onChange={handleChange} value={formData.reservation_time}/>
      <label htmlFor="people">Party size:&nbsp;</label>
      <input name="people" type="text" placeholder="0" onChange={handleChange} value={formData.people}/>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}
