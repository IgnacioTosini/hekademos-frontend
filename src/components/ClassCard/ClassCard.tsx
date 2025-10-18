import './_classCard.scss'

type ClassCardProps = {
    title: string
    description: string
    list: string[]
    image?: string
}

export const ClassCard = ({ title, description, list, image }: ClassCardProps) => {
    return (
        <div className='classCard'>
            <picture className='imgContainer'>
            {image && <img src={image} alt={title} className='classCardImage' />}
            </picture>
            <h3 className='classCardTitle'>{title}</h3>
            <p className='classCardDescription'>{description}</p>
            <ul className='classCardList'>
                {list.map((item, index) => (
                    <li key={index} className='classCardListItem'>{item}</li>
                ))}
            </ul>
        </div>
    )
}
