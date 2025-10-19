import { useMemo, useState, useEffect, useCallback } from "react";
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

    // Función mejorada para cargar shorts existentes
    const fetchShortsFromDatabase = useCallback(async (): Promise<void> => {
        try {
            setSyncStatus('📋 Cargando shorts existentes...');
            const response = await ExerciseService.fetchShorts();
            
            if (response.success && response.data.length > 0) {
                const shortsFromDB = response.data.map(exercise => ({
                    title: exercise.name,
                    url: exercise.videoUrl
                }));

                setShorts(shortsFromDB);
                setSyncStatus(`✅ ${shortsFromDB.length} shorts cargados`);
                console.log(`📋 ${shortsFromDB.length} shorts obtenidos desde la BD`);
            } else {
                setSyncStatus('⚠️ No hay shorts en la base de datos');
            }
        } catch (error) {
            console.error('Error obteniendo shorts desde BD:', error);
            setSyncStatus('❌ Error cargando shorts - Intentando sincronización...');
        }
    }, []);

    // 🚀 CARGAR DATOS INMEDIATAMENTE AL INICIAR
    useEffect(() => {
        const initializeData = async () => {
            console.log('🚀 Inicializando datos...');
            
            // 1. Cargar datos existentes INMEDIATAMENTE (solo shorts para evitar duplicación)
            await fetchShortsFromDatabase();
            
            // 2. Verificar sincronización en segundo plano
            setTimeout(() => {
                checkAndSyncInBackground();
            }, 100); // Delay mínimo para mostrar datos existentes primero
        };

        initializeData();
    }, [fetchShortsFromDatabase]);

    const filteredItems = useMemo(() => {
        // Usar solo shorts para evitar duplicación
        // shorts ya contiene todos los ejercicios de tipo "short" desde la BD
        const allItems: ShortItem[] = shorts;

        console.log(`🔍 FilteredItems Debug:
        - Shorts: ${shorts.length}
        - Exercises: ${exercises.length}  
        - Final items: ${allItems.length}
        - Search term: "${searchTerm}"`);

        // Filtrar por término de búsqueda
        if (searchTerm) {
            return allItems.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return allItems;
    }, [shorts, exercises.length, searchTerm]);

    // Nueva función para verificar sincronización en segundo plano
    const checkAndSyncInBackground = async (): Promise<void> => {
        try {
            setSyncStatus('🔄 Verificando actualizaciones...');
            const syncStatusResponse = await ExerciseService.checkSyncStatus();

            if (syncStatusResponse.success && syncStatusResponse.data) {
                setSyncStatus('🔄 Sincronizando en segundo plano...');
                
                // Hacer sincronización sin bloquear la UI
                ExerciseService.triggerManualSync()
                    .then(async (syncResult) => {
                        if (syncResult.success) {
                            setSyncStatus(`✅ Actualizado: ${syncResult.data}`);
                            
                            // Actualizar datos después de la sincronización
                            const updatedResponse = await ExerciseService.fetchShorts();
                            if (updatedResponse.success) {
                                const updatedShorts = updatedResponse.data.map(exercise => ({
                                    title: exercise.name,
                                    url: exercise.videoUrl
                                }));
                                setShorts(updatedShorts);
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error en sincronización de fondo:', error);
                        setSyncStatus('⚠️ Error en actualización - Usando datos existentes');
                    });
            } else {
                setSyncStatus('✅ Datos actualizados');
            }
        } catch (error) {
            console.error('Error verificando sincronización:', error);
            setSyncStatus('✅ Usando datos existentes');
        }
    };

    // ✅ FUNCIÓN PRINCIPAL: sincronizar con YouTube (usando SOLO backend)
    const syncYouTubeShortsToDatabase = async (): Promise<void> => {
        setIsLoading(true);
        setSyncStatus('🔄 Verificando datos existentes...');

        try {
            // 1. Obtener datos existentes de la BD
            setSyncStatus('📋 Cargando shorts existentes...');
            const response = await ExerciseService.fetchShorts();
            
            if (response.success && response.data.length > 0) {
                const existingShorts = response.data.map(exercise => ({
                    title: exercise.name,
                    url: exercise.videoUrl
                }));
                setShorts(existingShorts);
                setSyncStatus(`✅ ${existingShorts.length} shorts cargados`);

                // Si hay datos, verificar si necesita sincronización
                try {
                    const syncStatusResponse = await ExerciseService.checkSyncStatus();
                    if (!syncStatusResponse.success || !syncStatusResponse.data) {
                        setSyncStatus('✅ Datos actualizados (no requiere sincronización)');
                        console.log('📋 Usando datos existentes de la BD');
                        return;
                    }
                } catch (syncError) {
                    // Si hay error verificando estado, usar datos existentes
                    console.error('Error verificando estado de sincronización:', syncError);
                    setSyncStatus('✅ Usando datos existentes');
                    return;
                }
            }

            // 2. Sincronizar con YouTube (llamada al backend)
            setSyncStatus('🔄 Sincronizando con YouTube...');
            const syncResult = await ExerciseService.triggerManualSync();

            if (syncResult.success) {
                setSyncStatus(`✅ Sincronización completada: ${syncResult.data}`);

                // 3. Actualizar datos locales después de la sincronización
                const updatedResponse = await ExerciseService.fetchShorts();
                if (updatedResponse.success) {
                    const updatedShorts = updatedResponse.data.map(exercise => ({
                        title: exercise.name,
                        url: exercise.videoUrl
                    }));
                    setShorts(updatedShorts);
                }

                // 4. Actualizar exercises completos
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
        try {
            const response = await ExerciseService.fetchExercises();
            if (response.success) {
                setExercises(response.data);
                console.log(`📚 ${response.data.length} ejercicios cargados`);
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
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