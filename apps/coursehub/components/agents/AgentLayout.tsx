/**
 * AgentLayout Component
 * Container layout for the agents interface
 */

import React, { useState } from 'react';
import AgentNavbar from './AgentNavbar';
import AgentSidebar from './AgentSidebar';
import { getAgentName } from '../../constants/agents';
import type { AgentId, AgentSession } from '../../types';

interface AgentLayoutProps {
    activeAgentId: AgentId | null;
    activeSessionId: string | null;
    agentSessions: Record<AgentId, AgentSession[]>;
    onAgentSelect: (agentId: AgentId) => void;
    onSessionSelect: (agentId: AgentId, sessionId: string) => void;
    onNewChat: (agentId: AgentId) => void;
    isLoadingSessions: boolean;
    children: React.ReactNode;
}

export default function AgentLayout({
    activeAgentId,
    activeSessionId,
    agentSessions,
    onAgentSelect,
    onSessionSelect,
    onNewChat,
    isLoadingSessions,
    children
}: AgentLayoutProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const agentName = activeAgentId ? getAgentName(activeAgentId) : null;

    return (
        <>
            {/* Simplified Layout: compact navbar, full content */}
            <div className="flex flex-col h-screen overflow-hidden">
                {/* Navbar - Compact */}
                <AgentNavbar
                    agentName={agentName}
                    onOpenMenu={() => setMenuOpen(true)}
                />

                {/* Main Content - Full height minus navbar */}
                <div className="flex-1 overflow-hidden bg-[#0a1628]">{children}</div>
            </div>

            {/* Slide-over Menu */}
            <AgentSidebar
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                activeAgentId={activeAgentId}
                activeSessionId={activeSessionId}
                agentSessions={agentSessions}
                onAgentSelect={onAgentSelect}
                onSessionSelect={onSessionSelect}
                onNewChat={onNewChat}
                isLoadingSessions={isLoadingSessions}
            />
        </>
    );
}
