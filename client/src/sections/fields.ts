export type FieldType = 'text' | 'textarea' | 'image' | 'boolean' | 'select' | 'link' | 'list' | 'tags' | 'images';

export interface FieldDef {
  /** Supports dot paths into nested objects, e.g. "left.title". */
  key: string;
  label: string;
  type: FieldType;
  options?: string[]; // for select
  itemFields?: FieldDef[]; // for list
  hint?: string;
}

export interface SectionDef {
  type: string;
  label: string;
  description: string;
  fields: FieldDef[];
  defaultData: Record<string, any>;
}
