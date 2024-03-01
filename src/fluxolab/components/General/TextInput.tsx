import React from 'react'
import Form from 'react-bootstrap/Form'

interface Props {
  placeholder: string
  value: string
  setValue: (value: string) => void
}

export default function ({ placeholder, value, setValue }: Props): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value)
  }

  return (
    <Form.Control
      type='text'
      className='font-monospace'
      autoFocus
      autoComplete='off'
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onFocus={event => event.target.select()}
    />
  )
}
