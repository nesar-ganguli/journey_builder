export type JsonObject = Record<string, unknown>;

export type GraphFieldDefinition = {
  type?: string;
  title?: string;
  description?: string;
  enum?: unknown[];
  format?: string;
  properties?: Record<string, GraphFieldDefinition>;
  items?: GraphFieldDefinition;
  [key: string]: unknown;
};

export type GraphFormDefinition = {
  id: string;
  name?: string;
  field_schema?: {
    type?: string;
    properties?: Record<string, GraphFieldDefinition>;
    required?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type GraphNodeData = {
  id?: string;
  component_key?: string;
  component_type?: string;
  component_id?: string;
  name?: string;
  prerequisites?: string[];
  input_mapping?: Record<string, unknown>;
  [key: string]: unknown;
};

export type GraphNode = {
  id: string;
  type: string;
  data?: GraphNodeData;
  position?: {
    x: number;
    y: number;
  };
  [key: string]: unknown;
};

export type GraphEdge = {
  source: string;
  target: string;
  [key: string]: unknown;
};

export type ActionBlueprintGraph = {
  id: string;
  name?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  forms?: GraphFormDefinition[];
  [key: string]: unknown;
};
