import { a0_french_vocabulary } from './vocabulary/dictionary/fr/a0.js';
import { a1_french_vocabulary } from './vocabulary/dictionary/fr/a1.js';
import { a0_armenian_vocabulary } from './vocabulary/dictionary/hy/a0.js';
import { a0_bashkir_vocabulary } from './vocabulary/dictionary/ba/a0.js';
import { a0_breton_vocabulary } from './vocabulary/dictionary/br/a0.js';
import { a0_german_vocabulary } from './vocabulary/dictionary/de/a0.js';
import { a0_greek_vocabulary } from './vocabulary/dictionary/el/a0.js';
import { a0_english_vocabulary } from './vocabulary/dictionary/en/a0.js';
import { a0_spanish_vocabulary } from './vocabulary/dictionary/es/a0.js';
import { a0_italian_vocabulary } from './vocabulary/dictionary/it/a0.js';
import { a0_georgian_vocabulary } from './vocabulary/dictionary/ka/a0.js';
import { a0_portuguese_vocabulary } from './vocabulary/dictionary/pt/a0.js';
import { a0_russian_vocabulary } from './vocabulary/dictionary/ru/a0.js';
import { a0_tatar_vocabulary } from './vocabulary/dictionary/tt/a0.js';

const transformed_en_opposites = a0_english_vocabulary.Opposites.map(item => ({
  term: item.term,
  latinisation: '',
  pronunciation: '',
  partOfSpeech: 'phrase',
  definition: `Opposite of ${item.opposite}`,
  example: '',
  level: 'a0',
  notes: '',
}));

const transformed_en_words = Object.entries(a0_english_vocabulary.Words).flatMap(([level, words]) =>
  words.map(word => ({
    term: word,
    latinisation: '',
    pronunciation: '',
    partOfSpeech: 'word',
    definition: '',
    example: '',
    level: `a0-words-${level}`,
    notes: '',
  }))
);

export const dictionary = {
  fr: {
    ...a0_french_vocabulary,
    ...a1_french_vocabulary,
  },
  hy: {
    ...a0_armenian_vocabulary,
  },
  ba: {
    ...a0_bashkir_vocabulary,
  },
  br: {
    ...a0_breton_vocabulary,
  },
  de: {
    ...a0_german_vocabulary,
  },
  el: {
    ...a0_greek_vocabulary,
  },
  en: {
    "Basic words": a0_english_vocabulary["Basic words"],
    "Opposites": transformed_en_opposites,
    "Words": transformed_en_words,
  },
  es: {
    ...a0_spanish_vocabulary,
  },
  it: {
    ...a0_italian_vocabulary,
  },
  ka: {
    ...a0_georgian_vocabulary,
  },
  pt: {
    ...a0_portuguese_vocabulary,
  },
  ru: {
    ...a0_russian_vocabulary,
  },
  tt: {
    ...a0_tatar_vocabulary,
  },
};
