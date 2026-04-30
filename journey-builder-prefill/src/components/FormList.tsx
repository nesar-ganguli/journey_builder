import type { ActionBlueprintGraph, GraphNode } from '../types/graph';
import { getDirectUpstreamFormNodes } from '../utils/graphTraversal';
import { FormListItem } from './FormListItem';

type FormListProps = {
  graph: ActionBlueprintGraph;
  formNodes: GraphNode[];
  selectedNodeId: string | null;
  isGraphView: boolean;
  onSelect: (nodeId: string) => void;
  onAddFormClick: () => void;
  onGraphViewClick: () => void;
};

export const FormList = ({
  graph,
  formNodes,
  selectedNodeId,
  isGraphView,
  onSelect,
  onAddFormClick,
  onGraphViewClick,
}: FormListProps) => {
  return (
    <div className="form-list">
      <div className="panel-heading">
        <div className="panel-title-row">
          <h2>Forms</h2>
          <button
            className={`icon-button ${isGraphView ? 'icon-button--active' : ''}`}
            type="button"
            onClick={onGraphViewClick}
            aria-label="Show form links"
            title="Show form links"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="6" cy="7" r="2.5" />
              <circle cx="18" cy="7" r="2.5" />
              <circle cx="12" cy="17" r="2.5" />
              <path d="M8.4 8.7 10.8 15" />
              <path d="M15.6 8.7 13.2 15" />
              <path d="M8.5 7h7" />
            </svg>
          </button>
        </div>
        <span>{formNodes.length}</span>
      </div>
      <button className="add-form-button" type="button" onClick={onAddFormClick}>
        Add form
      </button>
      <div className="form-list-items">
        {formNodes.map((node) => {
          const linkedFormLabels = getDirectUpstreamFormNodes(graph, node.id).map(
            (linkedNode) => linkedNode.data?.name ?? linkedNode.id,
          );

          return (
            <FormListItem
              key={node.id}
              node={node}
              linkedFormLabels={linkedFormLabels}
              isSelected={node.id === selectedNodeId}
              onSelect={(nodeId) => onSelect(nodeId)}
            />
          );
        })}
      </div>
    </div>
  );
};
