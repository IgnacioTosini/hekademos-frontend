import axios from "axios"
import type { ApiResponse, Exercise } from "../types"

const API_BASE_URL = import.meta.env.PROD
    ? import.meta.env.API_BASE_URL_PROD
    : import.meta.env.API_BASE_URL_LOCAL

export class ExerciseService {
    static async fetchExercises(): Promise<ApiResponse<Exercise[]>> {
        try {
            const response = await axios.get<ApiResponse<Exercise[]>>(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching exercises:', error);
            return {
                success: false,
                message: 'Error al obtener ejercicios',
                data: []
            };
        }
    }

    static async fetchExerciseById(id: string): Promise<ApiResponse<Exercise>> {
        try {
            const response = await axios.get<ApiResponse<Exercise>>(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching exercise by id:', error);
            return {
                success: false,
                message: 'Error al obtener ejercicio',
                data: {} as Exercise
            };
        }
    }

    static async fetchExerciseByName(name: string): Promise<ApiResponse<Exercise[]>> {
        try {
            const response = await axios.get<ApiResponse<Exercise[]>>(`${API_BASE_URL}/by-name/${encodeURIComponent(name)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching exercise by name:', error);
            return {
                success: false,
                message: 'Error al buscar ejercicio por nombre',
                data: []
            };
        }
    }

    static async fetchExerciseByYoutubeUrl(youtubeUrl: string): Promise<ApiResponse<Exercise[]>> {
        try {
            const response = await axios.get<ApiResponse<Exercise[]>>(`${API_BASE_URL}/by-youtube-url`, {
                params: { youtubeUrl }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching exercise by youtube url:', error);
            return {
                success: false,
                message: 'Error al buscar ejercicio por URL de YouTube',
                data: []
            };
        }
    }

    static async fetchShorts(): Promise<ApiResponse<Exercise[]>> {
        try {
            console.log('🔍 Fetching shorts from database...');
            const response = await axios.get<ApiResponse<Exercise[]>>(`${API_BASE_URL}/shorts`);
            console.log(`📊 Response:`, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching shorts:', error);
            return {
                success: false,
                message: 'Error al obtener shorts',
                data: []
            };
        }
    }

    static async checkSyncStatus(): Promise<ApiResponse<boolean>> {
        try {
            const response = await axios.get<ApiResponse<boolean>>(`${API_BASE_URL}/sync-status`);
            return response.data;
        } catch (error) {
            console.error('Error checking sync status:', error);
            return {
                success: false,
                message: 'Error al verificar estado de sincronización',
                data: true // Por defecto asumir que necesita sync
            };
        }
    }

    static async createExercise(exercise: Omit<Exercise, 'id'>): Promise<ApiResponse<Exercise>> {
        try {
            const response = await axios.post<ApiResponse<Exercise>>(API_BASE_URL, exercise);
            return response.data;
        } catch (error) {
            console.error('Error creating exercise:', error);
            return {
                success: false,
                message: 'Error al crear ejercicio',
                data: {} as Exercise
            };
        }
    }

    static async updateExercise(id: string, exercise: Partial<Omit<Exercise, 'id'>>): Promise<ApiResponse<Exercise>> {
        try {
            const response = await axios.put<ApiResponse<Exercise>>(`${API_BASE_URL}/${id}`, exercise);
            return response.data;
        } catch (error) {
            console.error('Error updating exercise:', error);
            return {
                success: false,
                message: 'Error al actualizar ejercicio',
                data: {} as Exercise
            };
        }
    }

    static async deleteExercise(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting exercise:', error);
            return {
                success: false,
                message: 'Error al eliminar ejercicio',
                data: null
            };
        }
    }

    static async triggerManualSync(): Promise<ApiResponse<string>> {
        try {
            console.log('🔄 Iniciando sincronización desde backend...');
            const response = await axios.post<ApiResponse<string>>(`${API_BASE_URL}/sync`);

            if (response.data.success) {
                console.log('✅ Sincronización exitosa desde backend');
            }

            return response.data;
        } catch (error) {
            console.error('❌ Error triggering manual sync:', error);
            return {
                success: false,
                message: 'Error al iniciar sincronización manual',
                data: ''
            };
        }
    }
}