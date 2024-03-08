import React from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

interface Props {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const classes = 'font-monospace col-3'
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
              <td className='col-7'>Atribuição</td>
              <td className='col-2'>Precedência 0</td>
            </tr>
          </tbody>
        </Table>
        <h5>Operadores aritméticos</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x + y</td>
              <td className='col-7'>Adição</td>
              <td className='col-2'>Precedência 4</td>
            </tr>
            <tr>
              <td className={classes}>x - y</td>
              <td>Subtração</td>
              <td>Precedência 4</td>
            </tr>
            <tr>
              <td className={classes}>x * y</td>
              <td>Multiplicação</td>
              <td>Precedência 5</td>
            </tr>
            <tr>
              <td className={classes}>x / y</td>
              <td>Divisão real</td>
              <td>Precedência 5</td>
            </tr>
            <tr>
              <td className={classes}>a div b</td>
              <td>Divisão inteira</td>
              <td>Precedência 5</td>
            </tr>
            <tr>
              <td className={classes}>a mod b</td>
              <td>Resto da divisão</td>
              <td>Precedência 5</td>
            </tr>
            <tr>
              <td className={classes}>+x</td>
              <td>Identidade</td>
              <td>Precedência 6</td>
            </tr>
            <tr>
              <td className={classes}>-x</td>
              <td>Negação</td>
              <td>Precedência 6</td>
            </tr>
          </tbody>
        </Table>
        <h5>Operadores de comparação</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x == y</td>
              <td className='col-7'>Igual</td>
              <td className='col-2'>Precedência 3</td>
            </tr>
            <tr>
              <td className={classes}>x != y</td>
              <td>Diferente</td>
              <td>Precedência 3</td>
            </tr>
            <tr>
              <td className={classes}>x &gt; y</td>
              <td>Maior</td>
              <td>Precedência 3</td>
            </tr>
            <tr>
              <td className={classes}>x &gt;= y</td>
              <td>Maior ou igual</td>
              <td>Precedência 3</td>
            </tr>
            <tr>
              <td className={classes}>x &lt; y</td>
              <td>Menor</td>
              <td>Precedência 3</td>
            </tr>
            <tr>
              <td className={classes}>x &lt;= y</td>
              <td>Menor ou igual</td>
              <td>Precedência 3</td>
            </tr>
          </tbody>
        </Table>
        <h5>Operadores lógicos</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>a || b</td>
              <td className='col-7'>Disjunção (ou)</td>
              <td className='col-2'>Precedência 1</td>
            </tr>
            <tr>
              <td className={classes}>a && b</td>
              <td>Conjunção (e)</td>
              <td>Precedência 2</td>
            </tr>
            <tr>
              <td className={classes}>!a</td>
              <td>Negação</td>
              <td>Precedência 6</td>
            </tr>
          </tbody>
        </Table>
        <h5>Funções matemáticas</h5>
        <Table striped bordered hover>
          <tbody>
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
            <tr>
              <td className={classes}>rand()</td>
              <td>Número fracionário aleatório entre 0 e 1</td>
            </tr>
            <tr>
              <td className={classes}>rand_int(a, b)</td>
              <td>Número inteiro aleatório entre a e b (inclusive)</td>
            </tr>
          </tbody>
        </Table>
        <h5>Constantes numéricas</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>pi</td>
              <td>π ≅ 3.141592653589793</td>
            </tr>
            <tr>
              <td className={classes}>tau</td>
              <td>τ = 2π ≅ 6.283185307179586</td>
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
