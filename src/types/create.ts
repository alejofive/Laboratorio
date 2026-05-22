export interface CreatePatient {
    first_name: string;
    last_name: string;
    document_number: string;
    birth_date: string;
    sex?: string;
    phone: string;
    address: string;
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
    address?: string;
    created_at?: string;
    updated_at?: string;
    __v?: number;
}
