import { describe, expect, it } from 'vitest';
import { createTestGraph } from '../test/testUtils';
import { getFieldsForFormDefinition, getFormDefinitionForNode } from './formSchema';

describe('formSchema', () => {
  it('finds a form definition from node component_id', () => {
    const graph = createTestGraph();
    const node = graph.nodes?.find((candidate) => candidate.id === 'form-a');

    expect(getFormDefinitionForNode(graph, node)?.id).toBe('schema-a');
  });

  it('returns field metadata from a form schema', () => {
    const graph = createTestGraph();
    const formDefinition = graph.forms?.find((form) => form.id === 'schema-a');

    expect(getFieldsForFormDefinition(formDefinition)).toEqual([
      {
        key: 'email',
        label: 'Email',
        type: 'short-text',
        required: true,
      },
      {
        key: 'name',
        label: 'Name',
        type: 'short-text',
        required: false,
      },
    ]);
  });
});
