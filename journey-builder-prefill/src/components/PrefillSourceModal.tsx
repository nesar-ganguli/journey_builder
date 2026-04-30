import { useEffect, useMemo, useState } from 'react';
import type { GroupedPrefillOptions, PrefillOption } from '../dataSources/types';
import { groupPrefillOptions } from '../dataSources';

type PrefillSourceModalProps = {
  isOpen: boolean;
  options: PrefillOption[];
  targetFieldLabel: string;
  onCancel: () => void;
  onSelect: (option: PrefillOption) => void;
};

const optionMatchesSearch = (option: PrefillOption, normalizedSearch: string) => {
  const haystack = `${option.sourceLabel} ${option.label}`.toLowerCase();
  return haystack.includes(normalizedSearch);
};

export const PrefillSourceModal = ({
  isOpen,
  options,
  targetFieldLabel,
  onCancel,
  onSelect,
}: PrefillSourceModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedOptionId(null);
    }
  }, [isOpen]);

  const filteredGroups = useMemo<GroupedPrefillOptions[]>(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredOptions = normalizedSearch
      ? options.filter((option) => optionMatchesSearch(option, normalizedSearch))
      : options;

    return groupPrefillOptions(filteredOptions);
  }, [options, searchTerm]);

  const selectedOption = options.find((option) => option.id === selectedOptionId);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="prefill-modal-title">
        <div className="modal-header">
          <div>
            <p className="modal-kicker">Mapping {targetFieldLabel}</p>
            <h2 id="prefill-modal-title">Select data element to map</h2>
          </div>
        </div>

        <label className="search-label" htmlFor="prefill-search">
          Search
        </label>
        <input
          id="prefill-search"
          className="search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filter by source or field"
          autoFocus
        />

        <div className="modal-options">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div className="option-group" key={`${group.sourceType}:${group.sourceLabel}`}>
                <h3>{group.sourceLabel}</h3>
                <div className="option-list">
                  {group.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`option-row ${option.id === selectedOptionId ? 'option-row--selected' : ''}`}
                      onClick={() => setSelectedOptionId(option.id)}
                    >
                      <span>{option.label}</span>
                      <span>{option.sourceType === 'global' ? 'Global' : 'Form field'}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="modal-empty">No matching data elements.</div>
          )}
        </div>

        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={!selectedOption}
            onClick={() => {
              if (selectedOption) {
                onSelect(selectedOption);
              }
            }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};
