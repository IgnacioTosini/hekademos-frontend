import { useEffect } from 'react'
import { ExerciseList } from '../../components/ExerciseList/ExerciseList'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import { useExerciseContext } from '../../context/exerciseContext'
import './_exercisesPage.scss'

export const ExercisesPage = () => {
  const {
    syncYouTubeShortsToDatabase,
    isLoading,
  } = useExerciseContext();

  // Función para sincronizar
  const syncHekademosShorts = async () => {
    await syncYouTubeShortsToDatabase('@HekademosE.M');
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    syncHekademosShorts();
  }, []);

  return (
    <div className='exercisePage'>
      <div className='exerciseHeader'>
        <h1>Biblioteca de Ejercicios</h1>
        <p>Descubrí nuestra colección completa de ejercicios para entrenar tu cuerpo con conciencia y propósito.</p>

        <div className='syncSection'>
          <button onClick={syncHekademosShorts} disabled={isLoading}>
            {isLoading ? 'Sincronizando...' : '🔄 Sincronizar con YouTube'}
          </button>
        </div>
      </div>

      <div className='exerciseContent'>
        <SearchBar />
        <ExerciseList />
      </div>
    </div>
  )
}