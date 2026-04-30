import type { ActionBlueprintGraph, GraphNode } from '../types/graph';

export const getFormNodes = (graph: ActionBlueprintGraph | null | undefined): GraphNode[] => {
  return (graph?.nodes ?? []).filter((node) => node.type === 'form');
};

const getIncomingNodeIds = (graph: ActionBlueprintGraph, nodeId: string): string[] => {
  const upstreamFromEdges = (graph.edges ?? [])
    .filter((edge) => edge.target === nodeId)
    .map((edge) => edge.source);

  const node = (graph.nodes ?? []).find((candidate) => candidate.id === nodeId);
  const upstreamFromPrerequisites = node?.data?.prerequisites ?? [];

  return [...upstreamFromEdges, ...upstreamFromPrerequisites].filter(
    (candidateId, index, allIds) => candidateId && allIds.indexOf(candidateId) === index,
  );
};

export const getDirectUpstreamFormNodes = (
  graph: ActionBlueprintGraph,
  selectedNodeId: string,
): GraphNode[] => {
  const nodesById = new Map((graph.nodes ?? []).map((node) => [node.id, node]));

  return getIncomingNodeIds(graph, selectedNodeId)
    .map((nodeId) => nodesById.get(nodeId))
    .filter((node): node is GraphNode => node !== undefined && node.type === 'form');
};

export const getUpstreamFormNodes = (
  graph: ActionBlueprintGraph,
  selectedNodeId: string,
): GraphNode[] => {
  const nodesById = new Map((graph.nodes ?? []).map((node) => [node.id, node]));
  const visited = new Set<string>([selectedNodeId]);
  const upstreamFormNodes: GraphNode[] = [];
  const queue = getIncomingNodeIds(graph, selectedNodeId);

  while (queue.length > 0) {
    const currentNodeId = queue.shift();

    if (!currentNodeId || visited.has(currentNodeId)) {
      continue;
    }

    visited.add(currentNodeId);

    const currentNode = nodesById.get(currentNodeId);
    if (!currentNode) {
      continue;
    }

    if (currentNode.type === 'form') {
      upstreamFormNodes.push(currentNode);
    }

    queue.push(...getIncomingNodeIds(graph, currentNodeId));
  }

  return upstreamFormNodes;
};
