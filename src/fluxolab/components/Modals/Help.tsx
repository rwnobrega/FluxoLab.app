import React from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

interface Props {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const classes = 'font-monospace w-25'
  return (
    <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Ajuda</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflowY: 'auto', maxHeight: '67vh' }}>
        <h5>Operador de atribuição</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>var = expr</td>
              <td>Atribuição</td>
            </tr>
          </tbody>
        </Table>
        <h5>Operadores aritméticos</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x + y</td>
              <td>Soma</td>
            </tr>
            <tr>
              <td className={classes}>x - y</td>
              <td>Subtração</td>
            </tr>
            <tr>
              <td className={classes}>+x</td>
              <td>Identidade</td>
            </tr>
            <tr>
              <td className={classes}>-x</td>
              <td>Negação</td>
            </tr>
            <tr>
              <td className={classes}>x * y</td>
              <td>Multiplicação</td>
            </tr>
            <tr>
              <td className={classes}>x / y</td>
              <td>Divisão real</td>
            </tr>
          </tbody>
        </Table>
        <h5>Operadores de comparação</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x == y</td>
              <td>Igual</td>
            </tr>
            <tr>
              <td className={classes}>x != y</td>
              <td>Diferente</td>
            </tr>
            <tr>
              <td className={classes}>x &gt; y</td>
              <td>Maior</td>
            </tr>
            <tr>
              <td className={classes}>x &gt;= y</td>
              <td>Maior ou igual</td>
            </tr>
            <tr>
              <td className={classes}>x &lt; y</td>
              <td>Menor</td>
            </tr>
            <tr>
              <td className={classes}>x &lt;= y</td>
              <td>Menor ou igual</td>
            </tr>
          </tbody>
        </Table>
        <h5>Operadores lógicos</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>a || b</td>
              <td>Conjunção (ou)</td>
            </tr>
            <tr>
              <td className={classes}>a && b</td>
              <td>Disjunção (e)</td>
            </tr>
            <tr>
              <td className={classes}>!a</td>
              <td>Negação</td>
            </tr>
          </tbody>
        </Table>
        <h5>Concatenação de strings</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>a & b</td>
              <td>Concatenação</td>
            </tr>
          </tbody>
        </Table>
        <h5>Funções matemáticas</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>div(a, b)</td>
              <td>Divisão inteira</td>
            </tr>
            <tr>
              <td className={classes}>mod(a, b)</td>
              <td>Resto da divisão</td>
            </tr>
            <tr>
              <td className={classes}>pow(x, y)</td>
              <td>Potência (x<sup>y</sup>)</td>
            </tr>
            <tr>
              <td className={classes}>sqrt(x)</td>
              <td>Raiz quadrada</td>
            </tr>
            <tr>
              <td className={classes}>log(x)</td>
              <td>Logaritmo natural</td>
            </tr>
            <tr>
              <td className={classes}>log10(x)</td>
              <td>Logaritmo na base 10</td>
            </tr>
            <tr>
              <td className={classes}>log2(x)</td>
              <td>Logaritmo na base 2</td>
            </tr>
            <tr>
              <td className={classes}>exp(x)</td>
              <td>Exponencial</td>
            </tr>
            <tr>
              <td className={classes}>sin(x)</td>
              <td>Seno</td>
            </tr>
            <tr>
              <td className={classes}>cos(x)</td>
              <td>Cosseno</td>
            </tr>
            <tr>
              <td className={classes}>tan(x)</td>
              <td>Tangente</td>
            </tr>
            <tr>
              <td className={classes}>asin(x)</td>
              <td>Arco seno</td>
            </tr>
            <tr>
              <td className={classes}>acos(x)</td>
              <td>Arco cosseno</td>
            </tr>
            <tr>
              <td className={classes}>atan(x)</td>
              <td>Arco tangente</td>
            </tr>
            <tr>
              <td className={classes}>sinh(x)</td>
              <td>Seno hiperbólico</td>
            </tr>
            <tr>
              <td className={classes}>cosh(x)</td>
              <td>Cosseno hiperbólico</td>
            </tr>
            <tr>
              <td className={classes}>tanh(x)</td>
              <td>Tangente hiperbólica</td>
            </tr>
            <tr>
              <td className={classes}>asinh(x)</td>
              <td>Arco seno hiperbólico</td>
            </tr>
            <tr>
              <td className={classes}>acosh(x)</td>
              <td>Arco cosseno hiperbólico</td>
            </tr>
            <tr>
              <td className={classes}>atanh(x)</td>
              <td>Arco tangente hiperbólico</td>
            </tr>
            <tr>
              <td className={classes}>sign(x)</td>
              <td>Sinal</td>
            </tr>
            <tr>
              <td className={classes}>abs(x)</td>
              <td>Valor absoluto</td>
            </tr>
            <tr>
              <td className={classes}>round(x)</td>
              <td>Arredondamento para o inteiro mais próximo</td>
            </tr>
            <tr>
              <td className={classes}>floor(x)</td>
              <td>Arredondamento para baixo</td>
            </tr>
            <tr>
              <td className={classes}>ceil(x)</td>
              <td>Arredondamento para cima</td>
            </tr>
            <tr>
              <td className={classes}>min(x, y)</td>
              <td>Mínimo</td>
            </tr>
            <tr>
              <td className={classes}>max(x, y)</td>
              <td>Máximo</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowModal(false)}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
