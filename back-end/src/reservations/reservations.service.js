const knex = require('../db/connection')

function list(date) {
	return knex('reservations')
		.select('*')
		.where({ reservation_date: date })
		.orderBy('reservation_time')
}

function read(id) {
	return knex('reservations')
		.select('*')
		.where({ reservation_id: id })
		.then((data) => data[0])
}

function create(reservation) {
	return knex('reservations')
		.insert(reservation)
		.returning('*')
		.then((data) => data[0])
}

function update(reservation_id, status) {
	return knex('reservations').where({ reservation_id }).update({ status }, '*')
}

module.exports = {
	list,
	create,
	read,
	update,
}
