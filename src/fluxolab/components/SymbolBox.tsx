import React, { useState } from 'react'

import { getDarkerColor, getStripedBackground } from 'utils/colors'

import { Box } from 'components/Symbols'

interface Props {
  width?: number
  box: Box
  boxFilter?: string
  isSelected?: boolean
  children: JSX.Element
}

export default function ({ width, box, boxFilter, isSelected = false, children }: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false)

  function getBackground (): string {
    if (isSelected) {
      return getStripedBackground(box.backgroundColor as string)
    } else if (mouseHover) {
      return getDarkerColor(box.backgroundColor as string)
    } else {
      return box.backgroundColor as string
    }
  }

  return (
    <div
      className='text-center small'
      style={{ filter: boxFilter }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      <div
        style={{
          width: width,
          lineHeight: '40px',
          fontWeight: 'bold',
          color: box.textColor,
          background: getBackground(),
          borderRadius: box.borderRadius,
          clipPath: box.clipPath
        }}
      >
        {children}
      </div>
    </div>
  )
}
