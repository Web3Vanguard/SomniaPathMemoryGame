export const playSound = (url: string) => {
  const audio = new Audio(url)
  audio.volume = 0.5
  return audio.play().catch((e) => {
    console.log('Audio play error:', e)
  })
}

export const sounds = {
  correct: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/946/946-preview.mp3',
  applause: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-applause-947.mp3',
  levelComplete: 'https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3',
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/2027/2027-preview.mp3',
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
}

