/**
 * AgentNavbar Component
 * Top navigation bar for agents page
 */

import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ProfileDropDown from '../ui/ProfileDropdown';
import NavIcon from '../ui/NavIcon';

interface AgentNavbarProps {
    agentName: string | null;
    onOpenMenu: () => void;
}

export default function AgentNavbar({ agentName, onOpenMenu }: AgentNavbarProps) {
    return (
        <nav className="flex-shrink-0 bg-[#0f1f3d] border-b border-white/5">
            <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-1.5">
                <div className="relative flex items-center justify-between">
                    {/* Menu Button */}
                    <Bars3Icon
                        onClick={onOpenMenu}
                        className="block h-5 w-5 text-white/80 hover:cursor-pointer hover:text-[#00D9A5] transition"
                        aria-label="Open agents menu"
                    />

                    {/* Agent Title */}
                    <div className="flex-1 px-4">
                        <h1 className="text-white text-sm sm:text-base font-semibold text-center">
                            {agentName || 'AI Agents'}
                        </h1>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="hidden md:block">
                        <NavIcon title="Profile">
                            <ProfileDropDown />
                        </NavIcon>
                    </div>
                </div>
            </div>
        </nav>
    );
}
