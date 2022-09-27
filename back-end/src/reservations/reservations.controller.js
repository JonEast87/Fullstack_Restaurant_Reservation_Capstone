const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require('../errors/hasProperties')

//* Validation vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

async function reservationExists(req, res, next) {
	const { reservationId } = req.params
	const reservation = await service.read(reservationId)

	if (reservation) {
		res.locals.reservation = reservation
		return next()
	}
	next({
		status: 404,
		message: `Reservation with id: ${reservationId} was not found`,
	})
}

const VALID_PROPERTIES = [
	'first_name',
	'last_name',
	'mobile_number',
	'reservation_date',
	'reservation_time',
	'people',
	'status',
	'reservation_id',
	'created_at',
	'updated_at',
]

function hasOnlyValidProperties(req, res, next) {
	const { data = {} } = req.body
	const invalidStatuses = Object.keys(data).filter(
		(field) => !VALID_PROPERTIES.includes(field)
	)
	if (invalidStatuses.length) {
		return next({
			status: 400,
			message: `Invalid field(s): ${invalidStatuses.join(', ')}`,
		})
	}
	next()
}

const REQUIRED_PROPERTIES = [
	'first_name',
	'last_name',
	'mobile_number',
	'reservation_date',
	'reservation_time',
	'people',
]

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES)

const dateFormat = /^\d\d\d\d-\d\d-\d\d$/
const timeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/

function validTime(timeString) {
	return timeString.match(timeFormat)?.[0]
}

function validDate(dateString) {
	return dateString.match(dateFormat)?.[0]
}

function pastDate(reservation_date, reservation_time) {
	const today = Date.now()
	const date = new Date(`${reservation_date} ${reservation_time}`)
	return date.valueOf() > today
}

function businessHours(reservation_time) {
	const open = '10:30'
	const close = '21:30'
	return reservation_time <= close && reservation_time >= open
}

function tuesdayDate(dateString) {
	const date = new Date(dateString)
	return date.getUTCDay() !== 2
}

function bookedOrNot(status) {
	if (!status || status === 'booked') {
		return true
	} else {
		return false
	}
}

function hasValidValues(req, res, next) {
	const { reservation_date, reservation_time, people } = req.body.data

	if (!Number.isInteger(people) || people < 1) {
		return next({
			status: 400,
			message:
				'The number of people must be a whole number and greater than 1.',
		})
	}
	if (!validTime(reservation_time)) {
		console.log(reservation_time)
		return next({
			status: 400,
			message: 'The reservation_time must be in HH:MM:SS (or HH:MM) format.',
		})
	}
	if (!validDate(reservation_date)) {
		return next({
			status: 400,
			message: 'The reservation_date must be in YYYY-MM-DD (ISO-8601) format.',
		})
	}
	if (!pastDate(reservation_date, reservation_time)) {
		return next({
			status: 400,
			message:
				'The reservation_time and/or reservation_date is in the past. Only future reservations are allowed.',
		})
	}
	if (!businessHours(reservation_time)) {
		return next({
			status: 400,
			message: 'The reservation time must be between 10:30 AM and 9:30 PM.',
		})
	}
	if (!tuesdayDate(reservation_date)) {
		return next({
			status: 400,
			message:
				'We can hold this reservation, the restaurant is closed on Tuesdays.',
		})
	}
	if (!bookedOrNot(req.body.data?.status)) {
		return next({
			status: 400,
			message:
				'Cannot use "seated" or "finished" as statuses when creating a reservation.',
		})
	}
	next()
}

function validStatus(req, res, next) {
	const { status } = req.body.data
	const VALID_STATUSES = ['seated', 'finished', 'booked', 'cancelled']

	if (!VALID_STATUSES.includes(status)) {
		return next({
			status: 400,
			message: `${status} is an invalid status.`,
		})
	}
	next()
}

function finishedStatus(req, res, next) {
	const { status } = res.locals.reservation

	if (status === 'finished') {
		return next({
			status: 400,
			message: `Once a reservationm is finished it cannot be updated.`,
		})
	}
	next()
}

function bookedStatus(req, res, next) {
	const { status } = res.locals.reservation
	if (status !== 'booked') {
		return next({
			status: 400,
			message: 'Only "booked" reservations maybe edited.',
		})
	}
	next()
}

function editedStatus(req, res, next) {
	const { status } = res.locals.reservation
	if (status !== 'booked') {
		return next({
			status: 400,
			message: 'Only "booked" reservations may be edited.',
		})
	}
	next()
}

function hasValidQuery(req, res, next) {
	const { date, mobile_number } = req.query
	if (!date && !mobile_number) {
		return next({
			status: 400,
			message: `You need to use a "?date" or "?mobile_number" query.`,
		})
	}
	next()
}

// ---- CRUD ----

/**
 * List handler for reservation resources
 */
async function list(req, res) {
	const { mobile_number, date } = req.query
	const reservations = await (mobile_number
		? service.searchMobile(mobile_number)
		: service.searchDate(date))
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
 * Update hanndker for reservation resources
 */
async function update(req, res) {
	const { reservation_id } = res.locals.reservation
	const newReservationDetails = req.body.data
	const existingReservation = res.locals.reservation
	const mergedReservation = {
		...existingReservation,
		...newReservationDetails,
	}
	let updatedReservation = await service.update(
		reservation_id,
		mergedReservation
	)
	res.status(200).json({ data: updatedReservation })
}

/**
 *  Update handler for reservation statuses
 */
async function updateStatus(req, res) {
	const newStatus = req.body.data.status
	const { reservation_id } = res.locals.reservation
	let data = await service.updateStatus(reservation_id, newStatus)
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
		hasOnlyValidProperties,
		hasRequiredProperties,
		hasValidValues,
		editedStatus,
		bookedStatus,
		asyncErrorBoundary(update),
	],
	updateStatus: [
		reservationExists,
		validStatus,
		finishedStatus,
		asyncErrorBoundary(updateStatus),
	],
	list: [hasValidQuery, asyncErrorBoundary(list)],
}
