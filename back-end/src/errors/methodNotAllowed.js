function methodNotAllowed(req, res, next) {
	next({
		status: 405,
		message: ` ${request.originalUrl} does not allow ${req.method}`,
	});
}
  
module.exports = methodNotAllowed;
  