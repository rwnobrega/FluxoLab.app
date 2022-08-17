import React, { useCallback } from 'react'

export default function (): JSX.Element {
  const [editMode, setEditMode] = React.useState(false)
  const [flowchartTitle, setFlowchartTitle] = React.useState('Fluxograma sem título')

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

  const onClickDuplicate = (): void => {
  }

  return (
    <div className='input-group'>
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
      <button type='button' className='btn btn-dark' data-bs-toggle='dropdown'>
        <i className='bi bi-three-dots-vertical' />
      </button>
      <ul className='dropdown-menu dropdown-menu-end'>
        <li>
          <a
            className='dropdown-item'
            href='#'
            onClick={onClickDuplicate}
          >
            Duplicar
          </a>
        </li>
        <li><a className='dropdown-item' href='#'>Deletar</a></li>
      </ul>
    </div>
  )
}
