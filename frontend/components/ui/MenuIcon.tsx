import {
    VideoCameraIcon,
    BookOpenIcon,
    CodeBracketIcon,
    PencilSquareIcon,
    PhotoIcon,
    SpeakerWaveIcon,
    MagnifyingGlassIcon,
    ShareIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { SVGProps } from 'react';
import type { MenuType } from '../../types';

type IconType = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const iconLookup: { [key: string]: React.ReactNode | IconType } = {
    watch: VideoCameraIcon,
    read: BookOpenIcon,
    code: CodeBracketIcon,
    draw: PencilSquareIcon,
    imagine: PhotoIcon,
    listen: SpeakerWaveIcon,
    discover: MagnifyingGlassIcon,
    share: ShareIcon,
};

const MenuIcon = ({ type, completed, active }: { type: MenuType; completed: boolean; active: boolean }) => {
    if (active) console.log(`${type} in menu is active`);
    let Icon = BookOpenIcon;
    if (completed) Icon = CheckCircleIcon;
    else if (iconLookup[type]) Icon = iconLookup[type] as IconType;
    return (
        <div className="pl-2 mr-2 sm:mr-6">
            <div className="flex items-center">
                <Icon
                    className={`${
                        active ? 'text-gray-400' : completed ? 'text-green-400' : 'text-gray-400'
                    } mr-2 h-6 w-6`}
                    aria-hidden="true"
                />
                <span
                    className={`text-[0.7rem] w-16 overflow-hidden ${
                        active ? 'text-black' : 'text-green-400 font-bold'
                    } `}
                >
                    {type.toUpperCase()}
                </span>
            </div>
        </div>
    );
};

export default MenuIcon;
