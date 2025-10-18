import { useEffect, useState } from 'react';
import { Navbar } from '../Navbar/Navbar'
import { AsideNavbar } from '../AsideNavbar/AsideNavbar';
import './_header.scss'
import { handleScrollTo } from '../../utils';

export const Header = () => {
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    useEffect(() => {
        const checkIsMobile = () => {
            if (window.innerWidth <= 768) {
                setIsDashboardOpen(false);
            }
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleToggleDashboard = () => {
        setIsDashboardOpen(!isDashboardOpen);
    };

    const handleClick = () => {
        if (isDashboardOpen) {
            setIsDashboardOpen(false);
        }
        handleScrollTo('contacto');
    };

    return (
        <div className="header">
            <img src="/LogoHekademos.png" alt="Hekademos Logo" className='logo' />
            <Navbar onToggleMobileMenu={handleToggleDashboard} />
            <button className='button' onClick={handleClick}>
                Sumate a Hekademos
            </button>
            {isDashboardOpen && <AsideNavbar isOpen={isDashboardOpen} onClose={handleToggleDashboard} />}
        </div>
    )
}
