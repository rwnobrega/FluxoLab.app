import { SimpleFlowchart } from "~/store/serialize";

import factorial from "./factorial";
import overtime from "./overtime";
import secret from "./secret";
import sign from "./sign";

const examples: SimpleFlowchart[] = [overtime, sign, factorial, secret];

export default examples;
