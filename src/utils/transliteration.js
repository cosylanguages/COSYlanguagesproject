/**
 * Latinizes Russian text.
 * @param {string} text - The Russian text to latinize.
 * @returns {string} The latinized text.
 */
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
    'Ъ': '', 'ъ': '',
    'Ы': 'Y', 'ы': 'y',
    'Ь': '', 'ь': '',
    'Э': 'E', 'э': 'e', 'Ю': 'YU', 'ю': 'yu', 'Я': 'YA', 'я': 'ya'
  };
  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    latinizedText += russianToLatinMap[char] || char;
  }
  return latinizedText;
}

/**
 * Latinizes Armenian text.
 * @param {string} text - The Armenian text to latinize.
 * @returns {string} The latinized text.
 */
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

/**
 * Latinizes Greek text.
 * @param {string} text - The Greek text to latinize.
 * @returns {string} The latinized text.
 */
function latinizeGreek(text) {
  const greekToLatinMap = {
    'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'TH',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'CH', 'Ψ': 'PS', 'Ω': 'O',
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    'Ά': 'A', 'Έ': 'E', 'Ή': 'I', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ώ': 'O',
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    'ϊ': 'i', 'ϋ': 'y',
    'ΐ': 'i', 'ΰ': 'y',
    'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'ου': 'ou', 'γγ': 'ng', 'γκ': 'gk', 'γχ': 'nch', 'τσ': 'ts',
    'μπ': 'b', 'ντ': 'd',
    'ΑΙ': 'AI', 'ΕΙ': 'EI', 'ΟΙ': 'OI', 'ΟΥ': 'OU', 'ΓΓ': 'NG', 'ΓΚ': 'GK', 'ΓΧ': 'NCH', 'ΤΣ': 'TS',
    'ΜΠ': 'B', 'ΝΤ': 'D',
    'άι': 'ai', 'έι': 'ei', 'όι': 'oi', 'ού': 'ou'
  };

  let latinizedText = "";
  let i = 0;
  while (i < text.length) {
    let foundDigraph = false;
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
        latinizedText += char;
      }
      i += 1;
    }
  }
  return latinizedText;
}

/**
 * The main latinization dispatcher function.
 * @param {string} text - The text to latinize.
 * @param {string} languageIdentifier - The COSYlanguages internal code (e.g., 'ТАКОЙрусский').
 * @returns {string} The latinized text, or the original text if no specific latinizer is found.
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

  return text;
}
