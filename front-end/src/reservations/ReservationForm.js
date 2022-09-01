import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { today, formatAsTime } from '../utils/date-time'
import { createReservation } from '../utils/api'

function ReservationForm({ method }) {
	const initialState = {
		first_name: '',
		last_name: '',
		mobile_number: '',
		reservation_date: today(),
		reservation_time: formatAsTime(new Date().toTimeString()),
		people: 1,
	}

	const [reservation, setReservation] = useState(initialState)
	const history = useHistory()

	useEffect(() => {
		if (method === 'POST') return

		const abortController = new AbortController()

		// getReservation(reservation_id, abortController.id)
		//   .then(setFormData)
		//   .catch(setReservationError)

		return () => abortController.abort()
	}, [, /* reservation_id */ method])

	const submitEdit = () => {
		const abortController = new AbortController()

		const trimmedFormData = {
			first_name: reservation.first_name,
			last_name: reservation.last_name,
			people: reservation.people,
			mobile_number: reservation.mobile_number,
			reservation_date: reservation.reservation_date,
			reservation_time: reservation.reservation_time,
		}

		// updateReservation(reservation_id, trimmedFormData, abortController.signal)
		// .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
		// .catch(setReservationError)

		return () => abortController.abort()
	}

	const submitNew = () => {
		const abortController = new AbortController()

		createReservation(reservation, abortController.signal)
			.then(() =>
				history.push(`/dashboard?date=${reservation.reservation_date}`)
			)
			.catch(console.log('There was an error.'))

		return () => abortController.abort()
	}

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

	const handleCancel = (event) => {
		event.preventDefault()
		history.goBack()
	}

	return (
		<form onSubmit={handleSubmit} name='create'>
			<fieldset>
				<div className='form-group'>
					<label htmlFor='first_name'>First Name</label>
					<input
						name='first_name'
						id='first_name'
						className='form-control'
						placeholder='First Name'
						type='text'
						onChange={handleChange}
						value={reservation.first_name}
						required={true}
					/>
					<label htmlFor='last_name'>Last Name</label>
					<input
						name='last_name'
						id='last_name'
						className='form-control'
						placeholder='Last Name'
						type='text'
						onChange={handleChange}
						value={reservation.last_name}
						required={true}
					/>
					<label htmlFor='mobile_number'>Mobile Number</label>
					<input
						name='mobile_number'
						id='mobile_number'
						className='form-control'
						placeholder='Mobile Number'
						type='text'
						onChange={handleChange}
						value={reservation.mobile_number}
						required={true}
					/>
					<label htmlFor='reservation_date'>Reservation Date</label>
					<input
						name='reservation_date'
						id='reservation_time'
						className='form-control'
						placeholder='Reservation Date'
						type='text'
						onChange={handleChange}
						value={reservation.reservation_date}
						required={true}
					/>
					<label htmlFor='reservation_time'>Reservation Time</label>
					<input
						name='reservation_time'
						id='reservation_time'
						className='form-control'
						placeholder='Reservation Time'
						type='text'
						onChange={handleChange}
						value={reservation.reservation_time}
						required={true}
					/>
					<label htmlFor='People'>People</label>
					<input
						name='people'
						id='people'
						className='form-control'
						placeholder='People'
						type='number'
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
						<span className='oi oi-check'>Create</span>
					</button>
				</div>
			</fieldset>
		</form>
	)
}

export default ReservationForm
