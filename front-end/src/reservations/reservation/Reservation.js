import React from 'react'

function Reservation({ reservation }) {
	const {
		reservation_id,
		first_name,
		last_name,
		mobile_number,
		reservation_time,
		people,
		status,
	} = reservation

	let displayStatus = status || 'booked'

	const statusIndicators = {
		booked: 'danger',
		seated: 'success',
		finished: 'muted',
	}

	const statusIndicator = statusIndicators[displayStatus]

	const book =
		status !== 'booked' ? null : (
			<a
				href={`/reservations/${reservation_id}/seat`}
				className='btn btn-primary'>
				Seat
			</a>
		)

	return (
		<section>
			<div className='card-header'>{reservation_time}</div>
			<div className='card-body'>
				<h5 className='card-title'>
					"{last_name}, party of {people}!"
				</h5>
				<p className='card-text'>
					Contact: {first_name} {last_name}, {mobile_number}
				</p>
				{book}
			</div>
			<div
				className={`card-footer text-${statusIndicator}`}
				data-reservation-id-status={reservation_id}>
				Status: {status}
			</div>
		</section>
	)
}

export default Reservation
