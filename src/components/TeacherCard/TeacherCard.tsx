import { FaInstagram } from 'react-icons/fa';
import './_teacherCard.scss'

type TeacherCardProps = {
    name: string;
    image: string;
    description: string;
    instagramLink: string;
}

export const TeacherCard = ({ name, image, description, instagramLink }: TeacherCardProps) => {
    return (
        <div className='teacherCard'>
            <picture className='imgContainer'>
                <img src={image} alt={name} />
            </picture>
            <h4 className='teacherTitle'>{name}</h4>
            <p className='teacherDescription'>{description}</p>
            <a href={instagramLink} className='instagramLink' target="_blank" rel="noopener noreferrer">
                <FaInstagram className='instagramIcon'/>
            </a>
        </div>
    )
}
