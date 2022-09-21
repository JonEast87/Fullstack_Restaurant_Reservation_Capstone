import React from 'react'
import Reservation from '../reservation/Reservation'

function ReservationsList({ reservations }) {
	const currentReservation = []
	const finishedReservation = []

	reservations.forEach((reservation) => {
		if (reservation.status === 'finished') {
			finishedReservation.push(reservation)
		} else {
			currentReservation.push(reservation)
		}
	})

	const reservationsList = currentReservation.map((reservation, index) => (
		<div className='col mb-4' key={index}>
			<div
				className={`card h-100 text-center border-${
					reservation.status === 'booked' ? 'primary' : 'dark'
				}`}
				key={index}>
				<Reservation reservation={reservation} />
			</div>
		</div>
	))

	return (
		<div className='row row-cols-1 row-cols-md-3'>
			{reservationsList ?? '(... reservations on this data)'}
		</div>
	)
}

export default ReservationsList
