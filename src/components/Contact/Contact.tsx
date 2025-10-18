import { FaClock, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { Form } from '../Form/Form'
import './_contact.scss'

export const Contact = () => {
    return (
        <div className="contactSection" id="contacto">
            <h2 className="contactTitle animate-on-scroll">Contacto</h2>
            <p className="contactSubtitle animate-on-scroll">Da el primer paso hacia tu transformación. Estamos aquí para acompañarte en tu camino.</p>

            <div className='formContactInfoContainer animate-split-contact'>
                <div className="form-wrapper animate-from-left">
                    <Form />
                </div>
                <div className='contactInfoContainer animate-from-right'>
                    <div className='contactInfo'>
                        <h3 className='contactInfoTitle animate-on-scroll'>Información de Contacto</h3>
                        <div className='contactInfoCard stagger-card'>
                            <picture className='iconContainer animate-icon-bounce'>
                                <IoMdMail className='contactIcon' />
                            </picture>
                            <p>info@hekademos.com</p>
                        </div>
                        <div className='contactInfoCard stagger-card'>
                            <picture className='iconContainer animate-icon-bounce'>
                                <FaPhoneAlt className='contactIcon' />
                            </picture>
                            <p>+54 11 1234-5678</p>
                        </div>
                        <div className='contactInfoCard stagger-card'>
                            <picture className='iconContainer animate-icon-bounce'>
                                <FaMapMarkerAlt className='contactIcon' />
                            </picture>
                            <p>Av. Ejemplo 1234, Buenos Aires</p>
                        </div>
                    </div>

                    <div className='buttonsContainer animate-buttons-group'>
                        <button className='contactButton whatsapp animate-button-hover'><FaWhatsapp /><span>Escribir por WhatsApp</span></button>
                        <button className='contactButton instagram animate-button-hover' onClick={() => window.open('https://www.instagram.com/hekademos.em', '_blank')}><FaInstagram /><span>Seguir en Instagram</span></button>
                    </div>

                    <div className='hourContainer animate-schedule'>
                        <div className='titleContainer animate-on-scroll'>
                            <FaClock className='hourIcon animate-clock-tick' />
                            <h3 className='contactInfoTitle'>Horario de Atención</h3>
                        </div>
                        <p className='hour animate-schedule-item'><span className='day'>Lunes</span> 7:00 - 21:00</p>
                        <p className='hour animate-schedule-item'><span className='day'>Martes</span> 7:00 - 21:00</p>
                        <p className='hour animate-schedule-item'><span className='day'>Miércoles</span> 7:00 - 21:00</p>
                        <p className='hour animate-schedule-item'><span className='day'>Jueves</span> 7:00 - 21:00</p>
                        <p className='hour animate-schedule-item'><span className='day'>Viernes</span> 7:00 - 21:00</p>
                        <p className='hour animate-schedule-item'><span className='day'>Sábados y Domingos</span> Cerrado</p>
                    </div>
                </div>
            </div>
        </div>
    )
}