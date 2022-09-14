import React from 'react'
import Reservation from '../reservation/Reservation'

function List({ reservations }) {
	const currentReservation = []
	const finishedReservation = []

	reservations.forEach((reservation) => {
		if (reservation.status === 'finished') {
			finishedReservation.push(reservation)
		} else {
			currentReservation.push(reservation)
		}
	})

	const list = reservations.map((reservation, index) => (
		<div className='col mb-4' key={index}>
			<div
				className={`card h-100 text-center border-${
					reservation.status === 'booked' ? 'primary' : 'dark'
				}`}
				key={index}>
				<Reservation
					reservation_id={reservation.reservation_id}
					reservation_date={reservation.date}
					first_name={reservation.first_name}
					last_name={reservation.last_name}
					mobile_number={reservation.mobile_number}
					reservation_time={reservation.reservation_time}
					people={reservation.people}
				/>
			</div>
		</div>
	))

	return (
		<div className='row row-cols-1 row-cols-md-3'>
			{list ?? '(... reservations on this data)'}
		</div>
	)
}

export default List
