import React from 'react'

function Reservation({
	reservation_id,
	first_name,
	last_name,
	mobile_number,
	reservation_time,
	people,
	status = null,
}) {
	let displayStatus = status || 'booked'

	const statusIndicators = {
		booked: 'danger',
		seated: 'success',
		finished: 'muted',
	}

	const statusIndicator = statusIndicators[displayStatus]

	return (
		<div>
			<div className='card-header'>{reservation_time}</div>
			<div className='card-body'>
				<h5 className='card-title'>
					"{last_name}, party of {people}!"
				</h5>
				<p className='card-text'>
					"Contact: {first_name} {last_name}, {mobile_number}"
				</p>
				<a href={`/reservations/${reservation_id}/seat`}>Seat</a>
			</div>
			<div className={`card-footer text-${statusIndicator}`}>
				Status: {displayStatus}
			</div>
		</div>
	)
}

export default Reservation
