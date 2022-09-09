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

function update(updateTable) {
	return knex('tables')
		.select('*')
		.where({ table_id: updateTable.table_id })
		.update(updateTable, '*')
		.then((updatedTables) => updatedTables[0])
}

module.exports = {
	list,
	create,
	read,
	update,
}
