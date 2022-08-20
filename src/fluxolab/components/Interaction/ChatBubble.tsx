import React from 'react'

import { palette } from 'utils/colors'

interface BubbleProps {
  direction: 'in' | 'out'
  text: string
}

const spanClasses = {
  common: 'badge font-monospace fw-normal p-2',
  in: 'text-bg-primary align-self-center',
  out: 'text-bg-success'
}

const divClasses = {
  common: 'd-flex',
  in: 'align-self-end',
  out: 'align-self-start'
}

const arrowStyle = {
  common: {
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent'
  },
  in: {
    borderTop: `8px solid ${palette.blue}`,
    transform: 'translateY(16px) translateX(-8px) rotate(45deg)'
  },
  out: {
    borderTop: `8px solid ${palette.green}`,
    transform: 'translateY(16px) translateX(8px) rotate(-45deg)'
  }
}

export default function ({ direction, text }: BubbleProps): JSX.Element {
  return (
    <div className={`${divClasses.common} ${divClasses[direction]}`}>
      {direction === 'out' && <div style={{ ...arrowStyle.common, ...arrowStyle.out }} />}
      <span className={`${spanClasses.common} ${spanClasses[direction]}`}>{text}</span>
      {direction === 'in' && <div style={{ ...arrowStyle.common, ...arrowStyle.in }} />}
    </div>
  )
}
