# Journey Builder Prefill

## Project Overview

React TypeScript implementation for the Avantos Journey Builder prefill assessment. The app fetches the action blueprint DAG from the mock server, shows the form nodes in a list, and lets a user view, add, save, and clear prefill mappings for fields on a selected form.

Kept the main UI as a simple list/detail editor instead of building a full node-based graph. The challenge said the graph visualization was not required, so the focus is on data flow, reusable components, DAG traversal, and making it easy to add new prefill data sources later.

The main flow is:

1. Fetch the action blueprint graph.
2. Render form nodes in a list.
3. Select a form to view fields from its schema.
4. Add or clear prefill mappings for those fields.
5. Choose prefill values from upstream form fields or global data.

## Run the Mock Server

From the cloned mock server directory:

```bash
cd ../frontendchallengeserver
npm install
npm start
```

In this workspace, the cloned server is running on `http://localhost:3003` and serves:

```text
GET /api/v1/123/actions/blueprints/bp_456/bpv_123/graph
```

## Run the React App

From this app directory:

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Environment

The API base URL comes from:

```bash
VITE_API_BASE_URL=http://localhost:3003
```

Included `.env.example` with the default value. The full graph endpoint is built in `src/api/graphApi.ts`.

## Package Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm test
```

## Build

```bash
npm run build
```

## Run Tests

```bash
npm test
```

The tests use Vitest, jsdom, and React Testing Library. Added coverage for the main logic pieces: DAG traversal, schema parsing, prefill data source option generation, and the field mapping modal flow.

## Main Architectural Decisions

- Kept the UI simple with a form list on the left and the selected form editor on the right.
- Kept the API call isolated in `src/api` so the rest of the app does not depend on fetch details.
- Put graph traversal and schema parsing into utility files because those are core business logic and easy to test separately.
- Used a `PrefillDataSource` interface so the modal can render options without caring whether they came from upstream forms, global data, or a future source.
- Kept mapping edits in React state and saves them to `localStorage`, since the mock server only gives a read endpoint.
- Split the UI into small components so the form list, field rows, modal, and empty/error/loading states stay easy to reason about.

## Architecture

- `src/api/graphApi.ts`: API client for loading the graph.
- `src/hooks/useGraph.ts`: loads the graph and also handles local form creation.
- `src/hooks/usePrefillMappings.ts`: manages prefill mapping state, save state, and dirty state.
- `src/utils/graphTraversal.ts`: form filtering and upstream traversal logic.
- `src/utils/formSchema.ts`: looks up form definitions and turns schema properties into field rows.
- `src/utils/mappingFormatters.ts`: converts selected modal options into the local mapping shape.
- `src/dataSources`: shared data source interface plus upstream form fields and global data.
- `src/components`: layout, form list, form details, field rows, modal, graph overview, and simple state components.

## DAG Traversal

`getUpstreamFormNodes(graph, selectedNodeId)` walks upstream from the selected form. It reads from both `graph.edges` and `node.data.prerequisites` because the mock graph includes both. The traversal tracks visited node IDs so it does not duplicate nodes or get stuck if bad data creates a cycle.

For example, if Form D depends on Form B and Form B depends on Form A, Form D can use fields from both Form B and Form A.

## Adding a Prefill Data Source

To add another source, create a new object that follows the `PrefillDataSource` interface:

```ts
export type PrefillDataSource = {
  id: string;
  label: string;
  getOptions: (context: PrefillContext) => PrefillOption[];
};
```

Then add it to `defaultPrefillDataSources` in `src/dataSources/index.ts`. The modal only receives `PrefillOption` values, so it does not need to change when a new source is added.

Example:

```ts
export const customDataSource: PrefillDataSource = {
  id: 'custom',
  label: 'Custom Data',
  getOptions: () => [
    {
      id: 'custom:account_id',
      label: 'account_id',
      sourceType: 'custom',
      sourceLabel: 'Custom Data',
      value: {
        type: 'custom',
        sourceId: 'custom',
        fieldKey: 'account_id',
      },
    },
  ],
};
```

## Assumptions

- Treats nodes with `node.type === "form"` as forms.
- Uses `node.data.component_id` to find the matching form definition in `graph.forms`.
- Treats `field_schema.properties` as the source of fields that can be mapped.
- Saves prefill mappings to browser `localStorage`, not to the mock server.
- Defaults the app to port `3003` because that is where this cloned mock server is running.
- Locally added forms reuse one of the form schemas returned by the API.

## Known Limitations

- The provided mock graph has empty `input_mapping` objects, so existing mapping normalization is best effort.
- The UI does not check whether the source field type matches the target field type.
- The global data source is hardcoded for this challenge.
- There is no undo history.
- There is no server-side save flow because the mock server only exposes the graph `GET` endpoint.
- Locally added forms only live in browser state.
