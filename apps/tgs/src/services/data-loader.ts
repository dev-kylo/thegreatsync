/**
 * Data loader service for realms, topics, and topic orders
 * Loads static JSON files from the data directory
 */

import fs from 'fs';
import path from 'path';
import { Realm, TopicPack, TopicOrder } from '../types/session';

// Path to data directory (relative to compiled dist/ directory in production)
const DATA_DIR = path.join(__dirname, '../data');

/**
 * Cache for loaded data to avoid repeated file reads
 */
const cache = {
  realms: new Map<string, Realm>(),
  topics: new Map<string, TopicPack>(),
  topicOrders: new Map<string, TopicOrder>(),
};

/**
 * Load a realm definition by ID
 * @param realmId - The realm identifier (e.g., 'fantasy')
 * @returns The realm definition
 * @throws Error if realm file not found or invalid JSON
 */
export function loadRealm(realmId: string): Realm {
  // Check cache first
  if (cache.realms.has(realmId)) {
    return cache.realms.get(realmId)!;
  }

  const filePath = path.join(DATA_DIR, 'realms', `${realmId}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Realm not found: ${realmId}`);
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const realm: Realm = JSON.parse(fileContent);

    // Validate required fields
    if (!realm.id || !realm.name || !Array.isArray(realm.symbol_inventory) || !Array.isArray(realm.hints)) {
      throw new Error(`Invalid realm structure in ${realmId}.json`);
    }

    // Cache and return
    cache.realms.set(realmId, realm);
    return realm;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in realm file: ${realmId}`);
    }
    throw error;
  }
}

/**
 * Load a topic pack by topic ID
 * @param topicId - The topic identifier (e.g., 'js_closure')
 * @returns The topic pack
 * @throws Error if topic file not found or invalid JSON
 */
export function loadTopicPack(topicId: string): TopicPack {
  // Check cache first
  if (cache.topics.has(topicId)) {
    return cache.topics.get(topicId)!;
  }

  const filePath = path.join(DATA_DIR, 'topics', `${topicId}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Topic pack not found: ${topicId}`);
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const topicPack: TopicPack = JSON.parse(fileContent);

    // Validate required fields
    if (!topicPack.topic ||
        !Array.isArray(topicPack.entities) ||
        !Array.isArray(topicPack.truths) ||
        !Array.isArray(topicPack.misconceptions) ||
        !Array.isArray(topicPack.tests)) {
      throw new Error(`Invalid topic pack structure in ${topicId}.json`);
    }

    // Cache and return
    cache.topics.set(topicId, topicPack);
    return topicPack;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in topic pack file: ${topicId}`);
    }
    throw error;
  }
}

/**
 * Load the topic order for a realm
 * @param realmId - The realm identifier
 * @returns Array of topic IDs in learning order
 * @throws Error if topic order file not found or invalid
 */
export function loadTopicOrder(realmId: string): TopicOrder {
  // Check cache first
  if (cache.topicOrders.has(realmId)) {
    return cache.topicOrders.get(realmId)!;
  }

  const filePath = path.join(DATA_DIR, 'topic-orders', `${realmId}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Topic order not found for realm: ${realmId}`);
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const topicOrder: TopicOrder = JSON.parse(fileContent);

    // Validate it's an array of strings
    if (!Array.isArray(topicOrder) || !topicOrder.every(item => typeof item === 'string')) {
      throw new Error(`Invalid topic order structure in ${realmId}.json`);
    }

    // Cache and return
    cache.topicOrders.set(realmId, topicOrder);
    return topicOrder;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in topic order file: ${realmId}`);
    }
    throw error;
  }
}

/**
 * Get the next topic for a user in a realm
 * @param realmId - The realm identifier
 * @param finishedTopics - Array of topic IDs already completed
 * @returns The next topic ID, or null if all topics completed
 */
export function getNextTopic(realmId: string, finishedTopics: string[]): string | null {
  const topicOrder = loadTopicOrder(realmId);
  const finishedSet = new Set(finishedTopics);

  // Find first topic not in finished set
  for (const topicId of topicOrder) {
    if (!finishedSet.has(topicId)) {
      return topicId;
    }
  }

  // All topics completed
  return null;
}

/**
 * List all available realm IDs
 * @returns Array of realm IDs
 */
export function listRealms(): string[] {
  const realmsDir = path.join(DATA_DIR, 'realms');

  if (!fs.existsSync(realmsDir)) {
    return [];
  }

  return fs.readdirSync(realmsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * Clear all caches (useful for testing or hot-reloading)
 */
export function clearCache(): void {
  cache.realms.clear();
  cache.topics.clear();
  cache.topicOrders.clear();
}
