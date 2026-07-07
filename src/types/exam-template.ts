export type ExamTemplateFieldType = 'number' | 'text' | 'textarea' | 'select' | 'date' | 'checkbox' | 'radio';

export interface ExamTemplate {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  schema_version: number;
  sections: ExamTemplateSection[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExamTemplateField {
  _id?: string;
  key: string;
  label: string;
  type: ExamTemplateFieldType;
  options: string[];
  unit?: string;
  reference_value?: string;
}

export interface ExamTemplateSection {
  _id?: string;
  title: string;
  fields: ExamTemplateField[];
}

export interface ExamTemplateSnapshot {
  name?: string;
  description?: string;
  sections: ExamTemplateSection[];
}
