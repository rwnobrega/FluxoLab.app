import React from 'react'

import { HandleType, Position } from 'react-flow-renderer'

export interface Box {
  backgroundColor?: string
  textColor?: string
  borderRadius?: string
  clipPath?: string
  clipPathBorder?: string
}

export interface LabelProps {
  value: string
}

interface Symbol {
  type: string
  title: string
  box: Box
  editable: boolean
  Label: (props: LabelProps) => JSX.Element
  handles: Array<{ id: string, label?: string, type: HandleType, position: Position }>
}

const symbols: Symbol[] = [
  {
    type: 'start',
    title: 'Início',
    box: {
      backgroundColor: '#6f42c1',
      textColor: 'white',
      borderRadius: '15px'
    },
    editable: false,
    Label: () => <span><i>Início</i></span>,
    handles: [
      { id: 'out', type: 'source', position: Position.Bottom }
    ]
  },
  {
    type: 'input_',
    title: 'Entrada',
    box: {
      backgroundColor: '#0d6efd',
      textColor: 'white',
      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)'
    },
    editable: true,
    Label: ({ value }) => <span><i>Ler</i>{'\u00A0\u00A0'}<span className='font-monospace'>{value}</span></span>,
    handles: [
      { id: 'in', type: 'target', position: Position.Top },
      { id: 'out', type: 'source', position: Position.Bottom }
    ]
  },
  {
    type: 'output_',
    title: 'Saída',
    box: {
      backgroundColor: '#198754',
      textColor: 'white',
      clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
      clipPathBorder: 'polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))'
    },
    editable: true,
    Label: ({ value }) => <span><i>Escrever</i>{'\u00A0\u00A0'}"<span className='font-monospace'>{value}</span>"</span>,
    handles: [
      { id: 'in', type: 'target', position: Position.Top },
      { id: 'out', type: 'source', position: Position.Bottom }
    ]
  },
  {
    type: 'assignment',
    title: 'Atribuição',
    box: {
      backgroundColor: '#fd7e14',
      textColor: 'white'
    },
    editable: true,
    Label: ({ value }) => <span className='font-monospace'>{value === '' ? <i>(vazio)</i> : value}</span>,
    handles: [
      { id: 'in', type: 'target', position: Position.Top },
      { id: 'out', type: 'source', position: Position.Bottom }
    ]
  },
  {
    type: 'conditional',
    title: 'Condicional',
    box: {
      backgroundColor: '#F93154',
      textColor: 'white',
      clipPath: 'polygon(20px 0, 0 50%, 20px 100%, calc(100% - 20px) 100%, 100% 50%, calc(100% - 20px) 0)'
    },
    editable: true,
    Label: ({ value }) => <span className='font-monospace'>{value === '' ? <i>(vazio)</i> : value}</span>,
    handles: [
      { id: 'in', type: 'target', position: Position.Top },
      { id: 'true', type: 'source', position: Position.Left, label: 'V' },
      { id: 'false', type: 'source', position: Position.Right, label: 'F' }
    ]
  },
  {
    type: 'end',
    title: 'Fim',
    box: {
      backgroundColor: '#6f42c1',
      textColor: 'white',
      borderRadius: '15px'
    },
    editable: false,
    Label: () => <span><i>Fim</i></span>,
    handles: [
      { id: 'in', type: 'target', position: Position.Top }
    ]
  }
]

export default symbols
