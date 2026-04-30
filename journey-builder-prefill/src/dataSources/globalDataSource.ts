import type { PrefillDataSource, PrefillOption } from './types';

const globalFields = ['current_user_email', 'current_user_name', 'organization_name', 'action_created_at'];

export const globalDataSource: PrefillDataSource = {
  id: 'global-data',
  label: 'Global Data',
  getOptions: () =>
    globalFields.map<PrefillOption>((fieldKey) => ({
      id: `global:${fieldKey}`,
      label: fieldKey,
      sourceType: 'global',
      sourceLabel: 'Global Data',
      value: {
        type: 'global',
        sourceId: 'global',
        fieldKey,
      },
    })),
};
