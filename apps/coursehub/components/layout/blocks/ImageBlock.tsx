import Image from 'next/image';
import { CSSProperties } from 'react';
import { ImageData } from '../../../types';

type ImageBlockProps = {
    image: ImageData;
    imageAlt: string;
    id: number;
    style?: CSSProperties;
    containerCss?: string;
};

const ImageBlock = ({ image, id, imageAlt, style, containerCss }: ImageBlockProps) => {
    const { url, placeholder } = image.attributes;
    return (
        <div className={`${containerCss || 'relative m-8'}`}>
            <Image
                key={`image:${image.id}-${id}`}
                id={`image:${id}`}
                alt={imageAlt || ''}
                src={url}
                width={image.attributes.width}
                height={image.attributes.height}
                placeholder="blur"
                blurDataURL={placeholder}
                style={style}
                priority
            />
        </div>
    );
};
export default ImageBlock;
