import _ from "lodash";

import { Role, getRoleHandles } from "~/core/roles";
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

/*  Numbers the blocks in the order in which the program runs them: the start
 *  block is 0 and, from there, each block comes after the one that leads to
 *  it. This number is what the desk check shows, on the "Block" column and on
 *  the box itself.
 *
 *  It is a *label*, not the node id. Ids are handed out by
 *  `getNextAvailableNodeId` in creation order, and are recycled after a
 *  deletion, so they carry no information about the flow -- a `Leia` added
 *  after the assignment below it keeps the larger id forever. They stay as
 *  they are, because the edges, the machine, the undo history and the shared
 *  link are all written in terms of them; only the label is computed.
 *
 *  The order is a depth-first walk from the start block, taking the T branch
 *  of a conditional before its F branch, with one refinement: a block is held
 *  back until every block that leads to it has been numbered, ignoring the
 *  edges that close a loop. Without that refinement the block *after* an
 *  if/else would be numbered inside the T branch, and the whole F branch would
 *  be pushed past it. On a structured flowchart the result is exactly the
 *  order in which the statements appear in the extracted pseudocode.
 *
 *  Whatever is left over is numbered last, by id: unreachable blocks, and
 *  blocks held back forever because a loop they belong to has two entry points
 *  (no linear order does justice to those anyway). The map is therefore always
 *  total, even for a flowchart with no start block, which the student does see
 *  while building one.
 */
export function getNodeNumbers(flowchart: Flowchart): Map<string, number> {
  const { nodes, edges } = flowchart;

  //  Successors of each block, in the order in which its handles are drawn, so
  //  that the T branch of a conditional is walked before the F branch.
  const successors = new Map<string, string[]>(
    _.map(nodes, (node) => [node.id, []]),
  );
  for (const [source, group] of _.entries(_.groupBy(edges, "source"))) {
    const node = _.find(nodes, { id: source });
    if (node === undefined) continue;
    const handles = _.map(getRoleHandles(node.data.role), "id");
    successors.set(
      source,
      _.map(
        _.sortBy(
          _.filter(group, (edge) => successors.has(edge.target)),
          (edge) => _.indexOf(handles, edge.sourceHandle ?? ""),
        ),
        "target",
      ),
    );
  }

  const start = _.find(nodes, { data: { role: Role.Start } });

  //  1. Depth-first search from the start block, to find the edges that close
  //     a loop: those that point back into the path being walked.
  const backEdges = new Set<string>();
  const seen = new Set<string>();
  const onPath = new Set<string>();
  if (start !== undefined) {
    const frames = [{ id: start.id, next: 0 }];
    seen.add(start.id);
    onPath.add(start.id);
    while (frames.length > 0) {
      const frame = frames[frames.length - 1];
      const children = successors.get(frame.id) as string[];
      if (frame.next === children.length) {
        onPath.delete(frame.id);
        frames.pop();
        continue;
      }
      const child = children[frame.next];
      frame.next += 1;
      if (onPath.has(child)) {
        backEdges.add(`${frame.id}->${child}`);
      } else if (!seen.has(child)) {
        seen.add(child);
        onPath.add(child);
        frames.push({ id: child, next: 0 });
      }
    }
  }

  //  2. How many blocks still have to be numbered before each block may be.
  //     Only reachable blocks count: an unreachable one must not hold back a
  //     block that the program does run.
  const pending = new Map<string, number>(_.map(nodes, (node) => [node.id, 0]));
  for (const source of seen) {
    for (const target of successors.get(source) as string[]) {
      if (backEdges.has(`${source}->${target}`)) continue;
      pending.set(target, (pending.get(target) as number) + 1);
    }
  }

  //  3. The walk itself. A successor is followed only once nothing else is
  //     owed to it; the stack is fed in reverse so that ties keep handle order.
  const order: string[] = [];
  const numbered = new Set<string>();
  const stack = start === undefined ? [] : [start.id];
  while (stack.length > 0) {
    const id = stack.pop() as string;
    if (numbered.has(id)) continue;
    numbered.add(id);
    order.push(id);
    const ready: string[] = [];
    for (const target of successors.get(id) as string[]) {
      if (backEdges.has(`${id}->${target}`) || numbered.has(target)) continue;
      pending.set(target, (pending.get(target) as number) - 1);
      if (pending.get(target) === 0) ready.push(target);
    }
    stack.push(...ready.reverse());
  }

  //  4. Leftovers, by id.
  const leftover = _.reject(nodes, (node) => numbered.has(node.id));
  for (const node of _.sortBy(leftover, (node) => parseInt(node.id))) {
    order.push(node.id);
  }

  return new Map(_.map(order, (id, index) => [id, index]));
}
