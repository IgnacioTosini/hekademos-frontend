import { useNavigate, useLocation } from 'react-router-dom'
import { handleScrollTo, navLinks } from '../../utils'
import './_navbarLinks.scss'

type NavbarLinksProps = {
    isFooter?: boolean;
    isAsideBar?: boolean;
    onClose?: () => void;
}

export const NavbarLinks = ({ isFooter, isAsideBar, onClose }: NavbarLinksProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = (link: typeof navLinks[0]) => {
        if (onClose) {
            onClose()
        }
        if (link.isInternal) {
            // Si estamos en la página principal ("/")
            if (location.pathname === '/') {
                handleScrollTo(link.path)
            } else {
                // Si estamos en otra página, navegar a la principal y luego hacer scroll
                navigate('/')
                setTimeout(() => {
                    handleScrollTo(link.path)
                }, 100) // Pequeño delay para asegurar que la página se cargue
            }
        } else {
            // Para links externos (como ejercicios)
            navigate(link.path)
        }
    }

    if (isFooter) {
        const midIndex = Math.ceil(navLinks.length / 2)
        const firstColumn = navLinks.slice(0, midIndex)
        const secondColumn = navLinks.slice(midIndex)

        return (
            <div className={`navbarLinks ${isFooter ? 'footerLinks' : ''} ${isAsideBar ? 'asideBarLinks' : ''}`}>
                <div className="footerColumn">
                    {firstColumn.map((link) => (
                        <div key={link.name} className="navbarLink">
                            <button onClick={() => handleClick(link)}>
                                {link.name}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="footerColumn">
                    {secondColumn.map((link) => (
                        <div key={link.name} className="navbarLink">
                            <button onClick={() => handleClick(link)}>
                                {link.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={`navbarLinks ${isFooter ? 'footerLinks' : ''}` + (isAsideBar ? 'asideBarLinks' : '')}>
            {navLinks.map((link) => (
                <div key={link.name} className="navbarLink">
                    {link.isInternal ? (
                        <button onClick={() => handleClick(link)}>
                            {link.name}
                        </button>
                    ) : (
                        <button onClick={() => handleClick(link)}>
                            {link.name}
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}