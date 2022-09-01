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

module.exports = {
	list,
	create,
	read,
}
