import React, { useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import Tooltip from 'components/General/Tooltip'

import Help from './Help'
import About from './About'

import useStoreStrings from 'stores/useStoreStrings'

export default function (): JSX.Element {
  const { getString } = useStoreStrings()

  const [showHelp, setShowHelp] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <Dropdown align='end'>
        <Tooltip text={getString('MenuHelp_Tooltip')}>
          <Dropdown.Toggle>
            <i className='bi bi-question-circle' />
          </Dropdown.Toggle>
        </Tooltip>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowHelp(true)}>{getString('MenuHelp_Help')}</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowAbout(true)}>{getString('MenuHelp_About')}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Help showModal={showHelp} setShowModal={setShowHelp} />
      <About showModal={showAbout} setShowModal={setShowAbout} />
    </>
  )
}
