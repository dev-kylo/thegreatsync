import Image from 'next/image';
import { ImageData } from '../../../types';

type ImageBlockProps = {
    image: ImageData;
    imageAlt: string;
    id: number;
};

const ImageBlock = ({ image, id, imageAlt }: ImageBlockProps) => {
    const { url, placeholder } = image.attributes;
    return (
        <div className="relative m-8">
            <Image
                key={`image:${image.id}-${id}`}
                id={`image:${id}`}
                alt={imageAlt || ''}
                src={url}
                width={image.attributes.width}
                height={image.attributes.height}
                placeholder="blur"
                blurDataURL={placeholder}
                priority
            />
        </div>
    );
};
export default ImageBlock;
