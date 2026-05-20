export const ATMOSPHERE_AUDIO_ZONES = {
  hero: { ambience: "sea-night", intensity: 0.85 },
  sponsors: { ambience: "crowd-soft", intensity: 0.45 },
  schedule: { ambience: "stage-distant", intensity: 0.55 },
  gallery: { ambience: "camera-haze", intensity: 0.35 },
};

export const getAtmosphereAudioCue = (sectionId) => (
  ATMOSPHERE_AUDIO_ZONES[sectionId] || { ambience: "sea-night", intensity: 0.25 }
);
