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
			<div className='d-md-flex mb-3'>
				<h1 className='mb-0'>Add a New Table</h1>
			</div>
			<form onSubmit={handleSubmit}>
				<label htmlFor='table_name'>
					Table Name:
					<input
						id='table_name'
						type='text'
						name='table_name'
						onChange={handleChange}
						value={formData.table_name}
						required={true}
					/>
				</label>
				<label htmlFor='capacity'>
					Capacity:
					<input
						id='capacity'
						type='number'
						name='capacity'
						onChange={handleChange}
						required={true}
						min='1'
						value={formData.capacity}
					/>
				</label>
				<button type='submit'>Submit</button>
				<button type='button' value='Cancel' onClick={handleCancel}>
					Cancel
				</button>
			</form>
			<ErrorAlert error={tablesError} />
		</section>
	)
}

export default NewTable
