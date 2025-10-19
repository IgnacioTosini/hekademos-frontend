import { useEffect, useState } from 'react';
import { useExerciseContext } from '../../context/exerciseContext';
import { ExerciseItem } from '../ExerciseItem/ExerciseItem'
import './_exerciseList.scss'

export const ExerciseList = () => {
    const { filteredItems, isLoading, searchTerm, syncStatus } = useExerciseContext();
    const [showProgressiveLoading, setShowProgressiveLoading] = useState(false);

    useEffect(() => {
        // Si no hay datos después de 3 segundos, mostrar loading progresivo
        const timer = setTimeout(() => {
            if (filteredItems.length === 0 && isLoading) {
                setShowProgressiveLoading(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [filteredItems.length, isLoading]);

    // Reset progressive loading cuando hay datos
    useEffect(() => {
        if (filteredItems.length > 0) {
            setShowProgressiveLoading(false);
        }
    }, [filteredItems.length]);

    // Loading progresivo para primera carga
    if (showProgressiveLoading && filteredItems.length === 0) {
        return (
            <div className='exerciseListContainer'>
                <div className="progressive-loading">
                    <h3>🔄 Preparando contenido...</h3>
                    <p className="sync-status">{syncStatus}</p>
                    <div className="loading-details">
                        <div className="loading-spinner">⏳</div>
                        <p className="loading-tip">
                            La primera carga puede tomar unos momentos mientras sincronizamos con YouTube
                        </p>
                        <div className="loading-steps">
                            <div className="step">📋 Verificando datos existentes</div>
                            <div className="step">🔄 Sincronizando contenido</div>
                            <div className="step">✅ Preparando ejercicios</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading simple para cargas rápidas
    if (isLoading && filteredItems.length === 0) {
        return (
            <div className='exerciseListContainer'>
                <div className="initial-loading">
                    <div className="loading-spinner">🔄</div>
                    <p>Cargando ejercicios...</p>
                    {syncStatus && <p className="sync-status">{syncStatus}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className='exerciseListContainer'>
            {/* Mostrar estado de sincronización si está disponible */}
            {syncStatus && (
                <div className="sync-status-bar">
                    <span>{syncStatus}</span>
                </div>
            )}
            
            <h3>
                {filteredItems.length} Ejercicio{filteredItems.length !== 1 ? 's' : ''}
                {searchTerm ? ` encontrado${filteredItems.length !== 1 ? 's' : ''} para "${searchTerm}"` : ' disponibles'}
            </h3>

            {filteredItems.length === 0 ? (
                <div className="no-exercises">
                    <p>
                        {searchTerm
                            ? `No se encontraron ejercicios que coincidan con "${searchTerm}"`
                            : "No hay ejercicios disponibles. Intenta sincronizar con YouTube."
                        }
                    </p>
                </div>
            ) : (
                <ul className='exerciseList'>
                    {filteredItems.map((item, index) => (
                        <li key={`${item.url}-${index}`}>
                            <ExerciseItem
                                title={item.title}
                                youtubeUrl={item.url}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}