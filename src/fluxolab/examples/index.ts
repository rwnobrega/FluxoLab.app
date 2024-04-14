import { SimplifiedState } from "stores/serialize";

export interface Example {
  title: string;
  description: string;
  variables: SimplifiedState["variables"];
  nodes: SimplifiedState["nodes"];
  edges: SimplifiedState["edges"];
}

import overtime from "./overtime";
import sign from "./sign";
import factorial from "./factorial";

const examples: Example[] = [overtime, sign, factorial];

export default examples;
