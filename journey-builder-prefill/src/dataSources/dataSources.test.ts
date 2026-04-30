import { describe, expect, it } from 'vitest';
import { createTestGraph } from '../test/testUtils';
import { buildPrefillOptions, defaultPrefillDataSources, groupPrefillOptions } from './index';

describe('prefill data sources', () => {
  it('builds upstream form field and global options', () => {
    const graph = createTestGraph();
    const selectedNode = graph.nodes?.find((node) => node.id === 'form-c');

    if (!selectedNode) {
      throw new Error('Expected selected node');
    }

    const options = buildPrefillOptions(defaultPrefillDataSources, { graph, selectedNode });

    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'form-b:email',
          sourceLabel: 'Form B',
          value: {
            type: 'form_field',
            sourceId: 'form-b',
            fieldKey: 'email',
          },
        }),
        expect.objectContaining({
          id: 'form-a:email',
          sourceLabel: 'Form A',
          value: {
            type: 'form_field',
            sourceId: 'form-a',
            fieldKey: 'email',
          },
        }),
        expect.objectContaining({
          id: 'global:current_user_email',
          sourceLabel: 'Global Data',
          value: {
            type: 'global',
            sourceId: 'global',
            fieldKey: 'current_user_email',
          },
        }),
      ]),
    );
  });

  it('groups options by source label and source type', () => {
    const groups = groupPrefillOptions([
      {
        id: 'form-a:email',
        label: 'email',
        sourceType: 'form_field',
        sourceLabel: 'Form A',
        value: { type: 'form_field', sourceId: 'form-a', fieldKey: 'email' },
      },
      {
        id: 'form-a:name',
        label: 'name',
        sourceType: 'form_field',
        sourceLabel: 'Form A',
        value: { type: 'form_field', sourceId: 'form-a', fieldKey: 'name' },
      },
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].options).toHaveLength(2);
  });
});
