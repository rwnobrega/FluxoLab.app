import _ from "lodash";

import { Flowchart } from "~/store/useStoreFlowchart";

/*  Returns the ids of the nodes that cannot be reached from the given start
 *  nodes by following the flowchart edges.  Such nodes are dead code; in
 *  particular, only the start block may lack incoming edges.               */
export function getUnreachableNodeIds(
  flowchart: Flowchart,
  startIds: string[],
): string[] {
  const reachable = new Set<string>();
  const stack = [...startIds];
  while (stack.length > 0) {
    const nodeId = stack.pop();
    if (nodeId === undefined || reachable.has(nodeId)) continue;
    reachable.add(nodeId);
    for (const edge of _.filter(flowchart.edges, { source: nodeId })) {
      stack.push(edge.target);
    }
  }
  const unreachable = _.filter(
    flowchart.nodes,
    (node) => !reachable.has(node.id),
  );
  return _.map(unreachable, "id");
}
