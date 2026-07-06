import {
    CreateOrder,
    CreatePatient,
    CreatePatientResponse,
    GetExams,
    GetOrdersResponse,
    GetPatientsResponse,
    OrderDetailResponse,
    OrderItem,
    PatientDetailResponse,
} from '@/types/create';
import { useMutation, useQuery } from '@tanstack/react-query';


export function useExams() {
    return useQuery({
        queryKey: ['exams'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exams`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null);
                throw new Error(
                    errorBody?.message || `Error ${res.status}: ${res.statusText}`
                );
            }

            return res.json() as Promise<GetExams>;
        },
    });
}

export function createPatient(data: CreatePatient) {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(async (res) => {
        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(
                errorBody?.message || `Error ${res.status}: ${res.statusText}`
            );
        }

        return res.json() as Promise<CreatePatientResponse>;
    });
}

interface UsePatientsParams {
    page: number;
    limit: number;
    search: string;
}

interface UseOrdersParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'pending' | 'completed';
    start_date?: string;
    end_date?: string;
}

export function usePatients({ page, limit, search }: UsePatientsParams) {
    return useQuery({
        queryKey: ['patients-api', page, limit, search],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                search,
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients?${params.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null);
                throw new Error(
                    errorBody?.message || `Error ${res.status}: ${res.statusText}`
                );
            }

            return res.json() as Promise<GetPatientsResponse>;
        },
    });
}

export function usePatientById(patientId: string | null) {
    return useQuery({
        queryKey: ['patient-by-id', patientId],
        enabled: Boolean(patientId),
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/${patientId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null);
                throw new Error(
                    errorBody?.message || `Error ${res.status}: ${res.statusText}`
                );
            }

            return res.json() as Promise<PatientDetailResponse>;
        },
    });
}

export function useOrders({ page = 1, limit = 100, search = '', status, start_date, end_date }: UseOrdersParams) {
    return useQuery({
        queryKey: ['orders-api', page, limit, search, status, start_date, end_date],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                search,
            });

            if (status) params.set('status', status);
            if (start_date) params.set('start_date', start_date);
            if (end_date) params.set('end_date', end_date);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?${params.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null);
                throw new Error(errorBody?.message || `Error ${res.status}: ${res.statusText}`);
            }

            const payload = (await res.json()) as GetOrdersResponse | OrderItem[];
            return Array.isArray(payload) ? payload : payload.data;
        },
    });
}

export function useOrderById(orderId: string | null) {
    return useQuery({
        queryKey: ['order-by-id', orderId],
        enabled: Boolean(orderId),
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null);
                throw new Error(errorBody?.message || `Error ${res.status}: ${res.statusText}`);
            }

            return res.json() as Promise<OrderDetailResponse>;
        },
    });
}

export function useCreatePatient() {
    return useMutation({
        mutationFn: async (data: CreatePatient) => createPatient(data),
    });
}

export function useCreateOrder() {
    return useMutation({
        mutationFn: async (data: CreateOrder) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null);
                throw new Error(
                    errorBody?.message || `Error ${res.status}: ${res.statusText}`
                );
            }

            return res.json();
        },
    });
}

interface SaveOrderExamPayload {
    result_payload: Record<string, unknown>;
    result_status: 'pending' | 'in_progress' | 'completed' | 'sent';
    doctor_ordenante?: string;
}

interface CreateOrderExamResultPayload {
    result_payload: Record<string, unknown>;
    doctor_name?: string;
}

export async function createOrderExamResult(orderId: string, examId: string, payload: CreateOrderExamResultPayload) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/exams/${examId}/result`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || `Error ${res.status}: ${res.statusText}`);
    }

    return res.json().catch(() => null);
}

export async function getOrderExamPdf(orderId: string, examId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/exams/${examId}/pdf`);

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || `Error ${res.status}: ${res.statusText}`);
    }

    return res.blob();
}

export async function saveOrderExamResult(orderId: string, examId: string, payload: SaveOrderExamPayload) {
    const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/exams/${examId}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    const patchRes = await fetch(endpoint, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
    });

    if (patchRes.ok) {
        return patchRes.json().catch(() => null);
    }

    const putRes = await fetch(endpoint, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    });

    if (!putRes.ok) {
        const errorBody = await putRes.json().catch(() => null);
        throw new Error(errorBody?.message || `Error ${putRes.status}: ${putRes.statusText}`);
    }

    return putRes.json().catch(() => null);
}

export async function sendOrderExamEmail(orderId: string, examId: string, email: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/exams/${examId}/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || `Error ${res.status}: ${res.statusText}`);
    }

    return res.json().catch(() => null);
}
