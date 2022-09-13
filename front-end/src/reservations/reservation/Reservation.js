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

	const statusIndicators = {
		booked: 'danger',
		seated: 'success',
		finished: 'muted',
	}

	const statusIndicator = statusIndicators[status]

	const seatButton =
		status !== 'booked' ? null : (
			<a
				href={`/reservations/${reservation_id}/seat`}
				className='btn btn-primary'>
				Seat
			</a>
		)

	return (
		<div>
			<div className='card-header'>{reservation_time}</div>
			<div className='card-body'>
				<h5 className='card-title'>
					"{last_name}, party of {people}!"
				</h5>
				<p className='card-text'>
					Contact: {first_name} {last_name}, {mobile_number}
				</p>
				{seatButton}
			</div>
			<div className={'card-footer'}>
				{`Status: `}
				<span
					className={`text-${statusIndicator}`}
					data-reservation-id-status={reservation_id}>
					{status}
				</span>
				<p>(Reservation ID:#{reservation_id})</p>
			</div>
		</div>
	)
}

export default Reservation
