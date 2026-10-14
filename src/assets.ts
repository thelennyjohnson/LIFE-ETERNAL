export const assets = {
  heroBackground: '/assets/hero-bg.jpg',
  heroCharacter: '/assets/hero-character.png',
  logoEmblem: '/assets/logo-emblem.png',
  textureTile: '/assets/texture-tile.png',
  iconSheet: '/assets/icon-sheet.png',
  kingdoms: Array.from({ length: 12 }, (_, index) => `/assets/kingdom-${index + 1}.jpg`),
  characters: Array.from({ length: 8 }, (_, index) => `/assets/character-${index + 1}.png`),
} as const;
