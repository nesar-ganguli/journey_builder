export type FormField = {
  key: string;
  label: string;
  type: string;
  required: boolean;
};

export type FormFieldPrefillMapping = {
  type: 'form_field';
  sourceNodeId: string;
  sourceFormName: string;
  sourceFieldKey: string;
  label: string;
};

export type GlobalPrefillMapping = {
  type: 'global';
  sourceId: 'global';
  sourceFieldKey: string;
  label: string;
};

export type PrefillMapping = FormFieldPrefillMapping | GlobalPrefillMapping;

export type PrefillMappingsByForm = Record<string, Record<string, PrefillMapping>>;
