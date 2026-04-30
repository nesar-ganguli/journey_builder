import type { ActionBlueprintGraph } from '../types/graph';

export const createTestGraph = (): ActionBlueprintGraph => ({
  id: 'test-graph',
  name: 'Test Graph',
  nodes: [
    {
      id: 'form-a',
      type: 'form',
      data: {
        component_id: 'schema-a',
        name: 'Form A',
        prerequisites: [],
        input_mapping: {},
      },
    },
    {
      id: 'form-b',
      type: 'form',
      data: {
        component_id: 'schema-b',
        name: 'Form B',
        prerequisites: ['form-a'],
        input_mapping: {},
      },
    },
    {
      id: 'form-c',
      type: 'form',
      data: {
        component_id: 'schema-c',
        name: 'Form C',
        prerequisites: ['form-b'],
        input_mapping: {},
      },
    },
  ],
  edges: [
    { source: 'form-a', target: 'form-b' },
    { source: 'form-b', target: 'form-c' },
  ],
  forms: [
    {
      id: 'schema-a',
      name: 'Schema A',
      field_schema: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            title: 'Email',
            type: 'string',
            format: 'email',
            avantos_type: 'short-text',
          },
          name: {
            title: 'Name',
            type: 'string',
            avantos_type: 'short-text',
          },
        },
      },
    },
    {
      id: 'schema-b',
      name: 'Schema B',
      field_schema: {
        type: 'object',
        properties: {
          email: {
            title: 'Email',
            type: 'string',
            format: 'email',
            avantos_type: 'short-text',
          },
          notes: {
            title: 'Notes',
            type: 'string',
            avantos_type: 'multi-line-text',
          },
        },
      },
    },
    {
      id: 'schema-c',
      name: 'Schema C',
      field_schema: {
        type: 'object',
        properties: {
          email: {
            title: 'Email',
            type: 'string',
            format: 'email',
            avantos_type: 'short-text',
          },
        },
      },
    },
  ],
});
