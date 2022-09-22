import React, { useState } from 'react'
import { listReservationsMobile } from '../utils/api'
import ErrorAlert from '../layout/ErrorAlert'
import ReservationsList from '../reservations/list/ReservationsList'

/**
 * Defines the search page
 */

function Search() {
	const [mobileNumber, setMobileNumber] = useState([''])

	const [reservations, setReservations] = useState([])
	const [reservationsError, setReservationsError] = useState(null)

	const initialMessage = 'Awaiting orders...'
	const [resultsMessage, setResultsMessage] = useState(initialMessage)

	const handleChange = ({ target }) => {
		setMobileNumber(target.value)
	}

	function loadReservations() {
		const abortController = new AbortController()
		setReservationsError(null)
		setResultsMessage('...Searching')
		listReservationsMobile(mobileNumber, abortController.signal)
			.then(setReservations)
			.then(setResultsMessage('No reservations found.'))
			.catch(setReservationsError)

		return () => abortController.abort()
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		loadReservations()
	}

	const searchResults = (
		<h6 className='mt-5'>
			{reservations.length ? 'Search Results: ' : resultsMessage}
		</h6>
	)

	return (
		<main>
			<div className='d-md-flex mb-3 text-center'>
				<h1 className='mb-0'>Search</h1>
			</div>
			<form className='form-inline' onSubmit={handleSubmit}>
				<div className='form-group mb-2'>
					<label className='sr-only'>Mobile Number</label>
					<input
						id='mobile_number'
						name='mobile_number'
						type='phone'
						className='form-control'
						placeholder="Enter a customer's phone number."
						onChange={handleChange}
						value={mobileNumber}
						required={true}
					/>
				</div>
				<button type='submit' className='btn btn-primary ml-2 mb-2'>
					<span className='oi oi-magnifying-glass mr-2'>Find</span>
				</button>
			</form>
			{searchResults}
			<ReservationsList reservations={reservations} />
			<ErrorAlert error={reservationsError} />
		</main>
	)
}

export default Search
