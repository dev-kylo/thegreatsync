/**
 * Prompt generators for session-based learning
 */

import { Realm, TopicPack, SessionEvent } from '../types/session';

/**
 * Build the system prompt for a learning session
 * This prompt sets the context for the entire conversation
 */
export function buildSessionSystemPrompt(realm: Realm, topicPack: TopicPack): string {
  const entitiesList = topicPack.entities
    .map(e => `  - ${e.name} (${e.id}): ${e.description}`)
    .join('\n');

  const truthsList = topicPack.truths
    .map((t, i) => `  ${i + 1}. ${t}`)
    .join('\n');

  const misconceptionsList = topicPack.misconceptions
    .map((m, i) => `  ${i + 1}. ${m}`)
    .join('\n');

  const testsList = topicPack.tests
    .map((t, i) => `  ${i + 1}. ${t}`)
    .join('\n');

  return `You are a metaphor-building coach for the "${realm.name}".

Your role is to guide the learner through creating a vivid, accurate mental model for today's topic: **${topicPack.topic}**.

=== REALM GUIDELINES ===

SYMBOL INVENTORY:
${realm.symbol_inventory.join(', ')}

REALM HINTS:
${realm.hints.map(h => `• ${h}`).join('\n')}

=== TODAY'S TOPIC: ${topicPack.topic.toUpperCase()} ===

ENTITIES TO MAP:
${entitiesList}

TRUTHS (must be captured in the metaphor):
${truthsList}

COMMON MISCONCEPTIONS (actively avoid these):
${misconceptionsList}

MENTAL MODEL TESTS (the final metaphor must help answer these):
${testsList}

=== YOUR GOAL ===

By the end of this session, you will help the learner:
1. **Establish a clear legend** mapping each entity to a symbol from the realm
2. **Write 3-5 rules** that capture the truths using those symbols
3. **Produce a 60-90 second narrative script** that tells the story of how this concept works

=== CONVERSATION APPROACH ===

• Guide the learner naturally through building their metaphor
• Ask clarifying questions to help them make good symbol choices
• Gently correct misconceptions when they arise
• Keep the conversation focused on the goal
• Be encouraging and supportive
• Use the learner's own words and ideas when possible
• When the learner says they're ready to finish, help them formalize the artifact

Remember: You're not teaching the technical concept directly—you're helping them build a mental model using the realm's symbols.`;
}

/**
 * Build the welcome message when starting a new session
 */
export function buildWelcomeMessage(realm: Realm, topicPack: TopicPack): string {
  return `Welcome to the ${realm.name}!

Today, we're going to build a mental model for **${topicPack.topic}** using symbols from our realm.

We have entities like ${topicPack.entities.slice(0, 3).map(e => e.name).join(', ')} that we need to map to symbols like ${realm.symbol_inventory.slice(0, 5).join(', ')}.

By the end of our session, you'll have:
• A clear legend showing which symbols represent which concepts
• A set of rules that capture how this works
• A short story that brings it all together

Where would you like to start? Do you have any initial ideas for symbols, or would you like me to suggest some options?`;
}

/**
 * Build the artifact extraction prompt
 * This prompt is used to extract the final metaphor map from the conversation
 */
export function buildArtifactExtractionPrompt(
  realm: Realm,
  topicPack: TopicPack,
  events: SessionEvent[]
): string {
  // Convert events to conversation format
  const conversation = events
    .filter(e => e.role !== 'system')
    .map(e => `${e.role.toUpperCase()}: ${e.content}`)
    .join('\n\n');

  return `Based on the following conversation, extract the final metaphor map artifact.

=== REALM ===
${realm.name}

=== TOPIC ===
${topicPack.topic}

=== ENTITIES ===
${topicPack.entities.map(e => `- ${e.id}: ${e.name}`).join('\n')}

=== CONVERSATION ===
${conversation}

=== TASK ===

Analyze the conversation and extract:

1. **LEGEND**: A mapping of each entity ID to the chosen symbol from the conversation
2. **RULES**: 3-5 clear, concise rules that capture the truths using the symbols (each rule should be 1-2 sentences)
3. **SCRIPT**: A 60-90 second narrative that tells the story using the symbols (aim for ~200-250 words)
4. **RED_FLAGS**: Any misconceptions that were identified and corrected during the conversation

Return ONLY a valid JSON object with this exact structure:

{
  "legend": {
    "entity_id": "chosen_symbol",
    ...
  },
  "rules": [
    "Rule 1 text",
    "Rule 2 text",
    ...
  ],
  "script": "The full narrative script here...",
  "red_flags": [
    "Misconception 1",
    ...
  ]
}

IMPORTANT:
- Use the exact entity IDs from the entities list above
- Rules should be self-contained and use the symbols
- The script should be conversational and engaging
- If no misconceptions were corrected, use an empty array for red_flags
- Return ONLY the JSON, no additional text`;
}

/**
 * Build a prompt to validate the artifact against the topic pack
 * Returns a score between 0 and 1
 */
export function buildValidationPrompt(
  topicPack: TopicPack,
  legend: Record<string, string>,
  rules: string[],
  script: string
): string {
  return `Validate this metaphor map against the learning objectives.

=== TOPIC ===
${topicPack.topic}

=== REQUIRED TRUTHS ===
${topicPack.truths.map((t, i) => `${i + 1}. ${t}`).join('\n')}

=== MISCONCEPTIONS TO AVOID ===
${topicPack.misconceptions.map((m, i) => `${i + 1}. ${m}`).join('\n')}

=== MENTAL MODEL TESTS ===
${topicPack.tests.map((t, i) => `${i + 1}. ${t}`).join('\n')}

=== SUBMITTED ARTIFACT ===

Legend:
${Object.entries(legend).map(([k, v]) => `- ${k} → ${v}`).join('\n')}

Rules:
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Script:
${script}

=== TASK ===

Evaluate how well this metaphor map captures the required truths and avoids misconceptions.

Consider:
- Does the metaphor accurately represent each truth?
- Are any misconceptions present in the rules or script?
- Would the metaphor help answer the mental model tests?
- Is the mapping consistent and coherent?

Return ONLY a JSON object:

{
  "score": 0.85,
  "feedback": "Brief explanation of the score"
}

Score should be between 0.0 and 1.0, where:
- 0.9-1.0: Excellent, captures all truths accurately
- 0.7-0.89: Good, minor improvements possible
- 0.5-0.69: Adequate, some truths missing or unclear
- Below 0.5: Needs significant revision`;
}
