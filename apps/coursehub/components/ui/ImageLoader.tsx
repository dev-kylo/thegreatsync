import Spinner from './Spinner';

const ImageLoader = () => (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99]">
        <Spinner />
    </div>
);

export default ImageLoader;
