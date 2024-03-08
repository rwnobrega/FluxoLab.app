import React from 'react'
import Form from 'react-bootstrap/Form'

import Minidown from 'components/General/Minidown'

interface Props {
  placeholder: string
  value: string
  setValue: (value: string) => void
  problem?: string | null
}

export default function ({ placeholder, value, setValue, problem = null }: Props): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value)
  }

  return (
    <>
      <Form.Control
        type='text'
        className={`font-monospace ${problem === null ? '' : 'is-invalid'}`}
        autoFocus
        autoComplete='off'
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={event => event.target.select()}
      />
      <Minidown className='pt-2 small text-danger' source={problem === null ? '\u00A0' : problem} />
    </>
  )
}
