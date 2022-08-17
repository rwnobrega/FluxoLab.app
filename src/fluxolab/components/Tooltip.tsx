import React, { useEffect, useRef } from 'react'

import { Tooltip as BsTooltip } from 'bootstrap'

export default function (props: {children: JSX.Element, text: string}): JSX.Element {
  const childRef = useRef(undefined as unknown as Element)

  useEffect(() => {
    const t = new BsTooltip(childRef.current, {
      title: props.text,
      placement: 'bottom',
      trigger: 'hover'
    })
    return () => t.dispose()
  }, [props.text])

  return React.cloneElement(props.children, { ref: childRef })
}
