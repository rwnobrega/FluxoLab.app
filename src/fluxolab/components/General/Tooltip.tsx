import React, { useEffect, useRef } from 'react'

import { Tooltip as BsTooltip } from 'bootstrap'

interface Props {
  children: JSX.Element
  text: string
}

export default function ({ children, text }: Props): JSX.Element {
  const childRef = useRef(undefined as unknown as Element)

  useEffect(() => {
    const t = new BsTooltip(childRef?.current, {
      title: text,
      placement: 'bottom',
      trigger: 'hover'
    })
    return () => t.dispose()
  }, [text])

  return React.cloneElement(children, { ref: childRef })
}
