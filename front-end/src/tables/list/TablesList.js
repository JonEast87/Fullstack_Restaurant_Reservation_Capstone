import React from 'react'
import Table from '../table/Table'

function TablesList({ tables }) {
	let tablesList = null

	if (tables.length) {
		tablesList = tables.map((table, index) => (
			<div className='col mb-4' key={index}>
				<div className='card h-100'>
					<Table table={table} />
				</div>
			</div>
		))
	}

	return (
		<div className='row row-cols-1 row-cols-md-3'>
			{tablesList ?? <li>loading... tables</li>}
		</div>
	)
}

export default TablesList