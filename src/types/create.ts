export interface CreatePatient {
    first_name: string;
    last_name: string;
    document_number: string;
    birth_date: string;
    sex?: string;
    phone: string;
    address: string;
    email?: string;
}


export interface GetExams {
    categories: {
        name: string;
        exams: {
            id: string;
            name: string;
        }[];
    }[];
}

export interface CreateOrder {
    patient_id: string;
    exam_template_ids: string[];
    notes?: string;
}

export interface PatientApi {
    _id: string;
    first_name: string;
    last_name: string;
    document_number: string;
    phone: string;
    email?: string;
    age?: number;
    address?: string;
}

export interface GetPatientsResponse {
    data: PatientApi[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface CreatePatientResponse {
    _id: string;
}

export interface PatientDetailResponse {
    _id: string;
    first_name: string;
    last_name: string;
    document_number: string;
    birth_date?: string;
    phone: string;
    email?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    __v?: number;
}

export type OrderStatusApi = 'pending' | 'in_progress' | 'completed' | 'sent';

export interface OrderItem {
    id: string;
    order_number: number;
    status: OrderStatusApi;
    created_at: string;
    patient: {
        id: string;
        document_number: string;
        name: string;
    };
    exams: {
        total: number;
        completed: number;
    };
}

export interface GetOrdersResponse {
    data: OrderItem[];
}

export interface OrderExamDetail {
    _id: string;
    order_id: string;
    exam_template_id: string;
    result_status: string;
    doctor_name?: string;
    exam_date?: string;
    exam_time?: string;
    blood_collection_time?: string;
    template_snapshot?: ExamTemplateSnapshot;
    result_payload?: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
}

export interface OrderDetailResponse {
    _id: string;
    order_number: number;
    patient_id: string;
    status: OrderStatusApi;
    requested_at?: string;
    notes?: string;
    created_at: string;
    updated_at?: string;
    exams: OrderExamDetail[];
}
import { ExamTemplateSnapshot } from './exam-template';
