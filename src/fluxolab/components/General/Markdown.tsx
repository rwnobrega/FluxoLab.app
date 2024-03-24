import React, { CSSProperties } from 'react'

import Markdown from 'react-markdown'

const pStyle: CSSProperties = {
  lineHeight: '1.2'
}

const codeStyle: CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.10)',
  paddingLeft: '4px',
  paddingRight: '4px',
  paddingTop: '2px',
  paddingBottom: '2px',
  marginLeft: '2px',
  marginRight: '2px',
  borderRadius: '2px',
  whiteSpace: 'nowrap',
  overflow: 'auto',
  lineHeight: '1.2'
}

interface Props {
  className?: string
  source: string
}

export default function ({ className = '', source }: Props): JSX.Element {
  return (
    <Markdown
      className={className}
      components={{
        p: ({ children }) => <span style={pStyle}>{children}</span>,
        code: ({ children }) => <span style={codeStyle}>{children}</span>
      }}
    >
      {source}
    </Markdown>
  )
}
