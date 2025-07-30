/**
 * Generates a unique DOM element ID for a given block.
 * @param {string} blockId - The unique identifier for the block (e.g., block.id, block.title).
 * @param {number} [index] - An optional index for blocks that might appear multiple times.
 * @returns {string} The generated DOM element ID.
 */
export const getBlockElementId = (blockId, index) => {
  const safeId = String(blockId).replace(/[^a-zA-Z0-9-_]/g, '_');
  return `block-${safeId}${index !== undefined ? `-${index}` : ''}`;
};
