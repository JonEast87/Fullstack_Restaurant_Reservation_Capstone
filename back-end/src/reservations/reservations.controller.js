const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperty = require('../errors/hasProperties')

const VALID_PROPERTIES = [
	'first_name',
	'last_name',
	'mobile_number',
	'reservation_date',
	'reservation_time',
	'people',
	'status',
]

const hasRequiredProperties = hasProperty(...VALID_PROPERTIES)

// ---- Validation Handlers ----

async function reservationExists(req, res, next) {
	const { reservationId } = req.params
	const reservation = await service.read(reservationId)

	if (reservation) {
		res.locals.reservation = reservation
		return next()
	}
	next({
		status: 404,
		message: `Reservation with id: ${reservationId} was not found.`,
	})
}

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
	return date.getUTCDate() === 2
}

function dateIsNotPast(reservation_date, reservation_time) {
	const today = Date.now()
	const date = new Date(`${reservation_date} ${reservation_time}`)
	return date.valueOf() > today
}

function statusBooked(status) {
	if (!status || status === 'booked') {
		return true
	} else {
		return false
	}
}

function isBusinessHours(reservation_time) {
	return reservation_time <= '21:30' && reservation_time >= '10:30'
}

function hasValidValues(req, res, next) {
	const { reservation_date, reservation_time, people, status } = req.body.data

	if (!Number.isInteger(people) || people < 1) {
		return next({
			status: 400,
			message: 'Amount of people must be a whole number.',
		})
	}

	if (!timeIsValid(reservation_time)) {
		return next({
			status: 400,
			message: 'This is not a valid format for time. HH:MM',
		})
	}

	if (!dataFormatIsValid(reservation_date)) {
		return next({
			status: 400,
			message: 'This is not a valid format for dates. YYYY-MM-DD',
		})
	}

	if (!dateIsNotPast(reservation_date, reservation_time)) {
		return next({
			status: 400,
			message: 'This date has past, please schedule for a future day.',
		})
	}

	if (!isBusinessHours(reservation_time)) {
		return next({
			status: 400,
			message: 'This is not during operating hours (10:30AM - 9:30PM).',
		})
	}

	if (dayIsTuesday(reservation_date)) {
		return next({
			status: 400,
			message: 'The establishment is closed on Tuesdays.',
		})
	}

	if (!statusBooked(status)) {
		return next({
			status: 400,
			message: 'Cannot use "seated" or "finished" statuses upon creation.',
		})
	}
	next()
}

function statusValid(req, res, next) {
	const { status } = req.body.data
	const VALID_STATUSES = ['seated', 'finished', 'booked']

	if (!VALID_STATUSES.includes(status)) {
		return next({
			status: 400,
			message: `${status} is invalid.`,
		})
	}
	next()
}

function statusFinished(req, res, next) {
	const { status } = res.locals.reservation

	if (status === 'finished') {
		return next({
			status: 400,
			message: 'Once a reservation is finished it cannot be updated.',
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
	res.json({ data: reservations })
}

/**
 * Read handler for reservation resources
 */
async function read(req, res) {
	const { reservation } = res.locals
	res.json({ data: reservation })
}

/**
 * Create handler for reservation resources
 */
async function create(req, res) {
	const data = await service.create(req.body.data)
	res.status(201).json({ data })
}

/**
 * Create update for reservation resources
 */
async function update(req, res) {
	const newStatus = req.body.data.status
	const reservationId = res.locals.reservation.reservation_id
	let data = await service.update(reservationId, newStatus)
	res.status(200).json({ data: { status: newStatus } })
}

module.exports = {
	create: [
		hasOnlyValidProperties,
		hasRequiredProperties,
		hasValidValues,
		asyncErrorBoundary(create),
	],
	read: [reservationExists, asyncErrorBoundary(read)],
	update: [
		reservationExists,
		statusValid,
		statusFinished,
		asyncErrorBoundary(update),
	],
	list: asyncErrorBoundary(list),
}
