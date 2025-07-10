// Fichier de données de traduction factice pour débloquer la compilation
// Ajoutez ici vos traductions réelles au besoin

const translations = {
  COSYenglish: { // Assuming keys match language identifiers used elsewhere
    greeting: "Hello",
    navHome: "Home",
    navFreestyle: "Freestyle",
    navStudyMode: "Study",
    selectPractice: "🧭 Choose Your Practice:",
    selectDay: "🗓️ Select Day(s):",
    mainHeading: "COSYlanguages",
    vocabulary: "🔠 Vocabulary",
    grammar: "🧩 Grammar",
    sentenceSkills: "📝 Sentence Skills", // New Category
    reading: "📚 Reading",
    speaking: "🗣️ Speaking",
    writing: "✍️ Writing",
    listening: "🎧 Listening",
    practiceAll: "🔁 Practice All",
    // Sub-practice items
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Conjugation Practice"
        // Add other grammar sub-items as needed
      },
      sentenceSkills: { // New
        sentence_unscramble_exercise: "Sentence Unscramble"
      }
      // Add other categories like vocabulary, reading etc.
    },
    sentenceUnscramble: { // For the exercise itself
      title: "Unscramble the Sentence",
      translationLabel: "Meaning:",
      hintLabel: "Hint:",
      dropWordsHere: "Click words below to build the sentence here...",
      clickToRemoveWord: "Click to remove word"
    },
    controls: {
        checkAnswer: "Check Answer",
        revealAnswer: "Reveal Answer",
        nextExercise: "Next Exercise",
        tryAgain: "Try Again"
    },
    feedback: {
        correct: "Correct!",
        incorrect: "Incorrect, try again."
    },
    loadingExercise: "Loading exercise..."
    // ... other English translations
  },
  COSYfrench: { // Assuming keys match language identifiers used elsewhere
    greeting: "Bonjour",
    navHome: "Accueil",
    navFreestyle: "Mode Libre",
    navStudyMode: "Mode Étude",
    selectPractice: "🧭 Choisissez Votre Pratique :",
    selectDay: "🗓️ Sélectionnez le(s) Jour(s) :",
    mainHeading: "COSYlangues",
    vocabulary: "🔠 Vocabulaire",
    grammar: "🧩 Grammaire",
    sentenceSkills: "📝 Compétences de Phrase", // New Category
    reading: "📚 Lecture",
    speaking: "🗣️ Expression Orale",
    writing: "✍️ Expression Écrite",
    listening: "🎧 Écoute",
    practiceAll: "🔁 Tout Pratiquer",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Pratique de Conjugaison"
      },
      sentenceSkills: { // New
        sentence_unscramble_exercise: "Remettre la Phrase en Ordre"
      }
    },
    sentenceUnscramble: {
      title: "Remettre la Phrase en Ordre",
      translationLabel: "Signification :",
      hintLabel: "Indice :",
      dropWordsHere: "Cliquez sur les mots ci-dessous pour construire la phrase ici...",
      clickToRemoveWord: "Cliquez pour enlever le mot"
    },
    controls: {
        checkAnswer: "Vérifier la Réponse",
        revealAnswer: "Révéler la Réponse",
        nextExercise: "Exercice Suivant",
        tryAgain: "Réessayer"
    },
    feedback: {
        correct: "Correct !",
        incorrect: "Incorrect, réessayez."
    },
    loadingExercise: "Chargement de l'exercice..."
    // ... other French translations
  }
  // Add other languages as needed
};

export default translations;
