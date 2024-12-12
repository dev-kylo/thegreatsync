import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import pegIcon from '../../assets/peg.png';
import { NavContext } from '../../context/nav';

const PegIcon = () => {
    const { courseId } = useContext(NavContext);

    return (
        <Link
            className="w-10 pt-1 mx-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
            href={`/courses/${courseId}/reflections`}
        >
            <Image src={pegIcon} alt="" width="500" height="500" />
        </Link>
    );
};

export default PegIcon;
