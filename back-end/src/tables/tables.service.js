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

async function update(updatedTable, resId, updatedResStatus) {
	try {
		await knex.transaction(async (transaction) => {
			const returnedUpdatedTable = await transaction('tables')
				.where({ table_id: updatedTable.table_id })
				.update(updatedTable, '*')
				.then((updateTables) => updateTables[0])

			const returnUpdatedReservation = await transaction('reservations')
				.where({ reservation_id: resId })
				.update({ status: updatedResStatus }, '*')
				.then((updatedReservations) => updatedReservations[0])
		})
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	create,
	read,
	update,
	list,
}
