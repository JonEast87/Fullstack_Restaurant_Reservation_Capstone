const service = require('./tables.service')
const serviceReservation = require('../reservations/reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require('../errors/hasProperties')

const VALID_PROPERTIES = ['table_name', 'capacity', 'reservation_id']
const hasRequiredProperties = hasProperties(...['table_name', 'capacity'])

async function hasReservationId(req, res, next) {
	if (req.body?.data?.reservation_id) {
		return next()
	}
	next({
		status: 400,
		message: `reservation_id is missing from request.`,
	})
}

async function reservationExists(req, res, next) {
	const { reservation_id } = req.body.data
	const reservation = await serviceReservation.read(reservation_id)

	if (reservation) {
		res.locals.reservation = reservation
		return next()
	}
	next({
		status: 404,
		message: `Reservation with id: ${reservation_id} was not found.`,
	})
}

async function reservationBooked(req, res, next) {
	const { reservation } = res.locals
	if (reservation.status !== 'seated') {
		return next()
	}
	next({
		status: 400,
		message: 'Reservation is already "seated".',
	})
}

async function tableExists(req, res, next) {
	const { table_id } = req.params
	const table = await service.read(table_id)

	if (table) {
		res.locals.table = table
		return next()
	}
	next({
		status: 404,
		message: `Table with id: ${table_id} was not found.`,
	})
}

function tableSize(req, res, next) {
	const { table, reservation } = res.locals
	if (table.capacity >= reservation.people) {
		return next()
	}
	next({
		status: 400,
		message: `This table (${table.table_id}) does not have the capacity to host your party of ${reservation.people} people.`,
	})
}

function tableIsFree(req, res, next) {
	const { table } = res.locals
	if (!table.reservation_id) {
		return next()
	}
	next({
		status: 400,
		message: `Table with id ${table.table_id} is already occupied.`,
	})
}

function tableIsNotFree(req, res, next) {
	const { table } = res.locals
	if (table.reservation_id) {
		return next()
	}
	next({
		status: 400,
		message: `Table with id ${table.table_id} is not occupied.`,
	})
}

function occupyTable(req, res, next) {
	const { table } = res.locals
	const { reservation_id } = req.body.data
	table.reservation_id = reservation_id
	res.locals.resId = reservation_id
	res.locals.resStatus = 'seated'
	if (table.reservation_id) {
		return next()
	}
	next({
		status: 400,
		message: `Table with id ${table.table_id} is not assignable to reservation id ${table.reservation_id}.`,
	})
}

function unoccupyTable(req, res, next) {
	const { table } = res.locals
	res.locals.resId = table.reservation_id
	table.reservation_id = null
	res.locals.resStatus = 'finished'
	if (!table.reservation_id) {
		return next()
	}
	next({
		status: 400,
		message: `Table with id ${table.table_id} is not removable from reservation id ${table.reservation_id}.`,
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

function tableIsValid(tableName) {
	return tableName.length > 1
}

function capacityIsValid(capacity) {
	return Number.isInteger(capacity) && capacity >= 1
}

function hasValidValues(req, res, next) {
	const { table_name, capacity } = req.body.data

	if (!capacityIsValid(capacity)) {
		return next({
			status: 400,
			message: 'The capacity must be a whole number.',
		})
	}

	if (!tableIsValid(table_name)) {
		return next({
			status: 400,
			message: `table_name must be more than one character.`,
		})
	}
	next()
}

async function list(req, res) {
	const tables = await service.list()
	res.locals.data = tables
	const { data } = res.locals
	res.json({ data: data })
}

async function create(req, res) {
	const data = await service.create(req.body.data)
	res.status(201).json({ data })
}

async function read(req, res) {
	const { table } = res.locals
	res.json({ data: table })
}

async function update(req, res) {
	const { table, resId, resStatus } = res.locals
	const updateTable = {
		...table,
	}
	const data = await service.update(updateTable, resId, resStatus)
	res.json({ data })
}

module.exports = {
	create: [
		hasOnlyValidProperties,
		hasRequiredProperties,
		hasValidValues,
		asyncErrorBoundary(create),
	],
	read: [tableExists, asyncErrorBoundary(read)],
	update: [
		hasReservationId,
		reservationExists,
		reservationBooked,
		tableExists,
		tableSize,
		tableIsFree,
		occupyTable,
		asyncErrorBoundary(update),
	],
	destroy: [
		asyncErrorBoundary(tableExists),
		tableIsNotFree,
		unoccupyTable,
		asyncErrorBoundary(update),
	],
	list: asyncErrorBoundary(list),
}
