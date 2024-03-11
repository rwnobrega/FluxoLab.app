import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Stack from 'react-bootstrap/Stack'

import Brand from './Brand'
import Title from './Title'
import CopyLink from './CopyLink'
import Menu from './Menu'

export default function (): JSX.Element {
  return (
    <Navbar variant='dark' bg='dark' expand='lg'>
      <Stack direction='horizontal' gap={3} className='flex-fill mx-3'>
        <Brand />
        <Title />
        <CopyLink />
        <Menu />
      </Stack>
    </Navbar>
  )
}
