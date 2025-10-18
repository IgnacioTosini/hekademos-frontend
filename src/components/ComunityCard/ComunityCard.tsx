import type { JSX } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import './_comunityCard.scss';

type ComunityCardProps = {
    title: string;
    description: string;
    image: string;
    imageUrl: string;
}

export const ComunityCard = ({ title, description, image, imageUrl }: ComunityCardProps) => {
    const iconMap: { [key: string]: JSX.Element } = {
        "Respeto": <IoPeopleSharp className="icon" />,
        "Compañerismo": <FaRegHeart className="icon" />,
        "Progreso compartido": <FaArrowTrendUp className="icon" />
    };

    return (
        <div className='comunityCard'>
            <picture className="comunityCardImage">
                <div className="iconContainer">
                {iconMap[image]}
                </div>
                <img src={imageUrl} alt={image} />
            </picture>
            <h4 className="comunityCardTitle">{title}</h4>
            <p className="comunityCardDescription">{description}</p>
        </div>
    )
}
