
import type { MenuType } from '../../types';
import { VideoCameraIcon, BookOpenIcon, CodeBracketIcon, PencilSquareIcon, PhotoIcon, SpeakerWaveIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { SVGProps } from "react";

type IconType = ((props: SVGProps<SVGSVGElement>) => JSX.Element);

const iconLookup: { [key in MenuType]: React.ReactNode | IconType } = {
    watch: VideoCameraIcon,
    read: BookOpenIcon,
    code: CodeBracketIcon,
    draw: PencilSquareIcon,
    imagine: PhotoIcon,
    listen: SpeakerWaveIcon,
    play: MagnifyingGlassIcon
}


const MenuIcon = ({ type, completed, active = false }: { type: MenuType, completed: boolean, active: boolean }) => {
    let Icon = MagnifyingGlassIcon
    if (completed) Icon = CheckCircleIcon;
    else if (iconLookup[type]) Icon = iconLookup[type] as IconType;
    return (
        <div className='pl-2 mr-8'>
            <div className="flex items-center">
                <Icon
                    className={`${completed ? 'text-green-400' : 'text-gray-400'} mr-2 h-6 w-6`}
                    aria-hidden="true"
                />
                {<span className="text-xs w-12 overflow-hidden">{(type.toUpperCase())}</span>}
            </div>
        </div>
    )
};

export default MenuIcon;