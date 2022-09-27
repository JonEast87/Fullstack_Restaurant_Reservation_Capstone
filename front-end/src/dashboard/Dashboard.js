import React, { useEffect, useState } from 'react'
import useQuery from '../utils/useQuery'
import { listReservations, listTables } from '../utils/api'
import ErrorAlert from '../layout/ErrorAlert'
import DateNavigation from './DateNavigation'
import ReservationsList from '../reservations/list/ReservationsList'
import TablesList from '../tables/list/TablesList'

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
	const dateInUrl = useQuery().get('date')
	if (dateInUrl) {
		date = dateInUrl
	}

	const [reservations, setReservations] = useState([])
	const [reservationsError, setReservationsError] = useState(null)

	const [tables, setTables] = useState([])
	const [tablesError, setTablesError] = useState(null)

	function loadReservation() {
		const abortController = new AbortController()
		setReservationsError(null)

		listReservations({ date }, abortController.signal)
			.then(setReservations)
			.catch(setReservationsError)
		return () => abortController.abort()
	}

	function loadTables() {
		const abortController = new AbortController()
		setTablesError(null)

		listTables(abortController.signal).then(setTables).catch(setTablesError)

		return () => abortController.abort()
	}

	useEffect(loadReservation, [date])
	useEffect(loadTables, [])

	return (
		<main>
			<div className='row'>
				<div className='col-12 mx-auto my-3'>
					<DateNavigation date={date} />
				</div>
			</div>
			<div className='row'>
				<div className='col-md-12 mx-auto'>
					<fieldset className='border border-bottom-0 border-dark p-3 m-0'>
						<legend className='pl-2 text-white shadow bg-dark rounded sticky-top'>
							Reservations
						</legend>
						<ReservationsList reservations={reservations} />
						<ErrorAlert error={reservationsError} />
					</fieldset>
				</div>
			</div>
			<div className='row mt-3'>
				<div className='col-md-12 mx-auto'>
					<fieldset className='border border-bottom-0 border-dark p-3 m-0'>
						<legend className='pl-2 text-white shadow bg-dark rounded sticky-top'>
							Tables
						</legend>
						<TablesList tables={tables} />
						<ErrorAlert error={tablesError} />
					</fieldset>
				</div>
			</div>
		</main>
	)
}

export default Dashboard
