export const navLinks = [
    { name: 'Inicio', path: 'inicio', isInternal: true },
    { name: 'Sobre Nosotros', path: 'sobre-nosotros', isInternal: true },
    { name: 'Profesores', path: 'profesores', isInternal: true },
    { name: 'Ejercicios', path: 'ejercicios', isInternal: false },
    { name: 'Clases', path: 'clases', isInternal: true },
    { name: 'Comunidad', path: 'comunidad', isInternal: true },
    { name: 'Filosofía', path: 'filosofia', isInternal: true },
    { name: 'Contacto', path: 'contacto', isInternal: true }
]

export const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}