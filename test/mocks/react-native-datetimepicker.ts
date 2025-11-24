import React from 'react'

type Props = {
	value: Date
	onChange: (event: unknown, date?: Date) => void
	mode: 'date' | 'time' | 'datetime'
}

const DateTimePicker = ({ value, onChange }: Props) =>
	React.createElement('input', {
		type: 'datetime-local',
		value: value.toISOString(),
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const next = new Date(event.target.value)
			onChange({}, next)
		}
	})

export default DateTimePicker
