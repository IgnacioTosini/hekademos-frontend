import { TeacherCard } from '../TeacherCard/TeacherCard'
import './_teachers.scss'

export const Teachers = () => {
    return (
        <div className="teachers" id="profesores">
            <h2 className='teachersTitle animate-typewriter'>Nuestros Instructores</h2>
            <h3 className='teachersSubtitle animate-reveal-text'>Conocé al equipo de profesionales que te acompañará en tu transformación. Cada uno aporta su experiencia y pasión por el movimiento consciente.</h3>
            <div className='teacherList animate-team-entrance'>
                <div className="teacher-item stagger-card" data-delay="0">
                    <TeacherCard
                        name="Juani Iglesias"
                        image="/teachers/juanIglesias.png"
                        description="Entrenador especializado en calistenia🤸"
                        instagramLink="https://www.instagram.com/juaniglesias.move"
                    />
                </div>
                <div className="teacher-item stagger-card" data-delay="0.2">
                    <TeacherCard
                        name="Victoria Menendez"
                        image="/teachers/victoriaMenendez.png"
                        description="Prof. Educación Física
Movimiento y educación corporal"
                        instagramLink="https://www.instagram.com/vitomenendez"
                    />
                </div>
                <div className="teacher-item stagger-card" data-delay="0.4">
                    <TeacherCard
                        name="Dalmiro Mandrini"
                        image="/teachers/dalmiroMandrini.png"
                        description="🤸🏻Profesor de educación física y aprendiz constante."
                        instagramLink="https://www.instagram.com/dalmiro_mandrini"
                    />
                </div>
                <div className="teacher-item stagger-card" data-delay="0.6">
                    <TeacherCard
                        name="Marian Calomino"
                        image="/teachers/marianCalomino.png"
                        description="Atleta e instructor de Calistenia y StreetWorkout 🥷🏼"
                        instagramLink="https://www.instagram.com/mariancsw"
                    />
                </div>
            </div>
        </div>
    )
}