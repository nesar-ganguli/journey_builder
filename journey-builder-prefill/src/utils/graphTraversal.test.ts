import { describe, expect, it } from 'vitest';
import { createTestGraph } from '../test/testUtils';
import { getDirectUpstreamFormNodes, getFormNodes, getUpstreamFormNodes } from './graphTraversal';

describe('graphTraversal', () => {
  it('returns only form nodes', () => {
    const graph = {
      ...createTestGraph(),
      nodes: [
        ...(createTestGraph().nodes ?? []),
        { id: 'branch-1', type: 'branch' },
      ],
    };

    expect(getFormNodes(graph).map((node) => node.id)).toEqual(['form-a', 'form-b', 'form-c']);
  });

  it('returns direct upstream form nodes', () => {
    const graph = createTestGraph();

    expect(getDirectUpstreamFormNodes(graph, 'form-c').map((node) => node.id)).toEqual(['form-b']);
  });

  it('returns direct and transitive upstream form nodes nearest first', () => {
    const graph = createTestGraph();

    expect(getUpstreamFormNodes(graph, 'form-c').map((node) => node.id)).toEqual(['form-b', 'form-a']);
  });

  it('avoids duplicates and cycles', () => {
    const graph = {
      ...createTestGraph(),
      edges: [
        ...(createTestGraph().edges ?? []),
        { source: 'form-a', target: 'form-c' },
        { source: 'form-c', target: 'form-a' },
      ],
    };

    expect(getUpstreamFormNodes(graph, 'form-c').map((node) => node.id)).toEqual(['form-b', 'form-a']);
  });
});
