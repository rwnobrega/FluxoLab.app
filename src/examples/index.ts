import { SimplifiedState } from "~/store/serialize";

import factorial from "./factorial";
import overtime from "./overtime";
import sign from "./sign";

export interface Example {
  title: string;
  description: string;
  variables: SimplifiedState["variables"];
  nodes: SimplifiedState["nodes"];
  edges: SimplifiedState["edges"];
}

const examples: Example[] = [overtime, sign, factorial];

export default examples;
