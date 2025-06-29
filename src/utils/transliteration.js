// frontend/src/utils/transliteration.js

// Function to latinize Russian text
function latinizeRussian(text) {
  const russianToLatinMap = {
    'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v',
    'Г': 'G', 'г': 'g', 'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e',
    'Ё': 'YO', 'ё': 'yo', 'Ж': 'ZH', 'ж': 'zh', 'З': 'Z', 'з': 'z',
    'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n',
    'О': 'O', 'о': 'o', 'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's', 'Т': 'T', 'т': 't', 'У': 'U', 'у': 'u',
    'Ф': 'F', 'ф': 'f', 'Х': 'KH', 'х': 'kh', 'Ц': 'TS', 'ц': 'ts',
    'Ч': 'CH', 'ч': 'ch', 'Ш': 'SH', 'ш': 'sh', 'Щ': 'SHCH', 'щ': 'shch',
    'Ъ': '', 'ъ': '', // Hard sign often omitted or handled by context in some systems
    'Ы': 'Y', 'ы': 'y',
    'Ь': '', 'ь': '', // Soft sign often omitted or handled by context
    'Э': 'E', 'э': 'e', 'Ю': 'YU', 'ю': 'yu', 'Я': 'YA', 'я': 'ya'
  };
  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    latinizedText += russianToLatinMap[char] || char;
  }
  return latinizedText;
}

// Function to latinize Armenian text
function latinizeArmenian(text) {
  const simplerArmenianMap = {
    'Ա': 'A', 'Բ': 'B', 'Գ': 'G', 'Դ': 'D', 'Ե': 'YE', 'Զ': 'Z', 'Է': 'E', 'Ը': 'E',
    'Թ': 'T\'', 'Ժ': 'ZH', 'Ի': 'I', 'Լ': 'L', 'Խ': 'KH', 'Ծ': 'TS', 'Կ': 'K', 'Հ': 'H',
    'Ձ': 'DZ', 'Ղ': 'GH', 'Ճ': 'CH', 'Մ': 'M', 'Յ': 'Y', 'Ն': 'N', 'Շ': 'SH', 'Ո': 'VO',
    'Չ': 'CH\'', 'Պ': 'P', 'Ջ': 'J', 'Ռ': 'R', 'Ս': 'S', 'Վ': 'V', 'Տ': 'T', 'Ր': 'R',
    'Ց': 'TS\'', 'Ւ': 'V', 'Փ': 'P\'', 'Ք': 'K\'', 'Օ': 'O', 'Ֆ': 'F',
    'ա': 'a', 'բ': 'b', 'գ': 'g', 'դ': 'd', 'ե': 'ye', 'զ': 'z', 'է': 'e', 'ը': 'e',
    'թ': 't\'', 'ժ': 'zh', 'ի': 'i', 'լ': 'l', 'խ': 'kh', 'ծ': 'ts', 'կ': 'k', 'հ': 'h',
    'ձ': 'dz', 'ղ': 'gh', 'ճ': 'ch', 'մ': 'm', 'յ': 'y', 'ն': 'n', 'շ': 'sh', 'ո': 'vo',
    'չ': 'ch\'', 'պ': 'p', 'ջ': 'j', 'ռ': 'r', 'ս': 's', 'վ': 'v', 'տ': 't', 'ր': 'r',
    'ց': 'ts\'', 'ւ': 'v', 'փ': 'p\'', 'ք': 'k\'', 'օ': 'o', 'ֆ': 'f',
    'և': 'ev'
  };
  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    latinizedText += simplerArmenianMap[char] || char;
  }
  return latinizedText;
}

// Function to latinize Greek text
function latinizeGreek(text) {
  const greekToLatinMap = {
    // Uppercase
    'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'TH',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'CH', 'Ψ': 'PS', 'Ω': 'O',
    // Lowercase
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    // Accented Uppercase
    'Ά': 'A', 'Έ': 'E', 'Ή': 'I', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ώ': 'O',
    // Accented Lowercase
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    // Lowercase with diaeresis
    'ϊ': 'i', 'ϋ': 'y',
    // Accented with diaeresis
    'ΐ': 'i', 'ΰ': 'y',
    // Digraphs
    'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'ου': 'ou', 'γγ': 'ng', 'γκ': 'gk', 'γχ': 'nch', 'τσ': 'ts',
    'μπ': 'b', 'ντ': 'd',
    // Uppercase Digraphs
    'ΑΙ': 'AI', 'ΕΙ': 'EI', 'ΟΙ': 'OI', 'ΟΥ': 'OU', 'ΓΓ': 'NG', 'ΓΚ': 'GK', 'ΓΧ': 'NCH', 'ΤΣ': 'TS',
    'ΜΠ': 'B', 'ΝΤ': 'D',
    // Accented Digraphs
    'άι': 'ai', 'έι': 'ei', 'όι': 'oi', 'ού': 'ou'
  };

  let latinizedText = "";
  let i = 0;
  while (i < text.length) {
    let foundDigraph = false;
    // Check for 2-character digraphs
    if (i + 1 < text.length) {
      const digraph = text.substring(i, i + 2);
      if (greekToLatinMap.hasOwnProperty(digraph)) {
        latinizedText += greekToLatinMap[digraph];
        i += 2;
        foundDigraph = true;
      }
    }
    
    if (!foundDigraph) {
      const char = text[i];
      if (greekToLatinMap.hasOwnProperty(char)) {
        latinizedText += greekToLatinMap[char];
      } else {
        latinizedText += char; // Append original character if not in map
      }
      i += 1;
    }
  }
  return latinizedText;
}

// Add other specific latinization functions here if needed (e.g., Tatar, Bashkir)
// For now, they will fall through in getLatinization

/**
 * Main latinization dispatcher function.
 * @param {string} text - The text to latinize.
 * @param {string} languageIdentifier - The COSYlanguages internal code (e.g., 'ТАКОЙрусский').
 * @returns {string} The latinized text or original text if no specific latinizer is found.
 */
export function getLatinization(text, languageIdentifier) {
  if (!text || typeof text.trim !== 'function' || text.trim() === '') {
    return text;
  }

  const normalizedIdentifier = (languageIdentifier || '').toLowerCase();

  if (normalizedIdentifier.includes('русский') || normalizedIdentifier.includes('russian') || languageIdentifier === 'ТАКОЙрусский') {
    return latinizeRussian(text);
  } else if (normalizedIdentifier.includes('ελληνικά') || normalizedIdentifier.includes('greek') || languageIdentifier === 'ΚΟΖΥελληνικά') {
    return latinizeGreek(text);
  } else if (normalizedIdentifier.includes('հայկական') || normalizedIdentifier.includes('armenian') || languageIdentifier === 'ԾՈՍՅհայկական') {
    return latinizeArmenian(text);
  }
  // Add more language conditions here:
  // else if (languageIdentifier === 'COSYtatarça') { return latinizeTatar(text); }
  // else if (languageIdentifier === 'COSYbashkort') { return latinizeBashkir(text); }
  
  return text; // Return original text if no specific latinizer matches
}
