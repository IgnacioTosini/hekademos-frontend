import { useMemo, useState } from "react";
import type { Exercise, ShortItem } from "../types";
import { ExerciseContext } from "./exerciseContext";
import { ExerciseService } from "../services/ExerciseService";

export type ExerciseContextProps = {
    exercises: Exercise[];
    shorts: ShortItem[];
    isLoading: boolean;
    filteredItems: ShortItem[];
    searchTerm: string;
    syncStatus: string;
    setSearchTerm: (term: string) => void;
    setShorts: (shorts: ShortItem[]) => void;
    fetchYouTubeShorts: (channelId: string) => Promise<{ title: string, url: string }[]>;
    fetchYouTubeShortsbyHandle: (handle: string) => Promise<{ title: string, url: string }[]>;
    syncYouTubeShortsToDatabase: (handle: string) => Promise<void>;
    fetchExercises: () => Promise<void>;
    fetchExerciseById: (id: string) => Promise<Exercise | null>;
    fetchExerciseByName: (name: string) => Promise<Exercise[]>;
    fetchExerciseByYoutubeUrl: (youtubeUrl: string) => Promise<Exercise[]>;
    createExercise: (exercise: Omit<Exercise, 'id'>) => Promise<void>;
    updateExercise: (id: string, exercise: Partial<Omit<Exercise, 'id'>>) => Promise<void>;
    deleteExercise: (id: string) => Promise<void>;
};

export const ExerciseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [shorts, setShorts] = useState<ShortItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [syncStatus, setSyncStatus] = useState<string>('');

    const filteredItems = useMemo(() => {
        const allItems: ShortItem[] = [
            // Convertir exercises a ShortItem
            ...exercises.map(exercise => ({
                title: exercise.name,
                url: exercise.videoUrl
            })),
            // Agregar shorts
            ...shorts
        ];

        // Filtrar por término de búsqueda
        if (searchTerm) {
            return allItems.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return allItems;
    }, [exercises, shorts, searchTerm]);

    // Función: obtener shorts desde la BD
    const fetchShortsFromDatabase = async (): Promise<ShortItem[]> => {
        try {
            const response = await ExerciseService.fetchShorts();
            if (response.success) {
                const shortsFromDB = response.data.map(exercise => ({
                    title: exercise.name,
                    url: exercise.videoUrl
                }));

                console.log(`📋 ${shortsFromDB.length} shorts obtenidos desde la BD`);
                return shortsFromDB;
            }
            return [];
        } catch (error) {
            console.error('Error obteniendo shorts desde BD:', error);
            return [];
        }
    };

    // ✅ FUNCIÓN PRINCIPAL: sincronizar con YouTube (usando SOLO backend)
    const syncYouTubeShortsToDatabase = async (): Promise<void> => {
        setIsLoading(true);
        setSyncStatus('🔄 Verificando datos existentes...');

        try {
            // 1. Obtener datos existentes de la BD
            const existingShorts = await fetchShortsFromDatabase();
            setShorts(existingShorts);

            // 2. Verificar si necesita sincronización (desde backend)
            setSyncStatus('🔄 Verificando si necesita sincronización...');
            const syncStatusResponse = await ExerciseService.checkSyncStatus();

            if (!syncStatusResponse.success || !syncStatusResponse.data) {
                if (existingShorts.length > 0) {
                    setSyncStatus('✅ Datos actualizados (no requiere sincronización)');
                    console.log('📋 Usando datos existentes de la BD');
                    return;
                }
            }

            // 3. Sincronizar con YouTube (llamada al backend)
            setSyncStatus('🔄 Sincronizando con YouTube...');
            const syncResult = await ExerciseService.triggerManualSync();

            if (syncResult.success) {
                setSyncStatus(`✅ Sincronización completada: ${syncResult.data}`);

                // 4. Actualizar datos locales después de la sincronización
                const updatedShorts = await fetchShortsFromDatabase();
                setShorts(updatedShorts);

                // 5. Actualizar exercises completos
                await fetchExercises();
            } else {
                setSyncStatus(`⚠️ ${syncResult.message} - Usando datos existentes`);
            }

        } catch (error) {
            console.error('Error en sincronización:', error);
            setSyncStatus('❌ Error - Usando datos existentes de la BD');
        } finally {
            setIsLoading(false);
        }
    };

    // Función legacy para compatibilidad (ahora usa backend)
    const fetchYouTubeShorts = async () => {
        // Redirigir a la sincronización completa
        await syncYouTubeShortsToDatabase();
        return shorts.map(short => ({ title: short.title, url: short.url }));
    };

    // Función actualizada para usar la BD
    const fetchYouTubeShortsbyHandle = async () => {
        await syncYouTubeShortsToDatabase();
        return shorts.map(short => ({ title: short.title, url: short.url }));
    };

    const fetchExercises = async () => {
        setIsLoading(true);
        try {
            const response = await ExerciseService.fetchExercises();
            if (response.success) {
                setExercises(response.data);
                console.log(`📚 ${response.data.length} ejercicios cargados`);
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExerciseById = async (id: string): Promise<Exercise | null> => {
        setIsLoading(true);
        try {
            const response = await ExerciseService.fetchExerciseById(id);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching exercise by ID:', error);
        } finally {
            setIsLoading(false);
        }
        return null;
    }

    const fetchExerciseByName = async (name: string): Promise<Exercise[]> => {
        setIsLoading(true);
        try {
            const response = await ExerciseService.fetchExerciseByName(name);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching exercise by name:', error);
        } finally {
            setIsLoading(false);
        }
        return [];
    }

    const fetchExerciseByYoutubeUrl = async (youtubeUrl: string): Promise<Exercise[]> => {
        setIsLoading(true);
        try {
            const response = await ExerciseService.fetchExerciseByYoutubeUrl(youtubeUrl);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching exercise by YouTube URL:', error);
        } finally {
            setIsLoading(false);
        }
        return [];
    }

    const createExercise = async (exercise: Omit<Exercise, 'id'>) => {
        setIsLoading(true);
        try {
            const response = await ExerciseService.createExercise(exercise);
            if (response.success) {
                setExercises(prevExercises => [...prevExercises, response.data]);
            }
        } catch (error) {
            console.error('Error creating exercise:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateExercise = async (id: string, exercise: Partial<Omit<Exercise, 'id'>>) => {
        setIsLoading(true);
        try {
            const response = await ExerciseService.updateExercise(id, exercise);
            if (response.success) {
                setExercises(prevExercises => prevExercises.map(ex => ex.id === id ? { ...ex, ...exercise } : ex));
            }
        } catch (error) {
            console.error('Error updating exercise:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteExercise = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await ExerciseService.deleteExercise(id);
            if (response.success) {
                setExercises(prevExercises => prevExercises.filter(ex => ex.id !== id));
            }
        } catch (error) {
            console.error('Error deleting exercise:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ExerciseContext.Provider value={{
            exercises,
            shorts,
            filteredItems,
            searchTerm,
            isLoading,
            syncStatus,
            setSearchTerm,
            setShorts,
            fetchYouTubeShorts,
            fetchYouTubeShortsbyHandle,
            syncYouTubeShortsToDatabase,
            fetchExercises,
            createExercise,
            updateExercise,
            deleteExercise,
            fetchExerciseById,
            fetchExerciseByName,
            fetchExerciseByYoutubeUrl
        }}>
            {children}
        </ExerciseContext.Provider>
    );
};