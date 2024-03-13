import React, { useEffect } from 'react'

import { deserialize } from 'stores/serialize'
import useStoreFlow from 'stores/useStoreFlow'
import useStoreMachine from 'stores/useStoreMachine'
import useStoreEphemeral from 'stores/useStoreEphemeral'

export default function UrlImporter (): JSX.Element {
  const { setNodes, makeConnections } = useStoreFlow()
  const { setTitle, setVariables } = useStoreMachine()
  const { setToastContent } = useStoreEphemeral()

  useEffect(() => {
    const url = new URL(window.location.href)
    const lzs = url.searchParams.get('lzs')
    if (lzs !== null) {
      try {
        const { nodes, edges, variables, title } = deserialize(lzs)
        setNodes(nodes)
        makeConnections(edges)
        setVariables(variables)
        setTitle(title)
        url.searchParams.delete('lzs')
        window.history.replaceState({}, '', url.toString())
        setToastContent({
          message: 'Fluxograma carregado com sucesso.',
          icon: 'bi-check-circle',
          background: 'success'
        })
      } catch {
        setToastContent({
          message: 'Erro ao carregar o fluxograma.',
          icon: 'bi-exclamation-triangle',
          background: 'danger'
        })
      }
    }
  }, [])

  return <></>
}
