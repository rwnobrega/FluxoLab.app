import React from 'react'

import { Handle, HandleProps } from 'reactflow'

import { Box } from 'components/Symbols'

import { getDarkerColor } from 'utils/colors'

type Props = HandleProps & {
  box: Box
  label?: string
}

export default function ({ id, type, position, label, box }: Props): JSX.Element {
  const [mouseHover, setMouseHover] = React.useState<boolean>(false)

  const handleStyle = {
    all: {
      width: '15px',
      height: '15px',
      lineHeight: '15px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center' as 'center',
      color: box.textColor,
      borderColor: getDarkerColor(box.backgroundColor as string)
    },
    'hover-false': {
      backgroundColor: box.backgroundColor
    },
    'hover-true': {
      backgroundColor: getDarkerColor(box.backgroundColor as string)
    }
  }

  return (
    <Handle
      id={id}
      type={type}
      position={position}
      style={{
        ...handleStyle.all,
        ...handleStyle[`hover-${mouseHover ? 'true' : 'false'}`]
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {label}
    </Handle>
  )
}
