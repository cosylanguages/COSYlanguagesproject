export const priceData = {
  english: {
    standard: { 15: 5, 30: 10, 50: 20, 80: 30, 110: 40 },
    start: { 15: 38, 30: 76, 50: 152, 80: 228, 110: 304 },
    progress: { 15: 72, 30: 144, 50: 288, 80: 432, 110: 576 },
    maestro: { 15: 136, 30: 272, 50: 544, 80: 816, 110: 1088 },
  },
  french: {
    standard: { 15: 10, 30: 15, 50: 25, 80: 35, 110: 45 },
    start: { 15: 76, 30: 116, 50: 180, 80: 266, 110: 242 },
    progress: { 15: 144, 30: 126, 50: 360, 80: 504, 110: 468 },
    maestro: { 15: 272, 30: 680, 50: 650, 80: 532, 110: 124 },
  },
  italian: {
    standard: { 15: 10, 30: 15, 50: 25, 80: 35, 110: 45 },
    start: { 15: 76, 30: 114, 50: 190, 80: 266, 110: 342 },
    progress: { 15: 144, 30: 216, 50: 360, 80: 504, 110: 648 },
    maestro: { 15: 272, 30: 408, 50: 680, 80: 952, 110: 1224 },
  },
};

export const packageDiscounts = {
  standard: 0,
  start: 5,
  progress: 10,
  maestro: 15,
};

export const exchangeRates = {
  usd: 1.08,
  rub: 100.50,
};

export const packageNames = {
  standard: 'Standard',
  start: 'Start',
  progress: 'Progress',
  maestro: 'Maestro',
};

export const languageNames = {
  english: 'English',
  french: 'French',
  italian: 'Italian',
};

export const durationNames = {
  15: '15 min Conversation',
  30: '30 min Conversation',
  50: '50 min Basic',
  80: '80 min Basic/Exams',
  110: '110 min Exams',
};
