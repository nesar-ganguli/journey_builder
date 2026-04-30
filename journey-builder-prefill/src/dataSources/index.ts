import type { GroupedPrefillOptions, PrefillContext, PrefillDataSource, PrefillOption } from './types';
import { globalDataSource } from './globalDataSource';
import { upstreamFormFieldsDataSource } from './upstreamFormFieldsDataSource';

export const defaultPrefillDataSources: PrefillDataSource[] = [
  upstreamFormFieldsDataSource,
  globalDataSource,
];

export const buildPrefillOptions = (
  dataSources: PrefillDataSource[],
  context: PrefillContext,
): PrefillOption[] => {
  return dataSources.flatMap((dataSource) => dataSource.getOptions(context));
};

export const groupPrefillOptions = (options: PrefillOption[]): GroupedPrefillOptions[] => {
  const groupsBySource = new Map<string, GroupedPrefillOptions>();

  options.forEach((option) => {
    const key = `${option.sourceType}:${option.sourceLabel}`;
    const group = groupsBySource.get(key);

    if (group) {
      group.options.push(option);
      return;
    }

    groupsBySource.set(key, {
      sourceLabel: option.sourceLabel,
      sourceType: option.sourceType,
      options: [option],
    });
  });

  return Array.from(groupsBySource.values());
};
