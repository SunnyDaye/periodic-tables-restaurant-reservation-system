const service = require("./reservations.service");

/*
 * List handler for reservation resources
 */
async function list(req, res) {
  // create a variable that holds the return value of the list function call from servicee
  const reservation_date = req.query.date;
  res.json({
    data: await service.list(reservation_date),
  });
}

module.exports = {
  list,
};
