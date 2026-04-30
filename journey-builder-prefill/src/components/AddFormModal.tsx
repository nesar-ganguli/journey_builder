import { useEffect, useMemo, useState } from 'react';
import type { GraphFormDefinition, GraphNode } from '../types/graph';
import type { AddFormNodeInput } from '../hooks/useGraph';

type AddFormModalProps = {
  isOpen: boolean;
  formNodes: GraphNode[];
  formDefinitions: GraphFormDefinition[];
  onCancel: () => void;
  onAdd: (input: AddFormNodeInput) => void;
};

const getFormDefinitionLabel = (formDefinition: GraphFormDefinition) => {
  return formDefinition.name ? `${formDefinition.name} (${formDefinition.id})` : formDefinition.id;
};

export const AddFormModal = ({
  isOpen,
  formNodes,
  formDefinitions,
  onCancel,
  onAdd,
}: AddFormModalProps) => {
  const defaultFormDefinitionId = formDefinitions[0]?.id ?? '';
  const [name, setName] = useState('');
  const [linkedFormNodeId, setLinkedFormNodeId] = useState('');
  const [formDefinitionId, setFormDefinitionId] = useState(defaultFormDefinitionId);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setLinkedFormNodeId(formNodes[0]?.id ?? '');
      setFormDefinitionId(defaultFormDefinitionId);
    }
  }, [defaultFormDefinitionId, formNodes, isOpen]);

  const canAdd = useMemo(() => {
    return name.trim().length > 0 && formDefinitionId.length > 0;
  }, [formDefinitionId, name]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal modal--compact" role="dialog" aria-modal="true" aria-labelledby="add-form-modal-title">
        <div className="modal-header">
          <div>
            <p className="modal-kicker">Local form</p>
            <h2 id="add-form-modal-title">Add a new form</h2>
          </div>
        </div>

        <div className="form-stack">
          <label className="form-control" htmlFor="new-form-name">
            <span>Form name</span>
            <input
              id="new-form-name"
              className="search-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: Form G"
              autoFocus
            />
          </label>

          <label className="form-control" htmlFor="new-form-link">
            <span>Linked from</span>
            <select
              id="new-form-link"
              className="select-input"
              value={linkedFormNodeId}
              onChange={(event) => setLinkedFormNodeId(event.target.value)}
            >
              <option value="">No linked form</option>
              {formNodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.data?.name ?? node.id}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control" htmlFor="new-form-template">
            <span>Field schema</span>
            <select
              id="new-form-template"
              className="select-input"
              value={formDefinitionId}
              onChange={(event) => setFormDefinitionId(event.target.value)}
            >
              {formDefinitions.map((formDefinition) => (
                <option key={formDefinition.id} value={formDefinition.id}>
                  {getFormDefinitionLabel(formDefinition)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={!canAdd}
            onClick={() => {
              onAdd({
                name: name.trim(),
                formDefinitionId,
                linkedFormNodeId: linkedFormNodeId || null,
              });
            }}
          >
            Add form
          </button>
        </div>
      </div>
    </div>
  );
};
