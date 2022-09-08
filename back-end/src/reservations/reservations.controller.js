const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/ayncErrorBoundary')
const hasProperty = require('../errors/hasProperties')
const hasRequiredProperties = hasProperty(
	'first_name',
	'last_name',
	'mobile_number',
	'reservation_date',
	'reservation_time',
	'people'
)

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

const VALID_PROPERTIES = [
	'first_name',
	'last_name',
	'mobile_number',
	'reservation_date',
	'reservation_time',
	'people',
	'created_at',
	'updated_at',
]

function hasOnlyValidProperties(req, res, next) {
	const { data = {} } = req.body

	const invalidFields = Object.keys(data).filter(
		(field) => !VALID_PROPERTIES.includes(field)
	)

	if (invalidFields.length) {
		return next({
			status: 400,
			message: `Invalid field(s): ${invalidFields.join(', ')}`,
		})
	}
	next()
}

function timeIsValid(timeString) {
	return timeString.match(/[0-9]{2}:[0-9]{2}/)
}

function dataFormatIsValid(dateString) {
	return dateString.match(/\d{4}-\d{2}-\d{2}/)
}

function dayIsTuesday(dateString) {
	const date = new Date(dateString)
	return date.getUTCDate() !== 2
}

function dateIsNotPast(reservation_date, reservation_time) {
	const today = Date.now()
	const date = new Date(`${reservation_date} ${reservation_time}`).valueOf()
	return date > today
}

function hasValidValues(req, res, next) {
	const { reservation_date, reservation_time, people } = req.body.data

	if (!Number.isInteger(people) || people < 1) {
		return next({
			status: 400,
			message: 'Amount of people must be a whole number.',
		})
	}

	if (!timeIsValid(reservation_time)) {
		return next({
			status: 400,
			message: 'reservation_time',
		})
	}

	if (!dataFormatIsValid(reservation_date)) {
		return next({
			status: 400,
			message: 'reservation_date',
		})
	}

	if (!dateIsNotPast(reservation_date, reservation_time)) {
		return next({
			status: 400,
			message: 'This date is not the past, please schedule for a future day.',
		})
	}

	if (dayIsTuesday(reservation_date)) {
		return next({
			status: 400,
			message: 'closed',
		})
	}
	next()
}

// ---- CRUD ----

/**
 * List handler for reservation resources
 */
async function list(req, res) {
	const { date } = req.query
	const reservations = await service.list(date)
	res.locals.data = reservations
	const { data } = res.locals
	res.json({ data: data })
}

async function create(req, res) {
	const reservation = await service.create(req.body.data)
	res.status(201).json({ data: reservation })
}

module.exports = {
	create: [
		hasOnlyValidProperties,
		hasRequiredProperties,
		hasValidValues,
		asyncErrorBoundary(create),
	],
	list: [asyncErrorBoundary(list)],
}
