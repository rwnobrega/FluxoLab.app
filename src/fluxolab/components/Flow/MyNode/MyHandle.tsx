import React from 'react'

import { Handle, HandleProps } from 'reactflow'

import { BoxStyle } from 'components/Symbols'

import { getDarkerColor } from 'utils/colors'

type Props = HandleProps & {
  boxStyle: BoxStyle
  label?: string
}

export default function ({ id, type, position, label, boxStyle }: Props): JSX.Element {
  const [mouseHover, setMouseHover] = React.useState<boolean>(false)

  const handleStyle = {
    all: {
      width: '15px',
      height: '15px',
      lineHeight: '15px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center' as 'center',
      color: boxStyle.textColor,
      borderColor: getDarkerColor(boxStyle.backgroundColor as string)
    },
    'hover-false': {
      backgroundColor: boxStyle.backgroundColor
    },
    'hover-true': {
      backgroundColor: getDarkerColor(boxStyle.backgroundColor as string)
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
