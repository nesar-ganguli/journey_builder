import { useCallback, useEffect, useState } from 'react';
import { fetchActionBlueprintGraph } from '../api/graphApi';
import type { ActionBlueprintGraph } from '../types/graph';

export type AddFormNodeInput = {
  name: string;
  formDefinitionId: string;
  linkedFormNodeId: string | null;
};

type GraphLoadState = {
  graph: ActionBlueprintGraph | null;
  isLoading: boolean;
  error: string | null;
};

type UseGraphState = GraphLoadState & {
  addFormNode: (input: AddFormNodeInput) => string | null;
};

export const useGraph = (): UseGraphState => {
  const [state, setState] = useState<GraphLoadState>({
    graph: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    fetchActionBlueprintGraph()
      .then((graph) => {
        if (isMounted) {
          setState({ graph, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({
            graph: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unable to load graph',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addFormNode = useCallback((input: AddFormNodeInput) => {
    const newNodeId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `form-${crypto.randomUUID()}`
        : `form-local-${Date.now()}`;

    setState((currentState) => {
      if (!currentState.graph) {
        return currentState;
      }

      const existingNodeCount = currentState.graph.nodes?.length ?? 0;
      const newNode = {
        id: newNodeId,
        type: 'form',
        position: {
          x: 320 + existingNodeCount * 60,
          y: 220 + existingNodeCount * 40,
        },
        data: {
          id: `local-${newNodeId}`,
          component_key: newNodeId,
          component_type: 'form',
          component_id: input.formDefinitionId,
          name: input.name,
          prerequisites: input.linkedFormNodeId ? [input.linkedFormNodeId] : [],
          permitted_roles: [],
          input_mapping: {},
          approval_required: false,
          approval_roles: [],
        },
      };

      const newEdge = input.linkedFormNodeId
        ? [
            {
              source: input.linkedFormNodeId,
              target: newNodeId,
            },
          ]
        : [];

      return {
        ...currentState,
        graph: {
          ...currentState.graph,
          nodes: [...(currentState.graph.nodes ?? []), newNode],
          edges: [...(currentState.graph.edges ?? []), ...newEdge],
        },
      };
    });

    return newNodeId;
  }, []);

  return {
    ...state,
    addFormNode,
  };
};
