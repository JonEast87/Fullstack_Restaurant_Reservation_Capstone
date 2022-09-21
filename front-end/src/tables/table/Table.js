import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { clearTable } from '../../utils/api'
import ErrorAlert from '../../layout/ErrorAlert'

function Table({ table }) {
	const { table_name, table_id, capacity } = table
	const occupied = table.reservation_id
	const history = useHistory()
	const [clearTableError, setClearTableError] = useState(null)

	const confirm = () => {
		if (window.confirm('Is this table ready to seat new guests?') === true) {
			const abortController = new AbortController()
			setClearTableError(null)

			clearTable(table_id, abortController.signal)
				.then(() => history.go(0))
				.catch(setClearTableError)

			return () => abortController.abort()
		}
	}

	let finish = null
	if (occupied) {
		finish = (
			<button
				className='btn btn-primary'
				data-table-id-finish={table.table_id}
				onClick={confirm}>
				Finish
			</button>
		)
	}

	return (
		<div className='card-body'>
			<h5 className='card-title'>Table {table_name}</h5>
			<ul className='list-group list-group-flush'>
				<li className='list-group-item'>Capacity: {capacity}</li>
				<li className='list-group-item'>
					<div className={`bg-${occupied ? 'light' : 'success'}`}>
						<h6 className='text-center' data-table-id-status={`${table_id}`}>
							{occupied ? 'occupied' : 'free'}
						</h6>
						{occupied ? `(res_id #$(occupied))` : null}
						<ErrorAlert error={clearTableError} />
					</div>
				</li>
				<li className='list-group-item'>
					<h6 className='text-center'>{finish}</h6>
				</li>
			</ul>
		</div>
	)
}

export default Table
