import { useEffect, useMemo, useState } from 'react';
import { AddFormModal } from './components/AddFormModal';
import { AppLayout } from './components/AppLayout';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { FormDetails } from './components/FormDetails';
import { FormList } from './components/FormList';
import { GraphOverview } from './components/GraphOverview';
import { LoadingState } from './components/LoadingState';
import { defaultPrefillDataSources } from './dataSources';
import { useGraph } from './hooks/useGraph';
import { usePrefillMappings } from './hooks/usePrefillMappings';
import { getFormNodes } from './utils/graphTraversal';

const App = () => {
  const { graph, isLoading, error, addFormNode } = useGraph();
  const { mappingsByForm, setMapping, clearMapping, saveFormMappings, isFormDirty, getSaveStatus } =
    usePrefillMappings(graph);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAddFormModalOpen, setIsAddFormModalOpen] = useState(false);
  const [isGraphView, setIsGraphView] = useState(false);

  const formNodes = useMemo(() => getFormNodes(graph), [graph]);
  const selectedNode = formNodes.find((node) => node.id === selectedNodeId) ?? formNodes[0] ?? null;

  useEffect(() => {
    if (!selectedNodeId && formNodes.length > 0) {
      setSelectedNodeId(formNodes[0].id);
    }
  }, [formNodes, selectedNodeId]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!graph) {
    return <ErrorState message="The server returned an empty graph response." />;
  }

  return (
    <AppLayout
      sidebar={
        <FormList
          graph={graph}
          formNodes={formNodes}
          selectedNodeId={selectedNode?.id ?? null}
          isGraphView={isGraphView}
          onSelect={(nodeId) => {
            setSelectedNodeId(nodeId);
            setIsGraphView(false);
          }}
          onAddFormClick={() => setIsAddFormModalOpen(true)}
          onGraphViewClick={() => setIsGraphView((currentValue) => !currentValue)}
        />
      }
    >
      {isGraphView ? (
        <GraphOverview graph={graph} formNodes={formNodes} />
      ) : formNodes.length > 0 ? (
        <FormDetails
          graph={graph}
          selectedNode={selectedNode}
          dataSources={defaultPrefillDataSources}
          mappingsByForm={mappingsByForm}
          isDirty={selectedNode ? isFormDirty(selectedNode.id) : false}
          saveStatus={selectedNode ? getSaveStatus(selectedNode.id) : 'idle'}
          onSetMapping={setMapping}
          onClearMapping={clearMapping}
          onSaveMappings={saveFormMappings}
        />
      ) : (
        <EmptyState title="No forms found" message="The action blueprint graph does not contain any form nodes." />
      )}
      <AddFormModal
        isOpen={isAddFormModalOpen}
        formNodes={formNodes}
        formDefinitions={graph.forms ?? []}
        onCancel={() => setIsAddFormModalOpen(false)}
        onAdd={(input) => {
          const newNodeId = addFormNode(input);

          if (newNodeId) {
            setSelectedNodeId(newNodeId);
            setIsGraphView(false);
          }

          setIsAddFormModalOpen(false);
        }}
      />
    </AppLayout>
  );
};

export default App;
