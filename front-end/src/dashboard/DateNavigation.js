import React from 'react'
import { Link } from 'react-router-dom'
import { today, previous, next } from '../utils/date-time'

/**
 * Defines the date navigaot for the Dashboard view
 *
 */

function DateNavigation({ date }) {
	return (
		<div>
			<Link to={`/dashboard?date=${previous(date)}`}>
				<button type='button'>Prev Day</button>
			</Link>
			<Link to={`/dashboard?date=${today()}`}>
				<button type='button'>Today</button>
			</Link>
			<Link to={`/dashboard?date=${next(date)}`}>
				<button type='button'>Next Day</button>
			</Link>
		</div>
	)
}

export default DateNavigation
