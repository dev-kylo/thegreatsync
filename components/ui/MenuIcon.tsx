
import type { MenuType } from "../../types";
import { VideoCameraIcon, BookOpenIcon, CodeBracketIcon, PencilSquareIcon, PhotoIcon, SpeakerWaveIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'


const iconLookup: { [key in MenuType]: React.ReactNode } = {
    watch: VideoCameraIcon,
    read: BookOpenIcon,
    code: CodeBracketIcon,
    draw: PencilSquareIcon,
    imagine: PhotoIcon,
    listen: SpeakerWaveIcon,
}


const MenuIcon = ({ type, completed, active = false }: { type: MenuType, completed: boolean, active: boolean }) => {
    let Icon = ShieldCheckIcon;
    if (completed) Icon = ShieldCheckIcon;
    else if (iconLookup[type]) Icon = iconLookup[type]
    return (
        <div className='pl-2 mr-8'>
            <div className="flex items-center">
                <Icon
                    className={`${active ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'} mr-2 h-6 w-6`}
                    aria-hidden="true"
                />
                {<span className="text-xs w-12 overflow-hidden">{(type.toUpperCase())}</span>}
            </div>
        </div>
    )
};

export default MenuIcon;