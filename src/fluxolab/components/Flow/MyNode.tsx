import _ from 'lodash'

import React, { useEffect, useRef, useState } from 'react'

import { Node, HandleType, Position, useReactFlow } from 'react-flow-renderer'

import { getDropShadow } from 'utils/colors'

import SymbolBox from 'components/SymbolBox'
import ModalSymbolData from 'components/Modals/SymbolData'
import { Box, LabelProps } from 'components/Symbols'

import MyHandle from './MyHandle'

import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

interface Props {
  nodeId: string
  box: Box
  editable: boolean
  Label: (props: LabelProps) => JSX.Element
  handles: Array<{id: string, type: HandleType, position: Position}>
}

export default function ({ nodeId, box, editable, Label, handles }: Props): JSX.Element {
  const [margin, setMargin] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [mouseHover, setMouseHover] = useState<boolean>(false)
  const [boxFilter, setBoxFilter] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  const { nodes } = useStoreFlow()
  const { compileError } = useStoreMachine()
  const { state } = useStoreMachineState()
  const { getZoom } = useReactFlow()

  const node: Node | undefined = _.find(nodes, { id: nodeId })

  const labelRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (labelRef.current !== null) {
      const zoom = getZoom()
      const labelWidth = labelRef.current.getBoundingClientRect().width / zoom
      const divWidth = 40 + 40 * Math.ceil(labelWidth / 40)
      const marginWidth = (divWidth - labelWidth) / 2
      setWidth(divWidth)
      setMargin(marginWidth)
    }
  }, [nodes])

  useEffect(() => {
    setBoxFilter(
      () => {
        if (compileError !== null) {
          if (_.includes(compileError?.nodeIds, nodeId)) {
            return getDropShadow('#dc3545')
          }
        } else if (nodeId === state.curSymbolId) {
          if (state.status === 'error') {
            return getDropShadow('#dc3545')
          } else {
            return getDropShadow('#adb5bd')
          }
        }
        return ''
      }
    )
  }, [state, compileError])

  return (
    <div style={{ position: 'relative', left: -width / 2 }}>
      <ModalSymbolData nodeId={nodeId} value={node?.data.value} showModal={showModal} setShowModal={setShowModal} />
      <SymbolBox box={box} boxFilter={boxFilter} isSelected={node?.selected}>
        <span
          ref={labelRef}
          onClick={() => setShowModal(editable)}
          onMouseEnter={() => setMouseHover(editable)}
          onMouseLeave={() => setMouseHover(false)}
          style={{
            marginLeft: margin,
            marginRight: margin,
            whiteSpace: 'nowrap',
            color: box.textColor,
            textDecoration: mouseHover ? 'underline' : 'none',
            cursor: editable ? 'pointer' : 'grab'
          }}
        >
          <Label value={node?.data.value} />
        </span>
      </SymbolBox>
      {_.map(handles, (props, index) => (
        <MyHandle key={index} box={box} {...props} />
      ))}
    </div>
  )
}
