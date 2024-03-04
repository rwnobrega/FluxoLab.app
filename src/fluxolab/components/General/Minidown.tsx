import React from 'react'

const preStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.20)',
  paddingLeft: '4px',
  paddingRight: '4px',
  paddingTop: '2px',
  paddingBottom: '2px',
  marginLeft: '2px',
  marginRight: '2px',
  borderRadius: '2px',
  whiteSpace: 'nowrap',
  overflow: 'auto'
}

const parseText = (text: string): JSX.Element[] => {
  const parts: JSX.Element[] = []
  let buffer = ''
  let isBold = false
  let isItalic = false
  let isPre = false
  let key = 0
  let isEscaped = false

  const flush = (): void => {
    if (buffer === '') return
    const className = `${isBold ? 'fw-bold ' : ''}${isItalic ? 'fst-italic ' : ''}${isPre ? 'font-monospace' : ''}`.trim()
    const style = isPre ? preStyle : undefined
    parts.push(<span key={key++} className={className} style={style}>{buffer}</span>)
    buffer = ''
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '\\' && !isEscaped) {
      isEscaped = true
      continue
    }
    if (isEscaped) {
      buffer += char
      isEscaped = false
      continue
    }
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

interface Props {
  source: string
  className?: string
}

export default function ({ source, className }: Props): JSX.Element {
  return <div className={className}>{parseText(source)}</div>
}
