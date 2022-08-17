import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Stack from 'react-bootstrap/Stack'

import NavbarBrand from './Brand'
import NavbarSaved from './Saved'
import NavbarCurrent from './Current'

export default function (): JSX.Element {
  return (
    <Navbar variant='dark' bg='dark' expand='lg'>
      <Stack direction='horizontal' gap={3} className='flex-fill mx-3'>
        <NavbarBrand />
        <NavbarCurrent />
        <NavbarSaved />
      </Stack>
    </Navbar>
  )
}
