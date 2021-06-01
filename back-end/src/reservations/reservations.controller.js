const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



/*
 * List handler for reservation resources
 */
async function list(req, res) {
  // create a variable that holds the return value of the list function call from servicee
  const reservation_date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if(mobile_number){
    res.json({
      data: await service.getReservationsByNumber(mobile_number),
    });
  }
  res.json({
    data: await service.list(reservation_date),
  });
}
// TODO: Create validation function
/*
* Post request body validator
*/  
function validateBody(req, res, next) {
	if(!req.body.data) {
		return next({ status: 400, message: "Body must include a data object" });
	}

	const requiredFields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

	for(const field of requiredFields) {
		if(!req.body.data.hasOwnProperty(field) || req.body.data[field] === "") {
			return next({ status: 400, message: `Field required: '${field}'` });
		}
	}

  switch(true){
    case (Number.isNaN(Date.parse(`${req.body.data.reservation_date} ${req.body.data.reservation_time}`))):
      return next({ status: 400, message: "'reservation_date' or 'reservation_time' field is in an incorrect format" });
    case (typeof req.body.data.people !== "number"):
      return next({ status: 400, message: "'people' field must be a number" });
    case (req.body.data.people < 1):
      return next({ status: 400, message: "'people' field must be at least 1" });
    case (req.body.data.status === "seated" || req.body.data.status === "finished"): 
      return next({status: 400, message: "reservation must not be seated or finished"});
    default: next();
  }
	
}

function validateDate(req, res, next) {
	const reserveDate = new Date(`${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`);
	const todaysDate = new Date();

  switch(true){
    case (reserveDate.getDay() === 2):
      return next({ status: 400, message: "'reservation_date' field: restauraunt is closed on tuesday" });
    case (reserveDate < todaysDate):
      return next({ status: 400, message: "'reservation_date' and 'reservation_time' field must be in the future" });
    case (reserveDate.getHours() < 10 || (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)):
      return next({ status: 400, message: "'reservation_time' field: restaurant is not open until 10:30AM" });
    case (reserveDate.getHours() > 22 || (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)):
      return next({ status: 400, message: "'reservation_time' field: restaurant is closed after 10:30PM" });
    case (reserveDate.getHours() > 21 || (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)):
      return next({ status: 400, message: "'reservation_time' field: reservation must be made at least an hour before closing (10:30PM)" });
    default: next();
  }
	
}
/*
* Creat handler for reservations
*/
async function create(req, res) {
	// i added this here because every new reservation automatically has a status of "booked"
	// we can just edit the body object here, then pass it onto the response
	req.body.data.status = "booked";

	const response = await service.create(req.body.data);

	// when knex creates things, it'll return something in the form of an array. we only want the first object, so i access the 0th index here
	res.status(201).json({ data: response[0] });
}

async function validateReservationId(req, res, next) {
  const  reservation_id  = (req.params.reservation_id) ? req.params.reservation_id: req.body.data.reservation_id;
  const reservation = await service.read(reservation_id);

  if(!reservation) {
      return next({ status: 404, message: `Reservation id ${reservation_id} does not exist` });
  }

  res.locals.reservation = reservation;

  next();
}


function read(req,res){
  res.json({data: res.locals.reservation});
}

function checkStatus(req,res,next){
  const { status } = res.locals.reservation;
  if(status == "finished"){
    next({ status:400, message:"Reservation is already finished. Cannot Update"});
  }

  if(req.body.data.status == "unknown"){
    next({ status:400, message:"Reservation is unknown"});
  }
  next();
}

async function update(req,res){
  const {status} = req.body.data;
  const {reservation_id} = res.locals.reservation;
  const response =  await service.update(reservation_id,status);
  let data;
  if(response){
    res.locals.reservation.status = status;
    data = res.locals.reservation;
  }

  res.status(200).json({data});
}

async function edit(req, res) {
	const response = await service.edit(res.locals.reservation.reservation_id, req.body.data);
  const data = await service.read(req.params.reservation_id);

	res.status(200).json({ data });
}

module.exports = {
	list: asyncErrorBoundary(list),
	create: [validateBody, validateDate, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(validateReservationId),read],
  update: [asyncErrorBoundary(validateReservationId),checkStatus,asyncErrorBoundary(update)],
  edit: [validateReservationId, validateBody, validateDate, asyncErrorBoundary(edit)],
  validateReservationId: asyncErrorBoundary(validateReservationId),
};
