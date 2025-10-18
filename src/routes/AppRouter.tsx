import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage/HomePage"
import { ExercisesPage } from "../pages/ExercisesPage/ExercisesPage"

export const AppRouter = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ejercicios" element={<ExercisesPage />} />
            </Routes>
        </Suspense>
    )
}