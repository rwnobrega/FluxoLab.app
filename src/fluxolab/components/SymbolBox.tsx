import React, { useState } from 'react'

import { getDarkerColor, getStripedBackground } from 'utils/colors'

import { Box } from 'components/symbols'

interface Props {
  box: Box
  boxFilter?: string
  isSelected?: boolean
  children: JSX.Element
}

export default function ({ box, boxFilter, isSelected = false, children }: Props): JSX.Element {
  const [mouseHover, setMouseHover] = useState<boolean>(false)

  function getBackground (): string {
    const bgColor = box.backgroundColor as string
    const bgDarker = getDarkerColor(bgColor)
    if (isSelected && mouseHover) {
      return getStripedBackground(bgDarker)
    } else if (isSelected) {
      return getStripedBackground(bgColor)
    } else if (mouseHover) {
      return bgDarker
    } else {
      return bgColor
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
