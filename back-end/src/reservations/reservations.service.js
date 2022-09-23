const knex = require('../db/connection')

function create(reservation) {
	return knex('reservations')
		.insert(reservation)
		.returning('*')
		.then((data) => data[0])
}

function read(id) {
	return knex('reservations')
		.select('*')
		.where({ reservation_id: id })
		.then((data) => data[0])
}

function update(reservation_id, updatedReservation) {
	return knex('reservations')
		.where({ reservation_id })
		.update(updatedReservation, '*')
		.then((result) => result[0])
}

function updateStatus(reservation_id, status) {
	return knex('reservations').where({ reservation_id }).update({ status }, '*')
}

function searchDate(date) {
	return knex('reservations')
		.select('*')
		.where({ reservation_date: date })
		.whereNot('status', 'finished')
		.orderBy('reservation_time')
}

function searchMobile(mobile_number) {
	return knex('reservations')
		.whereRaw(
			"translate(mobile_number, '() -', '') like ?",
			`%${mobile_number.replace(/\D/g, '')}%`
		)
		.orderBy('reservation_date')
}

module.exports = {
	create,
	read,
	update,
	updateStatus,
	searchDate,
	searchMobile,
}
