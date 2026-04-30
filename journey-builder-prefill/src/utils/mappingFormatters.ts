import type { ActionBlueprintGraph, GraphNode } from '../types/graph';
import type { FormField, PrefillMapping, PrefillMappingsByForm } from '../types/prefill';
import type { PrefillOption } from '../dataSources/types';

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const formatFieldReference = (sourceLabel: string, fieldKey: string): string => {
  return `${sourceLabel}.${fieldKey}`;
};

export const createMappingFromOption = (option: PrefillOption): PrefillMapping => {
  if (option.value.type === 'global') {
    return {
      type: 'global',
      sourceId: 'global',
      sourceFieldKey: option.value.fieldKey,
      label: formatFieldReference('Global', option.value.fieldKey),
    };
  }

  return {
    type: 'form_field',
    sourceNodeId: option.value.sourceId,
    sourceFormName: option.sourceLabel,
    sourceFieldKey: option.value.fieldKey,
    label: formatFieldReference(option.sourceLabel, option.value.fieldKey),
  };
};

const normalizeMappingValue = (
  rawMapping: unknown,
  nodesById: Map<string, GraphNode>,
): PrefillMapping | undefined => {
  if (!isObject(rawMapping)) {
    return undefined;
  }

  const type = typeof rawMapping.type === 'string' ? rawMapping.type : undefined;
  const rawSourceId =
    rawMapping.sourceNodeId ??
    rawMapping.source_node_id ??
    rawMapping.sourceId ??
    rawMapping.source_id ??
    rawMapping.component_key ??
    rawMapping.node_id;
  const rawFieldKey =
    rawMapping.sourceFieldKey ??
    rawMapping.source_field_key ??
    rawMapping.fieldKey ??
    rawMapping.field_key ??
    rawMapping.output_key ??
    rawMapping.field ??
    rawMapping.key;
  const sourceId = typeof rawSourceId === 'string' ? rawSourceId : undefined;
  const sourceFieldKey = typeof rawFieldKey === 'string' ? rawFieldKey : undefined;

  if (!sourceFieldKey) {
    return undefined;
  }

  if (type === 'global' || rawMapping.source_type === 'global' || sourceId === 'global') {
    return {
      type: 'global',
      sourceId: 'global',
      sourceFieldKey,
      label: formatFieldReference('Global', sourceFieldKey),
    };
  }

  if (!sourceId) {
    return undefined;
  }

  const sourceFormName =
    typeof rawMapping.sourceFormName === 'string'
      ? rawMapping.sourceFormName
      : nodesById.get(sourceId)?.data?.name ?? sourceId;

  return {
    type: 'form_field',
    sourceNodeId: sourceId,
    sourceFormName,
    sourceFieldKey,
    label: formatFieldReference(sourceFormName, sourceFieldKey),
  };
};

export const initializePrefillMappings = (graph: ActionBlueprintGraph): PrefillMappingsByForm => {
  const nodes = graph.nodes ?? [];
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return nodes.reduce<PrefillMappingsByForm>((mappingsByForm, node) => {
    if (node.type !== 'form') {
      return mappingsByForm;
    }

    const inputMapping = node.data?.input_mapping ?? {};
    const normalizedFieldMappings = Object.entries(inputMapping).reduce<Record<string, PrefillMapping>>(
      (fieldMappings, [targetFieldKey, rawMapping]) => {
        const normalizedMapping = normalizeMappingValue(rawMapping, nodesById);

        if (normalizedMapping) {
          fieldMappings[targetFieldKey] = normalizedMapping;
        }

        return fieldMappings;
      },
      {},
    );

    mappingsByForm[node.id] = normalizedFieldMappings;
    return mappingsByForm;
  }, {});
};

export const getFieldMapping = (
  mappingsByForm: PrefillMappingsByForm,
  formNodeId: string,
  field: FormField,
): PrefillMapping | undefined => {
  return mappingsByForm[formNodeId]?.[field.key];
};
