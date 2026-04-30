import type { ActionBlueprintGraph, GraphNode } from '../types/graph';
import { getDirectUpstreamFormNodes } from '../utils/graphTraversal';
import { EmptyState } from './EmptyState';

type GraphOverviewProps = {
  graph: ActionBlueprintGraph;
  formNodes: GraphNode[];
};

const getFormName = (node: GraphNode) => node.data?.name ?? node.id;

export const GraphOverview = ({ graph, formNodes }: GraphOverviewProps) => {
  if (formNodes.length === 0) {
    return <EmptyState title="No forms found" message="There are no form links to show." />;
  }

  return (
    <div className="details-panel">
      <div className="details-header">
        <div>
          <p className="app-kicker">Simple graph</p>
          <h2>Form links</h2>
        </div>
        <span className="field-count">{formNodes.length} forms</span>
      </div>

      <div className="graph-link-list">
        {formNodes.map((node) => {
          const upstreamForms = getDirectUpstreamFormNodes(graph, node.id);

          return (
            <div className="graph-link-row" key={node.id}>
              <div className="graph-link-form">{getFormName(node)}</div>
              <div className="graph-link-targets">
                {upstreamForms.length > 0
                  ? upstreamForms.map((upstreamNode) => (
                      <span className="graph-link-pill" key={upstreamNode.id}>
                        {getFormName(upstreamNode)} -&gt; {getFormName(node)}
                      </span>
                    ))
                  : <span className="empty-mapping">No linked form</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
