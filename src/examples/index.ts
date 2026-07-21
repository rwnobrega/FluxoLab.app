import { SimpleFlowchart } from "~/store/serialize";

import competition from "./competition";
import factorial from "./factorial";
import heron from "./heron";
import overtime from "./overtime";
import payment from "./payment";
import secret from "./secret";
import sign from "./sign";

const examples: SimpleFlowchart[] = [
  heron,
  overtime,
  competition,
  sign,
  payment,
  factorial,
  secret,
];

export default examples;
