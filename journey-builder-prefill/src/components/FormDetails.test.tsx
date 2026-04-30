import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { defaultPrefillDataSources } from '../dataSources';
import { createTestGraph } from '../test/testUtils';
import type { PrefillMappingsByForm } from '../types/prefill';
import { FormDetails } from './FormDetails';

describe('FormDetails', () => {
  it('lets a user select an upstream field mapping for an unmapped field', async () => {
    const user = userEvent.setup();
    const graph = createTestGraph();
    const selectedNode = graph.nodes?.find((node) => node.id === 'form-c') ?? null;
    const onSetMapping = vi.fn();

    render(
      <FormDetails
        graph={graph}
        selectedNode={selectedNode}
        dataSources={defaultPrefillDataSources}
        mappingsByForm={{}}
        isDirty={false}
        saveStatus="idle"
        onSetMapping={onSetMapping}
        onClearMapping={vi.fn()}
        onSaveMappings={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /email/i }));
    expect(screen.getByRole('dialog', { name: /select data element to map/i })).toBeInTheDocument();

    const formBGroup = screen.getByRole('heading', { name: 'Form B' }).closest('.option-group');
    if (!formBGroup) {
      throw new Error('Expected Form B option group');
    }

    await user.click(within(formBGroup as HTMLElement).getByRole('button', { name: /email/i }));
    await user.click(screen.getByRole('button', { name: 'Select' }));

    expect(onSetMapping).toHaveBeenCalledWith('form-c', 'email', {
      type: 'form_field',
      sourceNodeId: 'form-b',
      sourceFormName: 'Form B',
      sourceFieldKey: 'email',
      label: 'Form B.email',
    });
  });

  it('clears an existing mapping for a field', async () => {
    const user = userEvent.setup();
    const graph = createTestGraph();
    const selectedNode = graph.nodes?.find((node) => node.id === 'form-c') ?? null;
    const mappingsByForm: PrefillMappingsByForm = {
      'form-c': {
        email: {
          type: 'form_field',
          sourceNodeId: 'form-a',
          sourceFormName: 'Form A',
          sourceFieldKey: 'email',
          label: 'Form A.email',
        },
      },
    };
    const onClearMapping = vi.fn();

    render(
      <FormDetails
        graph={graph}
        selectedNode={selectedNode}
        dataSources={defaultPrefillDataSources}
        mappingsByForm={mappingsByForm}
        isDirty
        saveStatus="unsaved"
        onSetMapping={vi.fn()}
        onClearMapping={onClearMapping}
        onSaveMappings={vi.fn()}
      />,
    );

    expect(screen.getByText('Form A.email')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear mapping for email/i }));

    expect(onClearMapping).toHaveBeenCalledWith('form-c', 'email');
  });
});
