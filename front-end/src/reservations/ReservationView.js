import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import ErrorAlert from '../layout/ErrorAlert'
import ReservationCard from '../home/ReservationCard'
import { readReservation } from '../utils/api'

function ReservationView() {
	const history = useHistory()
	const { reservationId } = useParams()

	const [reservation, setReservation] = useState({})
	const [error, setError] = useState(null)

	useEffect(loadOrder, [reservationId])

	function loadOrder() {
		const abortController = new AbortController()

		readReservation(
			reservationId,
			abortController.signal().then(setReservation).catch(setError)
		)

		return () => abortController.abort()
	}

	function deleteHandler() {
		const confirmed = window.confirm(
			'Delete this reservation?\n\nYou will not be able to recover it.'
		)
		if (confirmed) {
			// TODO: another backend call to make `deleteReservation(reservation.id).then(() => history.push('/reservations')).catch(setError)`
		}
	}

	return (
		<main>
			<h1>View Reservation</h1>
			<ErrorAlert error={error} />
			<ReservationCard reservation={reservation}>
				<Link
					to={`/reservations/${reservation.id}/edit`}
					className='btn btn-secondary'>
					<span className='oi oi-pencil' /> Edit
				</Link>
			</ReservationCard>
		</main>
	)
}

export default ReservationView
