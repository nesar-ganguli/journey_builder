# Journey Builder Prefill Challenge

React TypeScript solution for the Avantos Journey Builder prefill challenge.

The implementation lives in:

```text
journey-builder-prefill/
```

The mock server is the Avantos challenge server:

```text
frontendchallengeserver/
```

## Run the Mock Server

From the repository root:

```bash
cd frontendchallengeserver
npm install
npm start
```

The server runs on:

```text
http://localhost:3000
```

## Run the React App

Open another terminal from the repository root:

```bash
cd journey-builder-prefill
npm install
npm run dev
```

The app uses:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

The full project README for the React app is here:

```text
journey-builder-prefill/README.md
```

## Test and Build

From `journey-builder-prefill/`:

```bash
npm test
npm run build
```

## Notes

- The app fetches the graph from the mock server and renders a form list.
- Selecting a form shows its schema fields and prefill mappings.
- Prefill options include direct upstream forms, transitive upstream forms, and global data.
- Data sources are built behind a shared interface so new sources can be added without changing the modal UI.
- Saved mappings are stored in browser `localStorage` because the mock server only exposes a graph `GET` endpoint.
