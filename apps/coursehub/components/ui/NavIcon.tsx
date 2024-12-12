import { ReactNode } from 'react';

const NavIcon = ({ children, title }: { children: ReactNode; title: string }) => (
    <div className="w-full h-full grid grid-rows-1 place-items-center ">
        <div className="w-full flex justify-center ">{children}</div>
        <span className="text-xs uppercase text-green-400 font-bold mb-2">{title}</span>
    </div>
);

export default NavIcon;
