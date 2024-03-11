import _ from 'lodash'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Node, HandleType, Position, useReactFlow } from 'reactflow'

import { palette, getDropShadow } from 'utils/colors'

import { BoxStyle, LabelProps, ModalProps } from 'components/Symbols'

import SymbolBox from 'components/Symbols/SymbolBox'

import MyHandle from './MyHandle'
import ButtonDelete from './ButtonDelete'
import ButtonEdit from './ButtonEdit'

import useStoreEphemeral from 'stores/storeEphemeral'
import useStoreFlow from 'stores/storeFlow'
import useStoreMachine from 'stores/storeMachine'
import useStoreMachineState from 'stores/storeMachineState'

interface Props {
  nodeId: string
  boxStyle: BoxStyle
  Modal?: (props: ModalProps) => JSX.Element
  Label: (props: LabelProps) => JSX.Element
  handles: Array<{ id: string, type: HandleType, position: Position }>
}

export default function ({ nodeId, boxStyle, Modal, Label, handles }: Props): JSX.Element {
  const [margin, setMargin] = useState<number>(0)
  const [boxFilter, setBoxFilter] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  const { nodes, deleteNode, updateNodeProp } = useStoreFlow()
  const { mouseOverNodeId, setMouseOverNodeId } = useStoreEphemeral()
  const { compileErrors } = useStoreMachine()
  const { getState } = useStoreMachineState()
  const { getZoom } = useReactFlow()

  const state = getState()

  const labelRef = useRef<HTMLInputElement>(null)

  const node: Node | undefined = _.find(nodes, { id: nodeId })

  useEffect(() => {
    const MIN_WIDTH = 120
    const MAX_WIDTH = 480
    if (labelRef.current !== null) {
      const zoom = getZoom()
      const labelWidth = labelRef.current.getBoundingClientRect().width / zoom
      const newNodeWidth = Math.min(Math.max(40 + 40 * Math.ceil(labelWidth / 40), MIN_WIDTH), MAX_WIDTH)
      const marginWidth = (newNodeWidth - labelWidth) / 2
      if (node?.width !== undefined && node.width !== null) {
        updateNodeProp(nodeId, 'position.x', node.position.x - (newNodeWidth - node.width) / 2)
      }
      setMargin(marginWidth)
    }
  }, [node?.data])

  useEffect(() => {
    setBoxFilter(
      () => {
        if (compileErrors.length > 0) {
          if (_.some(compileErrors, { nodeId })) {
            return getDropShadow(palette.red)
          }
        } else if (nodeId === state.curSymbolId) {
          if (state.status === 'error') {
            return getDropShadow(palette.red)
          } else {
            return getDropShadow(palette.gray800)
          }
        } else if (node?.type === 'start' && state.curSymbolId === null) {
          return getDropShadow(palette.gray800)
        }
        return ''
      }
    )
  }, [state, compileErrors])

  const handleDelete = useCallback(() => {
    deleteNode(nodeId)
    setMouseOverNodeId(null)
  }, [deleteNode, nodeId, setMouseOverNodeId])

  const handleEdit = useCallback(() => {
    setMouseOverNodeId(null)
    setShowModal(true)
  }, [setMouseOverNodeId, setShowModal])

  const handleMouseEnter = useCallback(() => {
    setMouseOverNodeId(nodeId)
  }, [setMouseOverNodeId, nodeId])

  const handleMouseLeave = useCallback(() => {
    setMouseOverNodeId(null)
  }, [setMouseOverNodeId])

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'grab' }}
    >
      {
        Modal !== undefined &&
          <Modal nodeId={nodeId} value={node?.data} showModal={showModal} setShowModal={setShowModal} />
      }
      <SymbolBox boxStyle={boxStyle} boxFilter={boxFilter} isSelected={node?.selected}>
        <span
          ref={labelRef}
          style={{
            maxWidth: '392px',
            minWidth: '80px',
            marginLeft: `${margin}px`,
            marginRight: `${margin}px`,
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            verticalAlign: 'middle',
            textOverflow: 'ellipsis',
            color: boxStyle.textColor,
            cursor: 'grab'
          }}
        >
          <Label value={node?.data} />
        </span>
      </SymbolBox>
      <ButtonDelete onClick={handleDelete} visible={mouseOverNodeId === nodeId} />
      <ButtonEdit onClick={handleEdit} visible={mouseOverNodeId === nodeId && Modal !== undefined} />
      {_.map(handles, (props, index) => (
        <MyHandle key={index} boxStyle={boxStyle} {...props} />
      ))}
    </div>
  )
}
