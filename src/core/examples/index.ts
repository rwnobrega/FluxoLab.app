import { SimpleFlowchart } from "~/store/serialize";

import factorial from "./factorial";
import overtime from "./overtime";
import sign from "./sign";

export interface Example {
  title: string;
  description: string;
  variables: SimpleFlowchart["variables"];
  nodes: SimpleFlowchart["nodes"];
  edges: SimpleFlowchart["edges"];
}

const examples: Example[] = [overtime, sign, factorial];

export default examples;
