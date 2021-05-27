const knex = require("../db/connection");

// TODO- list function: write knex query to list all reservations from a specific date

/* list
    @params {string} date note: this will be from req.query.date  from the request obj. Make sure it's the correct format for
    @returns {an array holding a list of resevation objects}
*/

function list(reservation_date){
    return knex("reservations").select("*").where({ reservation_date }); 
}

// TODO- create: write knex query to create a new resrvation 



module.exports = {
    list,
}