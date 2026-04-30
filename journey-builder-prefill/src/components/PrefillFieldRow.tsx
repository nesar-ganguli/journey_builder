import type { FormField, PrefillMapping } from '../types/prefill';

type PrefillFieldRowProps = {
  field: FormField;
  mapping: PrefillMapping | undefined;
  onConfigure: (fieldKey: string) => void;
  onClear: (fieldKey: string) => void;
};

export const PrefillFieldRow = ({ field, mapping, onConfigure, onClear }: PrefillFieldRowProps) => {
  const canConfigure = !mapping;

  return (
    <div
      className={`field-row ${canConfigure ? 'field-row--clickable' : ''}`}
      onClick={() => {
        if (canConfigure) {
          onConfigure(field.key);
        }
      }}
      role={canConfigure ? 'button' : undefined}
      tabIndex={canConfigure ? 0 : undefined}
      onKeyDown={(event) => {
        if (canConfigure && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onConfigure(field.key);
        }
      }}
    >
      <div className="field-row-main">
        <div>
          <div className="field-name">
            {field.label}
            {field.required ? <span className="required-dot">Required</span> : null}
          </div>
          <div className="field-meta">{field.key}</div>
        </div>
        <span className="field-type">{field.type}</span>
      </div>
      <div className="field-row-mapping">
        {mapping ? (
          <>
            <span className="mapping-label">{mapping.label}</span>
            <button
              className="clear-icon-button"
              type="button"
              aria-label={`Clear mapping for ${field.label}`}
              title="Clear mapping"
              onClick={(event) => {
                event.stopPropagation();
                onClear(field.key);
              }}
            >
              ×
            </button>
          </>
        ) : (
          <span className="empty-mapping">Click to configure prefill</span>
        )}
      </div>
    </div>
  );
};
