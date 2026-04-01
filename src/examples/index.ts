import { SimpleFlowchart } from "~/store/serialize";

import factorial from "./factorial";
import heron from "./heron";
import overtime from "./overtime";
import passing from "./passing";
import payment from "./payment";
import secret from "./secret";
import sign from "./sign";

const examples: SimpleFlowchart[] = [
  heron,
  overtime,
  passing,
  sign,
  payment,
  factorial,
  secret,
];

export default examples;
