import type { ActionBlueprintGraph, GraphNode } from '../types/graph';

export type PrefillOptionValue = {
  type: string;
  sourceId: string;
  fieldKey: string;
};

export type PrefillOption = {
  id: string;
  label: string;
  sourceType: string;
  sourceLabel: string;
  value: PrefillOptionValue;
};

export type PrefillContext = {
  graph: ActionBlueprintGraph;
  selectedNode: GraphNode;
};

export type PrefillDataSource = {
  id: string;
  label: string;
  getOptions: (context: PrefillContext) => PrefillOption[];
};

export type GroupedPrefillOptions = {
  sourceLabel: string;
  sourceType: string;
  options: PrefillOption[];
};
