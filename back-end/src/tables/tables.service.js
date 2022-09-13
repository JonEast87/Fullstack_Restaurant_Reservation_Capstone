const knex = require('../db/connection')

function list() {
	return knex('tables').select('*').orderBy('table_name')
}

function create(table) {
	return knex('tables')
		.insert(table)
		.returning('*')
		.then((data) => data[0])
}

function read(table_id) {
	return knex('tables')
		.select('*')
		.where({ table_id: table_id })
		.then((result) => result[0])
}

async function update(updateTable, reservationId, updateReservation) {
	try {
		await knex.transaction(async (transaction) => {
			const returnUpdateTable = await transaction('tables')
				.where({ table_id: updateTable.table_id })
				.update(updateTable, '*')
				.then((updatedTables) => updatedTables[0])

			const returnUpdateReservation = await transaction('reservations')
				.where({ reservation_id: reservationId })
				.update({ status: updateReservation }, '*')
				.then((updatedReservation) => updatedReservation[0])
		})
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
	list,
	create,
	read,
	update,
}
