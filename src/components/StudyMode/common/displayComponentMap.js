// Centralized map for display components

// Import Display Block Components
// DEV_NOTE: Ensure these paths are correct from this new location.
// Assuming they are relative to the 'src' directory or correctly resolved.
import TextBlock from '../DisplayBlocks/TextBlock';
import MCQMultipleBlock from '../DisplayBlocks/MCQMultipleBlock';
// Add other display components here as they are created and used.
// e.g., import VideoBlock from '../DisplayBlocks/VideoBlock';

export const displayComponentMap = {
  'reading/text': TextBlock,
  'utility/note': TextBlock, // Assuming TextBlock can render notes too
  'comprehension/mcq-multiple': MCQMultipleBlock,
  // 'media/video': VideoBlock, // Example for future addition
  // Add other mappings here as DisplayBlocks are created/confirmed
  // The keys should match the 'typePath' of the lesson blocks.
};
