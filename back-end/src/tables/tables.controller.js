const service = require("./tables.service");
const {
  validateReservationId,
} = require("../reservations/reservations.controller");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const response = await service.list();

  res.json({ data: response });
}

function validateBody(req, res, next) {
  if (!req.body.data)
    return next({ status: 400, message: "Body must include a data object" });
  switch (true) {
    case !req.body.data.table_name || req.body.data.table_name === "":
      return next({
        status: 400,
        message: "'table_name' field cannot be empty",
      });

    case req.body.data.table_name.length < 2:
      return next({
        status: 400,
        message: "'table_name' field must be at least 2 characters",
      });

    case !req.body.data.capacity || req.body.data.capacity === "":
      return next({ status: 400, message: "'capacity' field cannot be empty" });

    case typeof req.body.data.capacity !== "number":
      return next({
        status: 400,
        message: "'capacity' field must be a number",
      });

    case req.body.data.capacity < 1:
      return next({
        status: 400,
        message: "'capacity' field must be at least 1",
      });
    default:
      next();
  }
}

async function create(req, res) {
  req.body.data.status = "available";

  const response = await service.create(req.body.data);

  res.status(201).json({ data: response[0] });
}

function validateSeat(req, res, next) {
  if (res.locals.table.status === "occupied") {
    return next({
      status: 400,
      message: "the table you selected is currently occupied",
    });
  }

  if (res.locals.table.capacity < res.locals.reservation.people) {
    return next({
      status: 400,
      message: `capacity: the table you selected cannot seat ${res.locals.reservation.people} people`,
    });
  }

  next();
}

function checkReqBody(req,res,next){
  if(!req.body.data || !req.body.data.reservation_id || req.body.data.reservation_id === ""){
    return next({status:400, message: "reservation_id"});
  }
  next();
}

async function update(req, res) {
  const response = await service.changeTableStatus(
    res.locals.table.table_id,
    res.locals.reservation.reservation_id,
    "occupied"
  );

  res.status(200).json({ data: response });
}

async function validateTableId(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (!table) {
    return next({ status: 400, message: "given table does not exist" });
  }

  res.locals.table = table;

  next();
}

async function validateSeatedTable(req, res, next) {
  if (!res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: "given table does not have a corresponding reservation",
    });
  }

  if (res.locals.table.status !== "occupied") {
    return next({
      status: 400,
      message: "you can only finish occupied tables",
    });
  }

  next();
}

async function destroy(req, res) {
  const response = await service.changeTableStatus(
    res.locals.table.table_id,
    null,
    "available"
  );

  res.status(200).json({ data: response });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateBody, asyncErrorBoundary(create)],
  update: [
    checkReqBody,
    validateTableId,
    validateReservationId,
    validateSeat,
    asyncErrorBoundary(update),
  ],
  destroy: [validateTableId, validateSeatedTable, asyncErrorBoundary(destroy)],
};