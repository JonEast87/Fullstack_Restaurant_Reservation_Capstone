import React from 'react'

function ReservationCard({ reservation, children }) {
	return (
		<div className='col-sm-12 col-md-6 col-lg-3 my-2'>
			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title text-truncate'>
						{reservation.first_name + ' ' + reservation.last_name}
					</h5>
					<p className='card-text'>{reservation.mobile_number}</p>
					<p className='card-text'>{reservation.reservation_date}</p>
					<p className='card-text'>{reservation.reservation_time}</p>
					<p className='card-text'>{reservation.people}</p>
					<div className='card-footer'>{children}</div>
				</div>
			</div>
		</div>
	)
}

export default ReservationCard
