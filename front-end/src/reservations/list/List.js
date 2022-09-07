import React from 'react'
import Reservation from '../reservation/Reservation'

function List({ reservations }) {
	let list = null

	if (reservations.length) {
		list = reservations.map((reservation, index) => (
			<li key={index}>
				<Reservation
					reservation_id={reservation.id}
					reservation_date={reservation.date}
					reservation_time={reservation.reservation_time}
					first_name={reservation.first_name}
					last_name={reservation.last_name}
					mobile_number={reservation.mobile_number}
					people={reservation.people}
				/>
			</li>
		))
	}

	return <ul>{list ?? <li>No reservations on this date.</li>}</ul>
}

export default List
