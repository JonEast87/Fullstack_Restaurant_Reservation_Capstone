import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { updateReservationStatus } from '../../utils/api'
import ReservationButton from '../button/ReservationButton'
import ErrorAlert from '../../layout/ErrorAlert'

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

	let displayStatus = status || 'booked'
	const statusIndicator = statusIndicators[displayStatus]

	const history = useHistory()
	const [cancelReservationError, setCancelReservationError] = useState(null)

	const confirmCancel = () => {
		if (
			window.confirm(
				'Do you want to cancel this reservation? This cannot be undone.'
			)
		) {
			const abortController = new AbortController()
			setCancelReservationError(null)

			updateReservationStatus(
				reservation_id,
				'cancelled',
				abortController.signal
			)
				.then(() => history.go(0))
				.catch(setCancelReservationError)
			return () => abortController.abort()
		}
	}

	let buttons = null
	if (status === 'booked') {
		buttons = (
			<div className={'bg-light'}>
				<ReservationButton confirmCancel={confirmCancel} id={reservation_id} />
			</div>
		)
	}

	return (
		<section
			className='card h-100 m-0 mx-2 mb-3 text-center'
			style={{ maxWidth: '100%' }}>
			<div className={`card-header p-0 py-2 text-${statusIndicator}`}>
				<span className='oi oi-clock mr-2'>{reservation_time}</span>
			</div>

			<div className='card-body p-0 py-2'>
				<h3 className='card-text font-weight-bold d-inline ml-2'>
					"{last_name}, party of {people}!"
				</h3>

				<p className='card-text mt-2 mb-1'>
					Contact: {first_name} {last_name}, {mobile_number}
				</p>
			</div>
			<div
				className={`card-footer text-${statusIndicator}`}
				data-reservation-id-status={reservation_id}>
				Status: {status}
				<ErrorAlert error={cancelReservationError} />
			</div>
			{buttons}
		</section>
	)
}

export default Reservation
