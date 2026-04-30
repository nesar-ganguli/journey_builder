import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActionBlueprintGraph } from '../types/graph';
import type { PrefillMapping, PrefillMappingsByForm } from '../types/prefill';
import { initializePrefillMappings } from '../utils/mappingFormatters';

type UsePrefillMappingsResult = {
  mappingsByForm: PrefillMappingsByForm;
  setMapping: (formNodeId: string, fieldKey: string, mapping: PrefillMapping) => void;
  clearMapping: (formNodeId: string, fieldKey: string) => void;
  saveFormMappings: (formNodeId: string) => void;
  isFormDirty: (formNodeId: string) => boolean;
  getSaveStatus: (formNodeId: string) => 'saved' | 'unsaved' | 'idle';
};

const STORAGE_KEY_PREFIX = 'journey-builder-prefill:mappings';

const getStorageKey = (graphId: string) => `${STORAGE_KEY_PREFIX}:${graphId}`;

const serializeMappings = (mappings: Record<string, PrefillMapping> | undefined) => {
  return JSON.stringify(mappings ?? {});
};

const readSavedMappings = (graphId: string): PrefillMappingsByForm => {
  try {
    const rawMappings = window.localStorage.getItem(getStorageKey(graphId));
    return rawMappings ? (JSON.parse(rawMappings) as PrefillMappingsByForm) : {};
  } catch {
    return {};
  }
};

const writeSavedMappings = (graphId: string, mappingsByForm: PrefillMappingsByForm) => {
  window.localStorage.setItem(getStorageKey(graphId), JSON.stringify(mappingsByForm));
};

export const usePrefillMappings = (graph: ActionBlueprintGraph | null): UsePrefillMappingsResult => {
  const [mappingsByForm, setMappingsByForm] = useState<PrefillMappingsByForm>({});
  const [savedMappingsByForm, setSavedMappingsByForm] = useState<PrefillMappingsByForm>({});
  const [lastSavedFormNodeId, setLastSavedFormNodeId] = useState<string | null>(null);
  const initializedGraphId = useRef<string | null>(null);

  useEffect(() => {
    if (graph) {
      const initializedMappings = initializePrefillMappings(graph);

      if (initializedGraphId.current !== graph.id) {
        const savedMappings = readSavedMappings(graph.id);
        const mergedMappings = {
          ...initializedMappings,
          ...savedMappings,
        };

        initializedGraphId.current = graph.id;
        setMappingsByForm(mergedMappings);
        setSavedMappingsByForm(mergedMappings);
        setLastSavedFormNodeId(null);
        return;
      }

      setMappingsByForm((currentMappings) => ({
        ...initializedMappings,
        ...currentMappings,
      }));
      setSavedMappingsByForm((currentSavedMappings) => ({
        ...initializedMappings,
        ...currentSavedMappings,
      }));
    }
  }, [graph]);

  const setMapping = useCallback((formNodeId: string, fieldKey: string, mapping: PrefillMapping) => {
    setMappingsByForm((currentMappings) => ({
      ...currentMappings,
      [formNodeId]: {
        ...(currentMappings[formNodeId] ?? {}),
        [fieldKey]: mapping,
      },
    }));
  }, []);

  const clearMapping = useCallback((formNodeId: string, fieldKey: string) => {
    setMappingsByForm((currentMappings) => {
      const currentFormMappings = currentMappings[formNodeId] ?? {};
      const { [fieldKey]: _removedMapping, ...remainingFormMappings } = currentFormMappings;

      return {
        ...currentMappings,
        [formNodeId]: remainingFormMappings,
      };
    });
  }, []);

  const saveFormMappings = useCallback(
    (formNodeId: string) => {
      if (!graph) {
        return;
      }

      const nextSavedMappings = {
        ...savedMappingsByForm,
        [formNodeId]: mappingsByForm[formNodeId] ?? {},
      };

      writeSavedMappings(graph.id, nextSavedMappings);
      setSavedMappingsByForm(nextSavedMappings);
      setLastSavedFormNodeId(formNodeId);
    },
    [graph, mappingsByForm, savedMappingsByForm],
  );

  const isFormDirty = useCallback(
    (formNodeId: string) => {
      return serializeMappings(mappingsByForm[formNodeId]) !== serializeMappings(savedMappingsByForm[formNodeId]);
    },
    [mappingsByForm, savedMappingsByForm],
  );

  const getSaveStatus = useCallback(
    (formNodeId: string) => {
      if (isFormDirty(formNodeId)) {
        return 'unsaved';
      }

      return lastSavedFormNodeId === formNodeId ? 'saved' : 'idle';
    },
    [isFormDirty, lastSavedFormNodeId],
  );

  return { mappingsByForm, setMapping, clearMapping, saveFormMappings, isFormDirty, getSaveStatus };
};
