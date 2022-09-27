import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createTable } from '../../utils/api'
import ErrorAlert from '../../layout/ErrorAlert'

function NewTable() {
	const [tablesError, setTablesError] = useState(null)
	const history = useHistory()

	const initialFormState = {
		table_name: '',
		capacity: '',
	}

	const [formData, setFormData] = useState({ ...initialFormState })

	const handleChange = ({ target }) => {
		let value = target.value

		if (target.name === 'capacity' && typeof value === 'string') {
			value = +value
		}

		setFormData({
			...formData,
			[target.name]: value,
		})
	}

	const handleSubmit = (event) => {
		event.preventDefault()

		const abortController = new AbortController()
		setTablesError(null)

		createTable(formData, abortController.signal)
			.then(() => {
				history.push('/dashboard')
			})
			.catch(setTablesError)
		return () => abortController.abort()
	}

	const handleCancel = (event) => {
		event.preventDefault()
		history.goBack()
	}

	return (
		<section>
			<div className='d-md-flex mb-3 text-center'>
				<h1 className='mb-0'>Add a New Table</h1>
			</div>
			<form onSubmit={handleSubmit}>
				<div className='row'>
					<div className='col-auto'>
						<div className='form-group form-now'>
							<label htmlFor='table_name'>
								Table Name:
								<div className='col-8 pt-2'>
									<input
										id='table_name'
										type='text'
										name='table_name'
										onChange={handleChange}
										value={formData.table_name}
										required={true}
									/>
								</div>
							</label>
						</div>
						<div className='row'>
							<div className='col-auto'>
								<div className='form-group form-now'>
									<label htmlFor='capacity'>
										Capacity:
										<div className='col-3 pt-2'>
											<input
												id='capacity'
												type='number'
												name='capacity'
												onChange={handleChange}
												required={true}
												min='1'
												value={formData.capacity}
											/>
										</div>
									</label>
								</div>
							</div>
						</div>
						<div
							className='btn-toolbar mb-5'
							role='toolbar'
							aria-label='Form action buttons'>
							<button type='submit' className='btn btn-primary'>
								Submit
								<span className='oi oi-check ml-2'></span>
							</button>
							<button
								type='button'
								value='Cancel'
								className='btn btn-secondary'
								onClick={handleCancel}>
								Cancel
								<span className='oi oi-action-undo mr-2'></span>
							</button>
						</div>
					</div>
				</div>
			</form>
			<ErrorAlert error={tablesError} />
		</section>
	)
}

export default NewTable
