import { Disclosure } from '@headlessui/react';
import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ProfileDropDown from './ProfileDropdown';
import SlideOver from './SlideOver';
import TitleStrip from './TitleStrip';
import Menu from './Menu';
import { CurrentLocation, MenuItem } from '../../types';
import Spinner from './Spinner';
import PegIcon from './PegIcon';
import NavIcon from './NavIcon';
import ModelIcon from './ModelIcon';

export default function Navbar({
    pageTitle,
    subChapterTitle,
    menuData,
    current,
    pageType,
    markPage,
}: {
    pageTitle: string;
    subChapterTitle: string;
    current: CurrentLocation;
    menuData?: MenuItem[];
    pageType?: string;
    markPage?: (page: string | number, unMark?: boolean) => Promise<void>;
}) {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            <Disclosure as="nav" className="flex-shrink-0 bg-primary_blue">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-8 h-full flex justify-center flex-col">
                    <div className="relative flex items-center justify-between">
                        {/* Course Menu Button */}
                        {pageType !== 'listing' && (
                            <Bars3Icon
                                onClick={() => setOpenMenu(true)}
                                className="block h-8 w-8 xl:h-10 xl:w-10 text-white hover:cursor-pointer hover:text-primary_green focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary_blue"
                                aria-hidden="true"
                            />
                        )}
                        <TitleStrip primaryTitle={subChapterTitle} secondaryTitle={pageTitle} pageType={pageType} />
                        <div className="hidden md:block">
                            <div className="flex items-center justify-end">
                                <NavIcon title="Model">
                                    <ModelIcon />
                                </NavIcon>

                                <NavIcon title="Pegs">
                                    <PegIcon />
                                </NavIcon>
                                <NavIcon title="Profile">
                                    <ProfileDropDown />
                                </NavIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </Disclosure>
            <SlideOver open={openMenu} setOpen={setOpenMenu}>
                <ProfileDropDown mobile />

                {menuData ? (
                    <Menu
                        markPage={markPage}
                        menuData={menuData}
                        closeMenu={() => setOpenMenu(false)}
                        current={current}
                    />
                ) : (
                    <div className="m-8 flex justify-center">
                        <Spinner />
                    </div>
                )}
            </SlideOver>
        </>
    );
}
