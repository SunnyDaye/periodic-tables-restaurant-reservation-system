const knex = require("../db/connection");

// TODO- list function: write knex query to list all reservations from a specific date

/* list
    @params {string} date note: this will be from req.query.date  from the request obj. Make sure it's the correct format for
    @returns {an array holding a list of resevation objects}
*/

function list(reservation_date){
    return (reservation_date) 
    ? knex("reservations").select("*").where({ reservation_date }).andWhereNot({status: "finished"}).andWhereNot({status:"cancelled"}).orderBy(["reservation_date","reservation_time"])
    : knex("reservations").select("*").orderBy(["reservation_date","reservation_time"]); 
}

function getReservationsByNumber(mobile_number){
    return knex("reservations").select("*").where("mobile_number","like",`%${mobile_number}%`);
}

// TODO- create: write knex query to create a new resrvation 
function create(reservation) {
	return knex("reservations")
		.insert(reservation)
		.returning("*");
}

//TODO- read: write query to read a single reservation
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

//TODO- update: write query to update a reservations. Used for updating reservation status.
function update(reservation_id,status){
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({status});
}

function edit(reservation_id, reservation) {
	return knex("reservations")
		.where({ reservation_id })
		.update({ ...reservation });
}

module.exports = {
    list,
    getReservationsByNumber,
    create,
    read,
    update,
    edit,
}