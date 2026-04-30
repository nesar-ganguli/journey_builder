import type { ActionBlueprintGraph, GraphFieldDefinition, GraphFormDefinition, GraphNode } from '../types/graph';
import type { FormField } from '../types/prefill';

export const getFormDefinitionForNode = (
  graph: ActionBlueprintGraph | null | undefined,
  node: GraphNode | null | undefined,
): GraphFormDefinition | undefined => {
  const componentId = node?.data?.component_id;

  if (!componentId) {
    return undefined;
  }

  return (graph?.forms ?? []).find((form) => form.id === componentId);
};

const getFieldType = (field: GraphFieldDefinition): string => {
  const avantiType = typeof field.avantos_type === 'string' ? field.avantos_type : undefined;
  return avantiType ?? field.format ?? field.type ?? 'unknown';
};

export const getFieldsForFormDefinition = (form: GraphFormDefinition | undefined): FormField[] => {
  const properties = form?.field_schema?.properties ?? {};
  const requiredFields = new Set(form?.field_schema?.required ?? []);

  return Object.entries(properties).map(([key, field]) => ({
    key,
    label: field.title ?? key,
    type: getFieldType(field),
    required: requiredFields.has(key),
  }));
};
