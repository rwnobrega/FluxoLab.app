import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import Clear from './Clear'
import Help from './Help'
import About from './About'

export default function (): JSX.Element {
  const [showClear, setShowClear] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <Dropdown align='end'>
        <Dropdown.Toggle>
          Menu
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowClear(true)}>Limpar fluxograma...</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowHelp(true)}>Ajuda...</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowAbout(true)}>Sobre...</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Clear showModal={showClear} setShowModal={setShowClear} />
      <Help showModal={showHelp} setShowModal={setShowHelp} />
      <About showModal={showAbout} setShowModal={setShowAbout} />
    </>
  )
}
