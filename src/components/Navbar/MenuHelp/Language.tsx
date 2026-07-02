import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

import useStoreStrings from "~/store/useStoreStrings";

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
        <Modal.Title>{getString("ModalLanguage_Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflowY: "auto", maxHeight: "67vh" }}>
        <h5>{getString("ModalLanguage_SubtitleAssignment")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>var = expr</td>
              <td>{getString("ModalLanguage_Assignment")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalLanguage_SubtitleArithmetic")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x + y</td>
              <td>{getString("ModalLanguage_Addition")}</td>
            </tr>
            <tr>
              <td className={classes}>x - y</td>
              <td>{getString("ModalLanguage_Subtraction")}</td>
            </tr>
            <tr>
              <td className={classes}>x * y</td>
              <td>{getString("ModalLanguage_Multiplication")}</td>
            </tr>
            <tr>
              <td className={classes}>x / y</td>
              <td>{getString("ModalLanguage_RealDivision")}</td>
            </tr>
            <tr>
              <td className={classes}>a div b</td>
              <td>{getString("ModalLanguage_IntegerDivision")}</td>
            </tr>
            <tr>
              <td className={classes}>a mod b</td>
              <td>{getString("ModalLanguage_Modulus")}</td>
            </tr>
            <tr>
              <td className={classes}>+x</td>
              <td>{getString("ModalLanguage_Positive")}</td>
            </tr>
            <tr>
              <td className={classes}>-x</td>
              <td>{getString("ModalLanguage_Negative")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalLanguage_SubtitleComparison")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>x == y</td>
              <td>{getString("ModalLanguage_Equal")}</td>
            </tr>
            <tr>
              <td className={classes}>x != y</td>
              <td>{getString("ModalLanguage_NotEqual")}</td>
            </tr>
            <tr>
              <td className={classes}>x &gt; y</td>
              <td>{getString("ModalLanguage_Greater")}</td>
            </tr>
            <tr>
              <td className={classes}>x &gt;= y</td>
              <td>{getString("ModalLanguage_GreaterOrEqual")}</td>
            </tr>
            <tr>
              <td className={classes}>x &lt; y</td>
              <td>{getString("ModalLanguage_Less")}</td>
            </tr>
            <tr>
              <td className={classes}>x &lt;= y</td>
              <td>{getString("ModalLanguage_LessOrEqual")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalLanguage_SubtitleLogical")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>a || b</td>
              <td>{getString("ModalLanguage_Disjunction")}</td>
            </tr>
            <tr>
              <td className={classes}>a && b</td>
              <td>{getString("ModalLanguage_Conjunction")}</td>
            </tr>
            <tr>
              <td className={classes}>!a</td>
              <td>{getString("ModalLanguage_Negation")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalLanguage_SubtitleFunctions")}</h5>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td className={classes}>pow(x, y)</td>
              <td>{getString("ModalLanguage_Power")}</td>
            </tr>
            <tr>
              <td className={classes}>sqrt(x)</td>
              <td>{getString("ModalLanguage_SquareRoot")}</td>
            </tr>
            <tr>
              <td className={classes}>log(x)</td>
              <td>{getString("ModalLanguage_NaturalLogarithm")}</td>
            </tr>
            <tr>
              <td className={classes}>log10(x)</td>
              <td>{getString("ModalLanguage_CommonLogarithm")}</td>
            </tr>
            <tr>
              <td className={classes}>log2(x)</td>
              <td>{getString("ModalLanguage_BinaryLogarithm")}</td>
            </tr>
            <tr>
              <td className={classes}>exp(x)</td>
              <td>{getString("ModalLanguage_Exponential")}</td>
            </tr>
            <tr>
              <td className={classes}>sin(x)</td>
              <td>{getString("ModalLanguage_Sine")}</td>
            </tr>
            <tr>
              <td className={classes}>cos(x)</td>
              <td>{getString("ModalLanguage_Cosine")}</td>
            </tr>
            <tr>
              <td className={classes}>tan(x)</td>
              <td>{getString("ModalLanguage_Tangent")}</td>
            </tr>
            <tr>
              <td className={classes}>asin(x)</td>
              <td>{getString("ModalLanguage_ArcSine")}</td>
            </tr>
            <tr>
              <td className={classes}>acos(x)</td>
              <td>{getString("ModalLanguage_ArcCosine")}</td>
            </tr>
            <tr>
              <td className={classes}>atan(x)</td>
              <td>{getString("ModalLanguage_ArcTangent")}</td>
            </tr>
            <tr>
              <td className={classes}>sinh(x)</td>
              <td>{getString("ModalLanguage_HyperbolicSine")}</td>
            </tr>
            <tr>
              <td className={classes}>cosh(x)</td>
              <td>{getString("ModalLanguage_HyperbolicCosine")}</td>
            </tr>
            <tr>
              <td className={classes}>tanh(x)</td>
              <td>{getString("ModalLanguage_HyperbolicTangent")}</td>
            </tr>
            <tr>
              <td className={classes}>asinh(x)</td>
              <td>{getString("ModalLanguage_ArcSineHyperbolic")}</td>
            </tr>
            <tr>
              <td className={classes}>acosh(x)</td>
              <td>{getString("ModalLanguage_ArcCosineHyperbolic")}</td>
            </tr>
            <tr>
              <td className={classes}>atanh(x)</td>
              <td>{getString("ModalLanguage_ArcTangentHyperbolic")}</td>
            </tr>
            <tr>
              <td className={classes}>sign(x)</td>
              <td>{getString("ModalLanguage_Sign")}</td>
            </tr>
            <tr>
              <td className={classes}>abs(x)</td>
              <td>{getString("ModalLanguage_AbsoluteValue")}</td>
            </tr>
            <tr>
              <td className={classes}>round(x)</td>
              <td>{getString("ModalLanguage_Round")}</td>
            </tr>
            <tr>
              <td className={classes}>floor(x)</td>
              <td>{getString("ModalLanguage_Floor")}</td>
            </tr>
            <tr>
              <td className={classes}>ceil(x)</td>
              <td>{getString("ModalLanguage_Ceil")}</td>
            </tr>
            <tr>
              <td className={classes}>min(x, y)</td>
              <td>{getString("ModalLanguage_Minimum")}</td>
            </tr>
            <tr>
              <td className={classes}>max(x, y)</td>
              <td>{getString("ModalLanguage_Maximum")}</td>
            </tr>
            <tr>
              <td className={classes}>rand()</td>
              <td>{getString("ModalLanguage_Rand")}</td>
            </tr>
            <tr>
              <td className={classes}>rand_int(a, b)</td>
              <td>{getString("ModalLanguage_RandInt")}</td>
            </tr>
          </tbody>
        </Table>
        <h5>{getString("ModalLanguage_SubtitleConstants")}</h5>
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
