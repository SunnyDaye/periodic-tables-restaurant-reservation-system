const knex = require("../db/connection");

//TODO- list:write query to list all tables
function list() {
	return knex("tables")
		.select("*")
		.orderBy("table_name");
}

//TODO- create: write query to create new table entry
function create(table) {
	return knex("tables")
		.insert(table)
		.returning("*");
}

//TODO- read: write query to 
function read(table_id) { //to ensure table exist
    return knex("tables")
        .select("*")
        .where({ table_id: table_id })
        .first();
}

function changeTableStatus(table_id, reservation_id, status) { // to free, set reservation id to null and status to available
    return knex("tables")
        .where({ table_id: table_id })
        .update({ reservation_id: reservation_id , status });
}

module.exports = {
	list,
	create,
	read,
	changeTableStatus,

}