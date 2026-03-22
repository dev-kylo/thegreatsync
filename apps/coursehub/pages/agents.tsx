/**
 * Agents Page
 * Main page for multi-agent chat interface
 */

import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { authOptions } from './api/auth/[...nextauth]';
import { serverRedirectObject } from '../libs/helpers';
import { setAuthToken } from '../libs/axios';
import AgentLayout from '../components/agents/AgentLayout';
import AgentChatPanel from '../components/agents/AgentChatPanel';
import LoadingQuote from '../containers/LoadingQuote';
import { getAgentSessions } from '../services/agentService';
import type { AgentId, AgentSession } from '../types';

export default function AgentsPage() {
    const { data: session } = useSession();
    const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [agentSessions, setAgentSessions] = useState<Record<AgentId, AgentSession[]>>({} as Record<AgentId, AgentSession[]>);
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);

    // Load all sessions from backend on mount
    useEffect(() => {
        const loadSessions = async () => {
            if (!session?.id) return;

            setIsLoadingSessions(true);
            const agents: AgentId[] = ['product_owner', 'model_builder', 'teacher_qa', 'realm_builder', 'course_instructor'];
            const sessionsByAgent: Record<AgentId, AgentSession[]> = {} as Record<AgentId, AgentSession[]>;

            // Load sessions for each agent in parallel
            await Promise.all(
                agents.map(async (agentId) => {
                    try {
                        const sessions = await getAgentSessions(agentId, String(session.id), 20);
                        sessionsByAgent[agentId] = sessions;
                    } catch (error) {
                        console.error(`Failed to load sessions for ${agentId}:`, error);
                        sessionsByAgent[agentId] = [];
                    }
                })
            );

            setAgentSessions(sessionsByAgent);
            setIsLoadingSessions(false);
        };

        loadSessions();
    }, [session?.id]);

    const handleAgentSelect = (agentId: AgentId) => {
        // Clicking agent without a session starts a new conversation
        setActiveAgentId(agentId);
        setActiveSessionId(null);
    };

    const handleSessionSelect = (agentId: AgentId, sessionId: string) => {
        // Clicking a specific session opens that conversation
        setActiveAgentId(agentId);
        setActiveSessionId(sessionId);
    };

    const handleNewChat = (agentId: AgentId) => {
        // Start a new chat for this agent
        setActiveAgentId(agentId);
        setActiveSessionId(null);
    };

    const handleSessionCreated = (sessionId: string) => {
        if (!activeAgentId) return;

        // Add the new session to the agent's session list
        setActiveSessionId(sessionId);

        // Refresh sessions for this agent
        if (session?.id) {
            getAgentSessions(activeAgentId, String(session.id), 20)
                .then((sessions) => {
                    setAgentSessions((prev) => ({
                        ...prev,
                        [activeAgentId]: sessions,
                    }));
                })
                .catch((error) => {
                    console.error(`Failed to refresh sessions for ${activeAgentId}:`, error);
                });
        }
    };

    if (!session?.jwt) {
        return <LoadingQuote />;
    }

    return (
        <>
            <Head>
                <title>AI Agents - The Great Sync</title>
                <meta name="description" content="Chat with specialized AI agents for personalized learning" />
            </Head>

            <div style={{ background: 'linear-gradient(38.92deg, #03143F 10.77%, #008579 115.98%)' }}>
                <AgentLayout
                    activeAgentId={activeAgentId}
                    activeSessionId={activeSessionId}
                    agentSessions={agentSessions}
                    onAgentSelect={handleAgentSelect}
                    onSessionSelect={handleSessionSelect}
                    onNewChat={handleNewChat}
                    isLoadingSessions={isLoadingSessions}
                >
                    {activeAgentId ? (
                        <AgentChatPanel
                            agentId={activeAgentId}
                            sessionId={activeSessionId}
                            onSessionCreated={handleSessionCreated}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-white/60 text-lg">
                                Select an agent from the menu to start chatting
                            </p>
                        </div>
                    )}
                </AgentLayout>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    // Require authentication
    if (!session) {
        return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    }

    // Set auth token for API calls
    if (session.jwt) {
        setAuthToken(session.jwt as string);
    }

    return {
        props: {},
    };
};
