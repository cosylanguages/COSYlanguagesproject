/**
 * Plays a sound effect.
 * @param {string} soundName - The name of the sound (e.g., 'click', 'success', 'error', 'select').
 */
export function playSound(soundName) {
  const validSounds = ['click', 'success', 'error', 'select'];
  if (!validSounds.includes(soundName)) {
    console.warn(`Attempted to play an unknown sound: "${soundName}". Expected one of: ${validSounds.join(', ')}.`);
    return;
  }

  // The paths in the public folder are relative to the root.
  const audioPath = `/assets/sounds/${soundName}.mp3`;
  const audio = new Audio(audioPath);

  audio.play().catch(error => {
    // Log an error if the sound fails to play, but don't let it break the app.
    console.error(`Error playing sound "${soundName}" from path "${audioPath}":`, error);
  });
}
