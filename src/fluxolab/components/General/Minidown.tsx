import React from 'react'

interface Props {
  source: string
}

const preStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.20)',
  paddingLeft: '4px',
  paddingRight: '4px',
  paddingTop: '2px',
  paddingBottom: '2px',
  marginLeft: '2px',
  marginRight: '2px',
  borderRadius: '2px'
}

const parseText = (text: string): JSX.Element[] => {
  const parts: JSX.Element[] = []
  let buffer = ''
  let isBold = false
  let isItalic = false
  let isPre = false

  const flush = (): void => {
    if (buffer === '') return

    const className = `${isBold ? 'fw-bold ' : ''}${isItalic ? 'fst-italic ' : ''}${isPre ? 'font-monospace' : ''}`.trim()
    const style = isPre ? preStyle : undefined
    parts.push(<span className={className} style={style}>{buffer}</span>)

    buffer = ''
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (char === '*' && !isPre) {
      flush()
      isBold = !isBold
    } else if (char === '_' && !isPre) {
      flush()
      isItalic = !isItalic
    } else if (char === '`') {
      flush()
      isPre = !isPre
    } else {
      buffer += char
    }
  }

  flush()
  return parts
}

export default function ({ source }: Props): JSX.Element {
  return <div>{parseText(source)}</div>
}
