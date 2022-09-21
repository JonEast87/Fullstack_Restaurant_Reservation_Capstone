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
			<DateNavigation date={date} />
			<h2 className='mb-0'>Reservations:</h2>
			<ReservationsList reservations={reservations} />
			<ErrorAlert error={reservationsError} />
			<hr className='py-2 bg-dark' />
			<h2 className='mb-0'>Tables:</h2>
			<TablesList tables={tables} />
			<ErrorAlert error={tablesError} />
		</main>
	)
}

export default Dashboard
