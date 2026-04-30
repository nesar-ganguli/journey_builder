import type { ActionBlueprintGraph } from '../types/graph';

const DEFAULT_API_BASE_URL = 'http://localhost:3003';
const GRAPH_ENDPOINT = '/api/v1/123/actions/blueprints/bp_456/bpv_123/graph';

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
};

export const fetchActionBlueprintGraph = async (): Promise<ActionBlueprintGraph> => {
  const response = await fetch(`${getApiBaseUrl()}${GRAPH_ENDPOINT}`);

  if (!response.ok) {
    throw new Error(`Unable to load graph: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ActionBlueprintGraph>;
};

