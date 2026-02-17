export default function PhotoContainer({photoURL, style, alt}) {
    return (
        <figure className={style}>
            <img src={photoURL} alt={alt} />
        </figure>
    )
}