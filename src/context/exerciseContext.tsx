import { createContext, useContext } from "react";
import type { ExerciseContextProps } from "./exerciseStore";

export const ExerciseContext = createContext<ExerciseContextProps | undefined>(undefined);

export const useExerciseContext = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error("useExerciseContext must be used within an ExerciseProvider");
    }
    return context;
};