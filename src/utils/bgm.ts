const BGM_FILES: Record<string, string> = {
  village: '/assets/audio/stage1-backsong.mp3',
  forest: '/assets/audio/stage2-backsong.mp3',
  castle: '/assets/audio/stage3-backsongs.mp3',
  catacombs: '/assets/audio/stage4-backsong.mp3',
  cathedral: '/assets/audio/cathedral-ambience.mp3',
  mountain: '/assets/audio/dark-fog.mp3',
  battlefield: '/assets/audio/stage5-backsong.mp3',
  ending: '/assets/audio/Ending-Backsong.mp3',
  epilogue: '/assets/audio/Ending-Backsong.mp3',
  prologue: '/assets/audio/cutschene-song.mp3',
};

let currentAudio: HTMLAudioElement | null = null;
let currentTrack: string | null = null;
let musicVolume = 70;
let masterVolume = 80;

function applyVolume() {
  if (currentAudio) {
    currentAudio.volume = (musicVolume / 100) * (masterVolume / 100);
  }
}

export function playBGM(track: string) {
  const src = BGM_FILES[track];
  if (!src) return;

  // If same audio file is already playing, just update track name (no restart)
  if (currentAudio && currentAudio.src.endsWith(src)) {
    currentTrack = track;
    return;
  }

  if (currentTrack === track) return;

  stopBGM();

  currentAudio = new Audio(src);
  currentAudio.loop = true;
  applyVolume();
  currentAudio.play().catch(() => {});
  currentTrack = track;
}

export function stopBGM() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  currentTrack = null;
}

export function setBGMVolume(music: number, master: number) {
  musicVolume = music;
  masterVolume = master;
  applyVolume();
}
