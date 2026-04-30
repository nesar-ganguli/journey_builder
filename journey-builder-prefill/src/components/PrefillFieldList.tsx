import type { FormField, PrefillMappingsByForm } from '../types/prefill';
import { getFieldMapping } from '../utils/mappingFormatters';
import { PrefillFieldRow } from './PrefillFieldRow';

type PrefillFieldListProps = {
  fields: FormField[];
  formNodeId: string;
  mappingsByForm: PrefillMappingsByForm;
  onConfigure: (fieldKey: string) => void;
  onClear: (fieldKey: string) => void;
};

export const PrefillFieldList = ({
  fields,
  formNodeId,
  mappingsByForm,
  onConfigure,
  onClear,
}: PrefillFieldListProps) => {
  return (
    <div className="field-list">
      {fields.map((field) => (
        <PrefillFieldRow
          key={field.key}
          field={field}
          mapping={getFieldMapping(mappingsByForm, formNodeId, field)}
          onConfigure={onConfigure}
          onClear={onClear}
        />
      ))}
    </div>
  );
};
