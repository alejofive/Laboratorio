import { CreateOrder, CreatePatient, CreatePatientResponse, GetExams, GetPatientsResponse, PatientDetailResponse } from '@/types/create';
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
