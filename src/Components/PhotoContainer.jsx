function isAbsoluteUrl(value) {
    return /^https?:\/\//i.test(value);
}

function isLocalAssetPath(value) {
    return value.startsWith("/") || value.startsWith("./") || value.startsWith("../");
}

function resolveCloudinaryUrl(photoURL) {
    if (!photoURL || typeof photoURL !== "string") {
        return photoURL;
    }

    const trimmed = photoURL.trim();
    if (!trimmed || isAbsoluteUrl(trimmed) || isLocalAssetPath(trimmed)) {
        return trimmed;
    }

    const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || import.meta.env.VITE_CLOUDINARY_CLOUDNAME || "").trim();
    if (!cloudName) {
        return trimmed;
    }

    return `https://res.cloudinary.com/${cloudName}/image/upload/${trimmed.replace(/^\/+/, "")}`;
}

export default function PhotoContainer({photoURL, style, alt}) {
    const resolvedPhotoURL = resolveCloudinaryUrl(photoURL);

    return (
        <figure className={style}>
            <img src={resolvedPhotoURL} alt={alt} />
        </figure>
    )
}
