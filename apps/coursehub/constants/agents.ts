/**
 * Agent Constants
 * Defines all available agents and their metadata
 */

import type { GenericMenuItem, AgentId } from '../types';

/**
 * Agent menu items for sidebar
 * Each agent is a top-level item (level 1)
 */
export const AGENT_MENU_ITEMS: GenericMenuItem<{ session_type: string }>[] = [
    {
        id: 'product_owner',
        name: 'Product Owner',
        description: 'Improves existing course materials based on feedback',
        level: 1,
        data: { session_type: 'improvement' },
    },
    {
        id: 'model_builder',
        name: 'Model Builder',
        description: 'Creates new metaphor models consistent with Canon',
        level: 1,
        data: { session_type: 'model_build' },
    },
    {
        id: 'teacher_qa',
        name: 'Teacher QA',
        description: 'Answers student questions using Great Sync metaphors',
        level: 1,
        data: { session_type: 'qa' },
    },
    {
        id: 'realm_builder',
        name: 'Realm Builder',
        description: 'Guides creation of custom metaphor worlds',
        level: 1,
        data: { session_type: 'qa' },
    },
    {
        id: 'course_instructor',
        name: 'Course Instructor',
        description: 'Teaches structured lessons from canon courses',
        level: 1,
        data: { session_type: 'lesson' },
    },
];

/**
 * Get agent by ID
 */
export function getAgentById(agentId: AgentId): GenericMenuItem<{ session_type: string }> | undefined {
    return AGENT_MENU_ITEMS.find((agent) => agent.id === agentId);
}

/**
 * Get agent name by ID
 */
export function getAgentName(agentId: AgentId): string {
    const agent = getAgentById(agentId);
    return agent?.name || '';
}

/**
 * Get agent description by ID
 */
export function getAgentDescription(agentId: AgentId): string {
    const agent = getAgentById(agentId);
    return agent?.description || '';
}

/**
 * Example questions for each agent
 */
export const AGENT_EXAMPLE_QUESTIONS: Record<AgentId, string[]> = {
    product_owner: [
        'How can we improve the closure chapter?',
        'What feedback have students given on async/await?',
        'Suggest improvements for the React hooks section',
    ],
    model_builder: [
        'Create a metaphor for promises in JavaScript',
        'Design a visual model for the event loop',
        'Build a metaphor for database transactions',
    ],
    teacher_qa: [
        'What is a closure in JavaScript?',
        'How does async/await work?',
        'Explain the difference between map and forEach',
    ],
    realm_builder: [
        'Help me create a fantasy realm for teaching networking',
        'Design a sci-fi world for explaining databases',
        'Build a medieval setting for teaching algorithms',
    ],
    course_instructor: [
        'Teach me about JavaScript closures',
        'Walk me through React hooks',
        'Explain async/await with examples',
    ],
};
