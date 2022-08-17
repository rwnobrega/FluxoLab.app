import React from 'react'

import { Handle, HandleProps } from 'react-flow-renderer'

import { Box } from 'components/Symbols'

import { getDarkerColor } from 'utils/colors'

type Props = HandleProps & {
  box: Box
  label?: string
}

export default function ({ id, type, position, label, box }: Props): JSX.Element {
  const [mouseHover, setMouseHover] = React.useState<boolean>(false)

  return (
    <Handle
      id={id}
      type={type}
      position={position}
      style={{
        width: '15px',
        height: '15px',
        borderColor: getDarkerColor(box.backgroundColor as string),
        backgroundColor: !mouseHover ? box.backgroundColor : getDarkerColor(box.backgroundColor as string)
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      <span
        style={{
          fontSize: '10px',
          fontWeight: 'bold',
          color: box.textColor,
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {label}
      </span>
    </Handle>
  )
}
