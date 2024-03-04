import React, { useCallback } from 'react'
import useStoreMachine from 'stores/storeMachine'

export default function (): JSX.Element {
  const [editMode, setEditMode] = React.useState(false)
  const { flowchartTitle, setFlowchartTitle } = useStoreMachine()

  const onFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
    setEditMode(true)
  }, [])

  const onBlur = useCallback(() => {
    setEditMode(false)
  }, [])

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFlowchartTitle(event.target.value)
  }, [])

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      setEditMode(false)
      event.currentTarget.blur()
    }
  }, [])

  return (
    <input
      type='text'
      className='form-control bg-dark text-white fs-4'
      value={flowchartTitle}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{ borderColor: editMode ? 'white' : 'black' }}
    />
  )
}