import type { GraphNode } from '../types/graph';

type FormListItemProps = {
  node: GraphNode;
  linkedFormLabels: string[];
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
};

export const FormListItem = ({ node, linkedFormLabels, isSelected, onSelect }: FormListItemProps) => {
  const formName = node.data?.name ?? node.id;
  const linkedLabel =
    linkedFormLabels.length > 0 ? `Linked to ${linkedFormLabels.join(', ')}` : 'No linked form';

  return (
    <button
      className={`form-list-item ${isSelected ? 'form-list-item--selected' : ''}`}
      type="button"
      onClick={() => onSelect(node.id)}
      aria-pressed={isSelected}
    >
      <span>{formName}</span>
      <span className="form-list-item-link">{linkedLabel}</span>
    </button>
  );
};
