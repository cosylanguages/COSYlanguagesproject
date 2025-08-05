const audioPool = {};
const MAX_POOL_SIZE = 5; // Max 5 instances of the same sound at once

/**
 * Plays a sound effect using an object pool to reuse Audio objects.
 * @param {string} soundName - The name of the sound (e.g., 'click', 'success', 'error', 'select').
 */
export function playSound(soundName) {
  const validSounds = ['click', 'success', 'error', 'select'];
  if (!validSounds.includes(soundName)) {
    console.warn(`Attempted to play an unknown sound: "${soundName}". Expected one of: ${validSounds.join(', ')}.`);
    return;
  }

  if (!audioPool[soundName]) {
    audioPool[soundName] = [];
  }

  let audio = audioPool[soundName].find(a => a.paused || a.ended);

  if (audio) {
    audio.currentTime = 0; // Rewind to the start
  } else if (audioPool[soundName].length < MAX_POOL_SIZE) {
    const audioPath = `/assets/sounds/${soundName}.mp3`;
    audio = new Audio(audioPath);
    audioPool[soundName].push(audio);
  } else {
    // Optional: If pool is full, just play the first one again
    audio = audioPool[soundName][0];
    audio.currentTime = 0;
    console.log(`Audio pool for "${soundName}" is full. Reusing an existing instance.`);
  }

  if (audio) {
    audio.play().catch(error => {
      console.error(`Error playing sound "${soundName}":`, error);
    });
  }
}
