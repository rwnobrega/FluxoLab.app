import React from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

import useStoreStrings from "stores/useStoreStrings";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export default function ({ showModal, setShowModal }: Props): JSX.Element {
  const { getString } = useStoreStrings();
  const classes = "font-monospace col-3";
  return (
    <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{getString("ModalHelp_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflowY: "auto", maxHeight: "67vh" }}>
        <h5>{getString("ModalHelp_SubtitleAssignment")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>var = expr</td>
              <td>{getString("ModalHelp_Assignment")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalHelp_SubtitleArithmetic")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x + y</td>
              <td>{getString("ModalHelp_Addition")}</td>
            </tr>
            <tr>
              <td className={classes}>x - y</td>
              <td>{getString("ModalHelp_Subtraction")}</td>
            </tr>
            <tr>
              <td className={classes}>x * y</td>
              <td>{getString("ModalHelp_Multiplication")}</td>
            </tr>
            <tr>
              <td className={classes}>x / y</td>
              <td>{getString("ModalHelp_RealDivision")}</td>
            </tr>
            <tr>
              <td className={classes}>a div b</td>
              <td>{getString("ModalHelp_IntegerDivision")}</td>
            </tr>
            <tr>
              <td className={classes}>a mod b</td>
              <td>{getString("ModalHelp_Modulus")}</td>
            </tr>
            <tr>
              <td className={classes}>+x</td>
              <td>{getString("ModalHelp_Positive")}</td>
            </tr>
            <tr>
              <td className={classes}>-x</td>
              <td>{getString("ModalHelp_Negative")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalHelp_SubtitleComparison")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x == y</td>
              <td>{getString("ModalHelp_Equal")}</td>
            </tr>
            <tr>
              <td className={classes}>x != y</td>
              <td>{getString("ModalHelp_NotEqual")}</td>
            </tr>
            <tr>
              <td className={classes}>x &gt; y</td>
              <td>{getString("ModalHelp_Greater")}</td>
            </tr>
            <tr>
              <td className={classes}>x &gt;= y</td>
              <td>{getString("ModalHelp_GreaterOrEqual")}</td>
            </tr>
            <tr>
              <td className={classes}>x &lt; y</td>
              <td>{getString("ModalHelp_Less")}</td>
            </tr>
            <tr>
              <td className={classes}>x &lt;= y</td>
              <td>{getString("ModalHelp_LessOrEqual")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalHelp_SubtitleLogical")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>a || b</td>
              <td>{getString("ModalHelp_Disjunction")}</td>
            </tr>
            <tr>
              <td className={classes}>a && b</td>
              <td>{getString("ModalHelp_Conjunction")}</td>
            </tr>
            <tr>
              <td className={classes}>!a</td>
              <td>{getString("ModalHelp_Negation")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalHelp_SubtitleFunctions")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>pow(x, y)</td>
              <td>{getString("ModalHelp_Power")}</td>
            </tr>
            <tr>
              <td className={classes}>sqrt(x)</td>
              <td>{getString("ModalHelp_SquareRoot")}</td>
            </tr>
            <tr>
              <td className={classes}>log(x)</td>
              <td>{getString("ModalHelp_NaturalLogarithm")}</td>
            </tr>
            <tr>
              <td className={classes}>log10(x)</td>
              <td>{getString("ModalHelp_CommonLogarithm")}</td>
            </tr>
            <tr>
              <td className={classes}>log2(x)</td>
              <td>{getString("ModalHelp_BinaryLogarithm")}</td>
            </tr>
            <tr>
              <td className={classes}>exp(x)</td>
              <td>{getString("ModalHelp_Exponential")}</td>
            </tr>
            <tr>
              <td className={classes}>sin(x)</td>
              <td>{getString("ModalHelp_Sine")}</td>
            </tr>
            <tr>
              <td className={classes}>cos(x)</td>
              <td>{getString("ModalHelp_Cosine")}</td>
            </tr>
            <tr>
              <td className={classes}>tan(x)</td>
              <td>{getString("ModalHelp_Tangent")}</td>
            </tr>
            <tr>
              <td className={classes}>asin(x)</td>
              <td>{getString("ModalHelp_ArcSine")}</td>
            </tr>
            <tr>
              <td className={classes}>acos(x)</td>
              <td>{getString("ModalHelp_ArcCosine")}</td>
            </tr>
            <tr>
              <td className={classes}>atan(x)</td>
              <td>{getString("ModalHelp_ArcTangent")}</td>
            </tr>
            <tr>
              <td className={classes}>sinh(x)</td>
              <td>{getString("ModalHelp_HyperbolicSine")}</td>
            </tr>
            <tr>
              <td className={classes}>cosh(x)</td>
              <td>{getString("ModalHelp_HyperbolicCosine")}</td>
            </tr>
            <tr>
              <td className={classes}>tanh(x)</td>
              <td>{getString("ModalHelp_HyperbolicTangent")}</td>
            </tr>
            <tr>
              <td className={classes}>asinh(x)</td>
              <td>{getString("ModalHelp_ArcSineHyperbolic")}</td>
            </tr>
            <tr>
              <td className={classes}>acosh(x)</td>
              <td>{getString("ModalHelp_ArcCosineHyperbolic")}</td>
            </tr>
            <tr>
              <td className={classes}>atanh(x)</td>
              <td>{getString("ModalHelp_ArcTangentHyperbolic")}</td>
            </tr>
            <tr>
              <td className={classes}>sign(x)</td>
              <td>{getString("ModalHelp_Sign")}</td>
            </tr>
            <tr>
              <td className={classes}>abs(x)</td>
              <td>{getString("ModalHelp_AbsoluteValue")}</td>
            </tr>
            <tr>
              <td className={classes}>round(x)</td>
              <td>{getString("ModalHelp_Round")}</td>
            </tr>
            <tr>
              <td className={classes}>floor(x)</td>
              <td>{getString("ModalHelp_Floor")}</td>
            </tr>
            <tr>
              <td className={classes}>ceil(x)</td>
              <td>{getString("ModalHelp_Ceil")}</td>
            </tr>
            <tr>
              <td className={classes}>min(x, y)</td>
              <td>{getString("ModalHelp_Minimum")}</td>
            </tr>
            <tr>
              <td className={classes}>max(x, y)</td>
              <td>{getString("ModalHelp_Maximum")}</td>
            </tr>
            <tr>
              <td className={classes}>rand()</td>
              <td>{getString("ModalHelp_Rand")}</td>
            </tr>
            <tr>
              <td className={classes}>rand_int(a, b)</td>
              <td>{getString("ModalHelp_RandInt")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalHelp_SubtitleConstants")}</h5>
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
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          {getString("Button_Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
