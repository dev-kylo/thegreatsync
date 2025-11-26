/**
 * AgentSidebar Component
 * Slide-over menu for agent selection with session history
 */

import React, { useMemo } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import SlideOver from '../ui/SlideOver';
import ProfileDropDown from '../ui/ProfileDropdown';
import GenericMenu from '../ui/GenericMenu';
import { AGENT_MENU_ITEMS } from '../../constants/agents';
import type { AgentId, AgentSession, GenericMenuItem } from '../../types';

interface AgentSidebarProps {
    open: boolean;
    onClose: () => void;
    activeAgentId: AgentId | null;
    activeSessionId: string | null;
    agentSessions: Record<AgentId, AgentSession[]>;
    onAgentSelect: (agentId: AgentId) => void;
    onSessionSelect: (agentId: AgentId, sessionId: string) => void;
    onNewChat: (agentId: AgentId) => void;
    isLoadingSessions: boolean;
}

/**
 * Format session date for display
 */
function formatSessionDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

export default function AgentSidebar({
    open,
    onClose,
    activeAgentId,
    activeSessionId,
    agentSessions,
    onAgentSelect,
    onSessionSelect,
    onNewChat,
    isLoadingSessions,
}: AgentSidebarProps) {
    // Build menu hierarchy with sessions as children
    const menuItems = useMemo<GenericMenuItem[]>(() => {
        return AGENT_MENU_ITEMS.map((agent) => {
            const agentId = agent.id as AgentId;
            const sessions = agentSessions[agentId] || [];

            // Build children: "+ New Chat" button + session list
            const children: GenericMenuItem[] = [
                // "+ New Chat" special item
                {
                    id: `${agentId}:new`,
                    name: '+ New Chat',
                    level: 2 as const,
                    icon: <PlusIcon className="h-4 w-4" />,
                    data: { type: 'new_chat', agentId },
                },
                // Existing sessions
                ...sessions.map((session, index) => ({
                    id: session.id,
                    name: session.topic || `Chat ${sessions.length - index}`,
                    description: formatSessionDate(session.started_at),
                    level: 2 as const,
                    data: { type: 'session', agentId, sessionId: session.id },
                })),
            ];

            return {
                ...agent,
                children: children.length > 0 ? children : undefined,
            };
        });
    }, [agentSessions]);

    const handleItemClick = (item: GenericMenuItem) => {
        const itemData = item.data as any;

        if (!itemData) {
            // Top-level agent clicked (no children scenario)
            onAgentSelect(item.id as AgentId);
            onClose();
            return;
        }

        if (itemData.type === 'new_chat') {
            // "+ New Chat" clicked
            onNewChat(itemData.agentId);
            onClose();
        } else if (itemData.type === 'session') {
            // Existing session clicked
            onSessionSelect(itemData.agentId, itemData.sessionId);
            onClose();
        }
    };

    return (
        <SlideOver open={open} setOpen={onClose} title="AI Agents">
            {/* Mobile Profile Dropdown */}
            <div className="md:hidden px-4 mb-4">
                <ProfileDropDown />
            </div>

            {/* Agent Menu with Sessions */}
            <div className="px-4">
                {isLoadingSessions ? (
                    <div className="text-white/60 text-sm py-4">Loading conversations...</div>
                ) : (
                    <GenericMenu
                        items={menuItems}
                        activeItemId={activeSessionId || activeAgentId || undefined}
                        onItemClick={handleItemClick}
                        onClose={onClose}
                    />
                )}
            </div>

            {/* Agent descriptions */}
            <div className="mt-8 px-4">
                <div className="border-t border-white/10 pt-4">
                    <h3 className="text-white/80 text-sm font-medium mb-2">About AI Agents</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                        Each agent is specialized in different aspects of The Great Sync. Select an agent to start a
                        conversation and explore course materials, build models, or get personalized instruction.
                    </p>
                </div>
            </div>
        </SlideOver>
    );
}
