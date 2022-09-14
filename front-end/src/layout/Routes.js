import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Dashboard from '../dashboard/Dashboard'
import Tables from '../tables/Tables'
import { today } from '../utils/date-time'
import NotFound from './NotFound'
import New from '../reservations/new/New'
import Seat from '../reservations/seat/Seat'
import NewTable from '../tables/new/NewTable'

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
	return (
		<Switch>
			<Route exact={true} path='/'>
				<Redirect to={'/dashboard'} />
			</Route>
			<Route exact={true} path='/reservations'>
				<Redirect to={'/dashboard'} />
			</Route>
			<Route path='/reservations/new'>
				<New />
			</Route>
			<Route path='/reservations/:reservation_id/seat'>
				<Seat />
			</Route>
			<Route path='/tables'>
				<Tables />
			</Route>
			<Route path={'/tables/new'}>
				<NewTable />
			</Route>
			<Route path='/dashboard'>
				<Dashboard date={today()} />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	)
}

export default Routes
