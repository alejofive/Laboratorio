export type ExamTemplateFieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox';

export interface ExamTemplateField {
  key: string;
  label: string;
  type: string;
  options: string[];
  unit?: string;
  required: boolean;
  _id?: string;
}

export interface ExamTemplateSection {
  title: string;
  fields: ExamTemplateField[];
  _id?: string;
}

export interface ExamTemplateSnapshot {
  name?: string;
  description?: string;
  sections: ExamTemplateSection[];
}
