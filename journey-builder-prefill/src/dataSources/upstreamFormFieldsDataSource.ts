import type { PrefillDataSource, PrefillOption } from './types';
import { getUpstreamFormNodes } from '../utils/graphTraversal';
import { getFieldsForFormDefinition, getFormDefinitionForNode } from '../utils/formSchema';

export const upstreamFormFieldsDataSource: PrefillDataSource = {
  id: 'upstream-form-fields',
  label: 'Upstream forms',
  getOptions: ({ graph, selectedNode }) => {
    const upstreamNodes = getUpstreamFormNodes(graph, selectedNode.id);

    return upstreamNodes.flatMap<PrefillOption>((node) => {
      const sourceLabel = node.data?.name ?? node.id;
      const formDefinition = getFormDefinitionForNode(graph, node);
      const fields = getFieldsForFormDefinition(formDefinition);

      return fields.map((field) => ({
        id: `${node.id}:${field.key}`,
        label: field.key,
        sourceType: 'form_field',
        sourceLabel,
        value: {
          type: 'form_field',
          sourceId: node.id,
          fieldKey: field.key,
        },
      }));
    });
  },
};
