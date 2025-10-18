import { useExerciseContext } from '../../context/exerciseContext';
import { ExerciseItem } from '../ExerciseItem/ExerciseItem'
import './_exerciseList.scss'

export const ExerciseList = () => {
    const { filteredItems, isLoading, searchTerm } = useExerciseContext();

    if (isLoading) {
        return (
            <div className='exerciseListContainer'>
                <div className="loading-spinner">🔄 Cargando ejercicios...</div>
            </div>
        )
    }

    return (
        <div className='exerciseListContainer'>
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