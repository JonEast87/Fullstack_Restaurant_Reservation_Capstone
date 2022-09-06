const knex = require('../db/connection')

function list() {
	return knex('reservations').select('*')
}

function create(reservation) {
	return knex('reservations')
		.insert(reservation)
		.returning('*')
		.then((data) => data[0])
}

function read(id) {
	return knex('reservations')
		.select('*')
		.where({ reservation_id: Number(id) })
		.then((result) => result[0])
}

function searchByDate(date) {
	return knex('reservations')
		.select('*')
		.where({ reservation_date: date })
		.orderBy('reservation_time')
}

function searchByPhone(number) {
	return knex('reservations')
		.whereRaw(
			"translate(mobile_number, '() -', '') like ?",
			`%${mobile_number.replace(/\D/g, '')}%`
		)
		.orderBy('reservation_date')
}

module.exports = {
	list,
	create,
	read,
	searchByDate,
	searchByPhone,
}
