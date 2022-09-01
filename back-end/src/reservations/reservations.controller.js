const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/ayncErrorBoundary')

// ---- Validation Handlers ----

async function reservationExists(req, res, next) {
	const { reservationId } = req.params
	const reservation = await service.read(reservationId)

	if (reservation) {
		res.locals.reservation = reservation
		return next()
	}
	next({
		status: 400,
		message: `Reservation with id: ${reservationId} was not found.`,
	})
}

// ---- CRUD ----

/**
 * List handler for reservation resources
 */
async function list(req, res) {
	service
		.list()
		.then((data) => res.json(data))
		.catch((err) => console.log(err))
}

async function create(req, res) {
	const reservation = await service.create(req.body.data)
	res.status(201).json({ data: reservation })
}

function read(req, res) {
	const { reservation: data } = res.locals
	res.json({ data })
}

module.exports = {
	list,
	create,
	read: [reservationExists, asyncErrorBoundary(read)],
}
