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

const dateFormat = /^\d\d\d\d-\d\d-\d\d$/
const timeFormat = /^\d\d:\d\d$/

function timeIsValid(timeString) {
	return timeString.match(timeFormat)?.[0]
}

function dataFormatIsValid(dateString) {
	return dateString.match(dateFormat)?.[0]
}

function timeBusinessHours(timeString) {
	return timeString <= '10:30' && timeString >= '21:30'
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

	// if (!timeBusinessHours(reservation_time)) {
	// 	return {
	// 		status: 400,
	// 		message:
	// 			'Your reservation time must be between the hours of 10:30AM and 9:30PM.',
	// 	}
	// }
	next()
}

// ---- CRUD ----

/**
 * List handler for reservation resources
 */
async function list(req, res) {
	const { mobile_number, date } = req.query
	const reservations = await (mobile_number
		? service.searchByPhone(mobile_number)
		: service.searchByDate(date))

	res.json({ data: reservations })
}

async function read(req, res) {
	const { reservation } = res.locals
	res.json({ data: reservation })
}

async function create(req, res) {
	const reservation = await service.create(req.body.data)
	res.status(201).json({ data: reservation })
}

module.exports = {
	list,
	create: [
		hasOnlyValidProperties,
		hasRequiredProperties,
		hasValidValues,
		asyncErrorBoundary(create),
	],
	read: [reservationExists, asyncErrorBoundary(read)],
}
