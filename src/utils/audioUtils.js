/**
 * Plays a sound effect.
 * @param {string} soundName - The name of the sound (e.g., 'click', 'success', 'error', 'select').
 *                             Assumes .mp3 files are in `public/assets/sounds/`.
 */
export function playSound(soundName) {
  const validSounds = ['click', 'success', 'error', 'select'];
  if (!validSounds.includes(soundName)) {
    console.warn(`Attempted to play an unknown sound: "${soundName}". Expected one of: ${validSounds.join(', ')}.`);
    return; 
  }

  // Paths in public folder are relative to the root
  const audioPath = `/assets/sounds/${soundName}.mp3`;
  const audio = new Audio(audioPath);
  
  audio.play().catch(error => {
    // Log error but don't let it break the app if sound fails (e.g., user hasn't interacted yet)
    console.error(`Error playing sound "${soundName}" from path "${audioPath}":`, error);
  });
}
