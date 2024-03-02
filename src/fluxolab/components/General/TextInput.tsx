import React from 'react'
import Form from 'react-bootstrap/Form'

interface Props {
  placeholder: string
  valid?: boolean
  value: string
  setValue: (value: string) => void
}

export default function ({ placeholder, valid, value, setValue }: Props): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value)
  }

  return (
    <Form.Control
      type='text'
      className={`font-monospace ${(valid === undefined || valid) ? '' : 'is-invalid'}`}
      autoFocus
      autoComplete='off'
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onFocus={event => event.target.select()}
    />
  )
}
