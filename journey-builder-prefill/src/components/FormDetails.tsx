import { useMemo, useState } from 'react';
import type { ActionBlueprintGraph, GraphNode } from '../types/graph';
import type { PrefillMapping, PrefillMappingsByForm } from '../types/prefill';
import type { PrefillDataSource } from '../dataSources/types';
import { buildPrefillOptions } from '../dataSources';
import { getFieldsForFormDefinition, getFormDefinitionForNode } from '../utils/formSchema';
import { createMappingFromOption } from '../utils/mappingFormatters';
import { EmptyState } from './EmptyState';
import { PrefillFieldList } from './PrefillFieldList';
import { PrefillSourceModal } from './PrefillSourceModal';

type FormDetailsProps = {
  graph: ActionBlueprintGraph;
  selectedNode: GraphNode | null;
  dataSources: PrefillDataSource[];
  mappingsByForm: PrefillMappingsByForm;
  isDirty: boolean;
  saveStatus: 'saved' | 'unsaved' | 'idle';
  onSetMapping: (formNodeId: string, fieldKey: string, mapping: PrefillMapping) => void;
  onClearMapping: (formNodeId: string, fieldKey: string) => void;
  onSaveMappings: (formNodeId: string) => void;
};

export const FormDetails = ({
  graph,
  selectedNode,
  dataSources,
  mappingsByForm,
  isDirty,
  saveStatus,
  onSetMapping,
  onClearMapping,
  onSaveMappings,
}: FormDetailsProps) => {
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const selectedFormDefinition = getFormDefinitionForNode(graph, selectedNode);
  const fields = getFieldsForFormDefinition(selectedFormDefinition);
  const activeField = fields.find((field) => field.key === activeFieldKey);

  const prefillOptions = useMemo(() => {
    if (!selectedNode) {
      return [];
    }

    return buildPrefillOptions(dataSources, { graph, selectedNode });
  }, [dataSources, graph, selectedNode]);

  if (!selectedNode) {
    return (
      <EmptyState
        title="Select a form"
        message="Choose a form from the list to configure field prefill mappings."
      />
    );
  }

  const formName = selectedNode.data?.name ?? selectedNode.id;

  return (
    <div className="details-panel">
      <div className="details-header">
        <div>
          <p className="app-kicker">Selected form</p>
          <h2>{formName}</h2>
        </div>
        <div className="details-actions">
          <span className={`save-status save-status--${saveStatus}`}>
            {saveStatus === 'unsaved' ? 'Unsaved changes' : saveStatus === 'saved' ? 'Saved' : 'Not saved'}
          </span>
          <span className="field-count">{fields.length} fields</span>
          <button
            className="primary-button"
            type="button"
            disabled={!isDirty}
            onClick={() => onSaveMappings(selectedNode.id)}
          >
            Save
          </button>
        </div>
      </div>

      {fields.length > 0 ? (
        <PrefillFieldList
          fields={fields}
          formNodeId={selectedNode.id}
          mappingsByForm={mappingsByForm}
          onConfigure={setActiveFieldKey}
          onClear={(fieldKey) => onClearMapping(selectedNode.id, fieldKey)}
        />
      ) : (
        <EmptyState title="No fields found" message="This form does not expose a field schema." />
      )}

      <PrefillSourceModal
        isOpen={Boolean(activeField)}
        options={prefillOptions}
        targetFieldLabel={activeField?.label ?? ''}
        onCancel={() => setActiveFieldKey(null)}
        onSelect={(option) => {
          if (!activeField) {
            return;
          }

          onSetMapping(selectedNode.id, activeField.key, createMappingFromOption(option));
          setActiveFieldKey(null);
        }}
      />
    </div>
  );
};
