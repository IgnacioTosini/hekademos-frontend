import { AboutUs } from '../../components/AboutUs/AboutUs'
import { Banner } from '../../components/Banner/Banner'
import { Classes } from '../../components/Classes/Classes'
import { Comunity } from '../../components/Comunity/Comunity'
import { Contact } from '../../components/Contact/Contact'
import { Philosophy } from '../../components/Philosophy/Philosophy'
import { Teachers } from '../../components/Teachers/Teachers'
import { useScrollAnimations } from '../../hooks/useScrollAnimations'
import './_homePage.scss'

export const HomePage = () => {
    const { containerRef } = useScrollAnimations()

    return (
        <div className="homePage" ref={containerRef}>
            <div className="banner">
                <Banner />
            </div>
            <div className="about-us-section">
                <AboutUs />
            </div>
            <div className="teachers-section">
                <Teachers />
            </div>
            <div className="classes-section">
                <Classes />
            </div>
            <div className="comunity-section">
                <Comunity />
            </div>
            <div className="philosophy-section">
                <Philosophy />
            </div>
            <div className="contact-section">
                <Contact />
            </div>
        </div>
    )
}