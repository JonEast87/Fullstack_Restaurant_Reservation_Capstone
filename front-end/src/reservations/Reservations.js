import React from 'react'
import { Route, Switch } from 'react-router-dom'
import New from './new/New'
import Seat from './seat/Seat'
import NotFound from '../layout/NotFound'

function Reservations() {
	return (
		<main>
			<Switch>
				<Route path='/reservations/new'>
					<New />
				</Route>
				<Route path='/reservations/:reservation_id/seat'>
					<Seat />
				</Route>
				<Route>
					<NotFound />
				</Route>
			</Switch>
		</main>
	)
}

export default Reservations
