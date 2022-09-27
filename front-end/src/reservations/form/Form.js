import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { formatAsTime } from '../../utils/date-time'
import {
	createReservation,
	updateReservation,
	readReservation,
} from '../../utils/api'
import ErrorAlert from '../../layout/ErrorAlert'

/**
 * Defines the reservation form
 * @param method
 * method will contain the http-methods passed into form
 */

function Form({ method }) {
	const { reservation_id } = useParams()
	const [reservationsError, setReservationsError] = useState(null)
	const history = useHistory()

	const initialState = {
		first_name: '',
		last_name: '',
		mobile_number: '',
		reservation_date: '',
		reservation_time: formatAsTime(new Date().toTimeString()),
		people: '',
	}

	const [reservation, setReservation] = useState({ ...initialState })

	useEffect(() => {
		if (method === 'POST') return

		const abortController = new AbortController()
		setReservationsError(null)

		readReservation(reservation_id, abortController.signal)
			.then(setReservation)
			.catch(setReservationsError)

		return () => abortController.abort()
	}, [reservation_id, method])

	const handleChange = ({ target }) => {
		let value = target.value

		if (target.name === 'people' && typeof value === 'string') {
			value = +value
		}

		setReservation({
			...reservation,
			[target.name]: value,
		})
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		method === 'POST' ? submitNew() : submitEdit()
	}

	const submitNew = () => {
		const abortController = new AbortController()
		setReservationsError(null)

		createReservation(reservation, abortController.signal)
			.then(() =>
				history.push(`/dashboard?date=${reservation.reservation_date}`)
			)
			.catch(setReservationsError)
	}

	const submitEdit = () => {
		const abortController = new AbortController()
		setReservationsError(null)

		const reservationData = {
			first_name: reservation.first_name,
			last_name: reservation.last_name,
			people: reservation.people,
			mobile_number: reservation.mobile_number,
			reservation_date: reservation.reservation_date,
			reservation_time: reservation.reservation_time,
		}

		updateReservation(reservation_id, reservationData, abortController.signal)
			.then(() =>
				history.push(`/dashboard?date=${reservation.reservation_date}`)
			)
			.catch(setReservationsError)

		return () => abortController.abort()
	}

	const handleCancel = (event) => {
		event.preventDefault()
		history.goBack()
	}

	return (
		<form onSubmit={handleSubmit}>
			<fieldset>
				<div className='form-group'>
					<label htmlFor='first_name'>First Name</label>
					<input
						id='first_name'
						type='text'
						name='first_name'
						className='form-control'
						onChange={handleChange}
						value={reservation.first_name}
						required={true}
					/>
					<label htmlFor='last_name'>Last Name</label>
					<input
						id='last_name'
						type='text'
						name='last_name'
						className='form-control'
						onChange={handleChange}
						value={reservation.last_name}
						required={true}
					/>
					<label htmlFor='mobile_number'>Mobile Number</label>
					<input
						id='mobile_number'
						type='text'
						name='mobile_number'
						className='form-control'
						onChange={handleChange}
						value={reservation.mobile_number}
						required={true}
					/>
					<label htmlFor='reservation_date'>Reservation Date</label>
					<input
						id='reservation_time'
						type='date'
						name='reservation_date'
						className='form-control'
						onChange={handleChange}
						value={reservation.reservation_date}
						required={true}
					/>
					<label htmlFor='reservation_time'>Reservation Time</label>
					<input
						id='reservation_time'
						type='time'
						name='reservation_time'
						className='form-control'
						onChange={handleChange}
						value={reservation.reservation_time}
						required={true}
					/>
					<label htmlFor='People'>People</label>
					<input
						id='people'
						type='number'
						name='people'
						className='form-control'
						onChange={handleChange}
						value={reservation.people}
						required={true}
					/>

					<button
						type='button'
						className='btn btn-secondary mr-2'
						onClick={handleCancel}>
						<span className='oi oi-x'>Cancel</span>
					</button>

					<button type='submit' className='btn btn-primary'>
						<span className='oi oi-check'>Submit</span>
					</button>
				</div>
				<ErrorAlert error={reservationsError} />
			</fieldset>
		</form>
	)
}

export default Form
