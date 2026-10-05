export interface SkinTheme {
  id: string;
  name: string;
  description: string;
  backgroundGradient: string;
  boardBackground: string;
  boardBorder: string;
  gridLineColor: string;
  emptyCellColor: string;
  primaryAccent: string;
  crownColor: string;
}

export const SKIN_THEMES: SkinTheme[] = [
  {
    id: 'Classic Navy',
    name: 'Classic Navy',
    description: 'Signature Block Blast deep royal blue canvas with midnight board',
    backgroundGradient: 'linear-gradient(180deg, #2C4C87 0%, #203763 50%, #17294A 100%)',
    boardBackground: '#10172B',
    boardBorder: '#1B2A4E',
    gridLineColor: '#1A2645',
    emptyCellColor: '#141D33',
    primaryAccent: '#2979FF',
    crownColor: '#FFD700'
  },
  {
    id: 'Neon Night',
    name: 'Neon Night',
    description: 'Cyberpunk dark violet canvas with electric neon glow',
    backgroundGradient: 'linear-gradient(180deg, #1B0B3B 0%, #100624 50%, #090314 100%)',
    boardBackground: '#120526',
    boardBorder: '#3D147A',
    gridLineColor: '#250C4E',
    emptyCellColor: '#180733',
    primaryAccent: '#D500F9',
    crownColor: '#FFD700'
  },
  {
    id: 'Wooden Timber',
    name: 'Wooden Timber',
    description: 'Warm rich mahogany wood tones with polished brass accents',
    backgroundGradient: 'linear-gradient(180deg, #332014 0%, #24160E 50%, #180E09 100%)',
    boardBackground: '#1A0F0A',
    boardBorder: '#4A2D1B',
    gridLineColor: '#2E1A11',
    emptyCellColor: '#20130C',
    primaryAccent: '#FFB300',
    crownColor: '#FFD700'
  },
  {
    id: 'Candy Wonderland',
    name: 'Candy Wonderland',
    description: 'Sweet pastel strawberry swirl with confectionary sparkles',
    backgroundGradient: 'linear-gradient(180deg, #421836 0%, #2B0E23 50%, #190714 100%)',
    boardBackground: '#1E0A1A',
    boardBorder: '#5E1E4E',
    gridLineColor: '#381430',
    emptyCellColor: '#260D21',
    primaryAccent: '#FF4081',
    crownColor: '#FFD700'
  },
  {
    id: 'Mystic Forest',
    name: 'Mystic Forest',
    description: 'Lush emerald canopy with ancient moss stone grid',
    backgroundGradient: 'linear-gradient(180deg, #0F2E1B 0%, #091C10 50%, #051009 100%)',
    boardBackground: '#0A1C12',
    boardBorder: '#1B4E30',
    gridLineColor: '#133622',
    emptyCellColor: '#0D2418',
    primaryAccent: '#00E676',
    crownColor: '#FFD700'
  },
  {
    id: 'Volcanic Magma',
    name: 'Volcanic Magma',
    description: 'Smoldering dark obsidian stone with fiery molten cracks',
    backgroundGradient: 'linear-gradient(180deg, #331010 0%, #210909 50%, #140505 100%)',
    boardBackground: '#170606',
    boardBorder: '#521717',
    gridLineColor: '#330E0E',
    emptyCellColor: '#210909',
    primaryAccent: '#FF3D00',
    crownColor: '#FFD700'
  }
];

export function getSkinTheme(idOrName: string): SkinTheme {
  const found = SKIN_THEMES.find(
    (t) => t.id.toLowerCase() === idOrName.toLowerCase() || t.name.toLowerCase() === idOrName.toLowerCase()
  );
  return found || SKIN_THEMES[0];
}
