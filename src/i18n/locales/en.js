// Traductions anglaises
const enTranslations = {
  languageNameNative: 'English', // Added native name
  dayNames: {
      1: "Basic words",
      2: "Who are you?",
      3: "My family",
      4: "Numbers",
      5: "Is it good or bad?"
  },
  chooseLanguage: '🌎 Choose Your Language:',
  chooseDay: '📅 Choose Your Day:',
  dayFrom: 'Day From:',
  dayTo: 'Day To:',
  selectPractice: '🧭 Choose Your Practice:',
  vocabulary: '🔠 Vocabulary',
  grammar: '🧩 Grammar',
  reading: '📚 Reading',
  speaking: '🗣️ Speaking',
  writing: '✍️ Writing',
  practiceAll: '🔄 Practice All',
  randomWord: '🔤 Random Word',
  randomImage: '🖼️ Random Image',
  listening: '🎧 Listening',
  gender: '✨ Gender',
  verbs: '🧩 Verbs',
  possessives: '🔠 Possessives',
  story: '📖 Story',
  interestingFacts: '🔄 Interesting facts',
  question: '❓ Question',
  monologue: '💬 Monologue',
  rolePlay: '🎭 Role Play',
  storytelling: '📜 Storytelling',
  diary: '📔 Diary',
  practiceAllVocab: '🔄 Practice All Vocabulary',
  practiceAllGrammar: '🔄 Practice All Grammar',
  practiceAllSpeaking: '🔄 Practice All Speaking',
  selectDay: 'Select a day',
  selectLang: 'Select a language',
  check: 'Check',
  trySentence: 'Try to use this word in a sentence!',
  randomImageQ1: 'What is this?',
  randomImageQ2a: 'Who is this?',
  randomImageQ2b: 'What is this?',
  verbDay2: 'To be',
  verbDay3: 'To have',
  true: 'True',
  false: 'False',
  correct: 'Correct!',
  wrong: 'Wrong!',
  means: 'means',
  chooseCorrect: 'Which is correct?',
  listen: 'Listen',
  noImages: 'No images available!',
  chooseVerbForm: 'Choose the correct verb form:',
  chooseGender: 'Choose the word for the article:',
  noVerbs: 'No verbs available!',
  noVerbForms: 'No verb forms!',
  noGender: 'No gender data!',
  funFacts: [
    'Did you know? Spaced repetition boosts memory! 🧠',
    'Mnemonic: Make a silly story with your word!',
    'Practice a little every day for best results!',
    'Visualize the word in a funny scene!',
    'Say it out loud with a different accent!',
    'Teach the word to someone else!',
    'Use gestures or draw the word!',
    'Recall is stronger if you test yourself after a break!'
  ],

  // Keys for FreestyleInterfaceView and general layout
  "mainHeading": "COSYlanguages",
  "studyModeButtonLabel": "🚀 Study Mode",
  "pinIncorrectMessage": "Incorrect PIN. Access denied.",

  // Keys for DaySelectorFreestyle (ensuring they are actual keys now)
  "titles.chooseYourDay": "📅 Choose Your Day(s)",
  "daySelector.singleDay": "Single Day",
  "daySelector.dayRange": "Day Range",
  "daySelector.selectDay": "Select Day",
  "daySelector.from": "From:",
  "daySelector.to": "To:",
  "daySelector.selectStartDay": "Start",
  "daySelector.selectEndDay": "End",

  // Keys for Layout.js
  "navHome": "Home",
  "navFreestyle": "Freestyle",
  "navStudyMode": "Study",
  "welcomeUser": "Welcome, {name}!",
  "loggingOut": "Logging out...",
  "btnLogout": "Logout",
  "btnLogin": "Login",

  // Keys for messages in FreestyleInterfaceView (already used with defaults, good to have them explicitly)
  "selectLang": "Please select a language to begin.",
  // "selectDay": "Please select day(s).", // Already covered by daySelector.selectDay, but used differently in message context
  "selectPractice": "Please select a practice category.",
  "selectSubPractice": "Please select a specific exercise.",

  // Study Mode Specific
  "studyMode.mainHeading": "COSYlanguages - Study Mode",
  "studyMode.chooseLanguageLabel": "🌎 Choose Your Language:",
  "studyMode.chooseRoleLabel": "👤 Choose Your Role:",
  "studyMode.studentRole": "🧑‍🎓 Student",
  "studyMode.teacherRole": "🧑‍🏫 Teacher",
  "studyMode.welcomeMessage": "Please select your role to begin.",
  "studyMode.studentDashboardHeading": "Student Dashboard",
  "studyMode.studentDashboardComingSoon": "Create your own flashcard sets for further practice (Coming Soon).",
  "studyMode.teacherDashboardHeading": "Teacher Dashboard",
  "studyMode.teacherDashboardComingSoon": "Create, edit, and add material (Coming Soon).",

  // For LessonSectionsPanel and ToolsPanel
  "studyMode.lessonSectionsTitle": "Lessons & Sections",
  "studyMode.lessonSectionsComingSoon": "(Lesson navigation will appear here)",
  "studyMode.lesson1": "Lesson 1: Greetings",
  "studyMode.lesson2": "Lesson 2: Numbers",
  "studyMode.lesson3": "Lesson 3: Family",
  "studyMode.toolsTitle": "Tools",
  "studyMode.toolNotes": "📝 Notes",
  "studyMode.toolIrregularVerbs": "📚 Irregular Verbs",
  "studyMode.toolConjugations": "📚 Conjugations", // New key for ToolsPanel
  "studyMode.toolDictionary": "📖 Dictionary (Soon)",

  // For NotesPanel.js
  "notesSavedSuccess": "Notes saved!",
  "notesSaveError": "Could not save notes.",
  "myNotesTitle": "My Notes",
  "closeNotesBtnAria": "Close Notes",
  "typeNotesPlaceholder": "Type your notes here...",
  "saveNotesBtn": "Save Notes",

  // For TeacherDashboard.js & TemplateTypeSelectionModal.js
  "addContentBlockBtn": "+ Add Content Block",
  "teacherDashboard.noBlocksMessage": "No content blocks added yet. Click \"Add Content Block\" to start building your lesson.",
  "configureBtn": "Configure",
  "removeBtn": "Remove",
  "selectTemplateTypeTitle": "Select Content Block Type",
  "closeBtn": "Close",
  "configureBlockTitle": "Configure {blockName}",
  "configureBlockComingSoon": "Configuration options for this block type will appear here.",
  "closeConfigBtn": "Close Configuration",

  // Example Template Type Category Names (keys are lowercased and spaces replaced with underscores)
  "upload_picture": "Upload picture",
  "audio_and_video": "Audio and video",
  "words_and_gaps": "Words and gaps",
  "tests": "Tests",
  "select_the_correct_answer": "Select the correct answer",
  "arrange_in_the_correct_order": "Arrange in the correct order",
  "working_with_text": "Working with text",
  "other": "Other",

  // Example Template Type Names (keys are lowercased and spaces replaced with underscores)
  "image_in_carousel": "Image in carousel",
  "gif_animation": "GIF animation",
  "other_things/activities_which_are_related_to_this": "Other things/activities which are related to this", // Generic key from template
  "video": "Video",
  "audio": "Audio",
  "voice_recording": "Voice recording",
  "move_the_word_to_the_gap_(fill_gaps_from_box)": "Move the word to the gap (Fill Gaps from Box)",
  "enter_the_word_in_the_blank_(fill_gaps_with_hint)": "Enter the word in the blank (Fill Gaps with Hint)",
  "select_the_word_form_for_the_gap_(choose_correct_option)": "Select the word form for the gap (Choose Correct Option)",
  "test_without_a_timer": "Test without a timer",
  "timed_test": "Timed test",
  "true,_false,_not_stated": "True, false, not stated",
  "multiple_choice_(single_answer)": "Multiple choice (single answer)",
  "multiple_choice_(multiple_answers)": "Multiple choice (multiple answers)",
  "sentence_of_words_(word_order)": "Sentence of words (Word Order)",
  "sort_by_columns": "Sort by columns",
  "put_the_text_in_order_(paragraph_order)": "Put the text in order (Paragraph Order)",
  "match_words": "Match words",
  "article": "Article",
  "essay": "Essay",
  "text": "Text",
  "wordlist": "Wordlist",
  "note_(structured_note)": "Note (Structured Note)",
  "link": "Link",

  // For TextBlock.js (if not already present or for consistency)
  "pronounceTitle": "Pronounce title",
  "pronounceContent": "Pronounce content",
  "noTextContentProvided": "No text content provided.",

  // --- SubPractice Vocabulary Buttons ---
  "subPractice.vocabulary.randomWord": "🔤 Random Word",
  "subPractice.vocabulary.randomImage": "🖼️ Random Image",
  "subPractice.vocabulary.matchImageWord": "🖼️ Match Image & Word",
  "subPractice.vocabulary.listening": "🎧 Listening",
  "subPractice.vocabulary.typeOpposite": "⇄ Type the Opposite",
  "subPractice.vocabulary.matchOpposites": "⇄ Match Opposites",
  "subPractice.vocabulary.buildWord": "🔡 Build a Word",
  "subPractice.vocabulary.fillInTheBlanks": "📝 Fill in the Blanks",
  "subPractice.vocabulary.speakAndTranslate": "🗣️ Speak and Translate",
  "subPractice.vocabulary.writeAndTranslate": "✍️ Write and Translate",
  "subPractice.vocabulary.audioFlashcards": "🎧 Audio Flashcards",
  "subPractice.vocabulary.phraseBuilder": "🛠️ Phrase Builder",
  "subPractice.vocabulary.conversationPractice": "💬 Conversation Practice",
  "subPractice.vocabulary.rolePlay": "🎭 Role Play",
  "subPractice.vocabulary.storytelling": "📜 Storytelling",
  "subPractice.vocabulary.diary": "📔 Diary",
  "subPractice.vocabulary.practiceAll": "🔄 Practice All Vocabulary",
  "subPractice.vocabulary.selectDay": "Select a day",
  "subPractice.vocabulary.check": "Check",
  "subPractice.vocabulary.trySentence": "Try to use this word in a sentence!",
  "subPractice.vocabulary.noImages": "No images available!",
  "subPractice.vocabulary.noVerbs": "No verbs available!",
  "subPractice.vocabulary.noVerbForms": "No verb forms!",
  "subPractice.vocabulary.noGender": "No gender data!",
  "subPractice.vocabulary.funFacts": [
    'Did you know? Spaced repetition boosts memory! 🧠',
    'Mnemonic: Make a silly story with your word!',
    'Practice a little every day for best results!',
    'Visualize the word in a funny scene!',
    'Say it out loud with a different accent!',
    'Teach the word to someone else!',
    'Use gestures or draw the word!',
    'Recall is stronger if you test yourself after a break!'
  ],

  // For IrregularVerbsTool.js
  "loadingIrregularVerbs": "Loading irregular verbs...",
  "irregularVerbsFileError": "Irregular verbs data not found for {lang}.", // Kept for other potential errors, though 404 is now handled differently
  "irregularVerbsLoadHttpError": "Failed to load irregular verbs data: {status}.",
  "irregularVerbsNotAvailableForLang": "Irregular verbs data is not yet available for {lang}.",
  "irregularVerbsToolTitle": "Irregular Verbs List",
  "conjugationsToolTitle": "Conjugations List", // New key for IrregularVerbsTool title
  "searchVerbsPlaceholder": "Search verbs...",
  "noIrregularVerbsFound": "No irregular verbs found for this language or search term.",
  "verbHeaderBase": "Base",
  "verbHeaderPastSimple": "Past Simple",
  "verbHeaderPastParticiple": "Past Participle",
  "verbHeaderTranslation": "Translation",

  // For ExerciseControls.js in Freestyle mode (and potentially other places)
  "buttons": {
    "check": "✔️ Check",
    "revealAnswer": "🤫 Reveal Answer",
    "help": "💡 Hint", // Used for Hint button in ExerciseControls
    "randomize": "🎲 Randomize",
    "next": "➡️ Next Exercise",
    "previous": "⬅️ Previous",
    "done": "Done",
    "submitAnswer": "Submit Answer",
    "stopRecording": "Stop",
    // Add other common button texts here if they exist in other lang files under 'buttons'
    // For example, from it.js:
    "newExercise": "New Exercise",
    "newWord": "New Word",
    "back": "Back",
    "continue": "Continue",
    "reset": "Reset",
    "close": "Close",
    "translate": "Translate"
    // Note: 'help' from it.js was 'Aiuto', here used for 'Hint'. If a separate 'Help' is needed, add key.
  },

  // Keys for ExerciseHost.js
  "exercises.placeholder.title": "{name} Exercise",
  "exercises.placeholder.message1": "This is a placeholder for the <em>{name}</em> exercise.",
  "exercises.placeholder.message2": "Implementation is pending.",
  "errors.exerciseHost.title": "Exercise Error",
  "errors.exerciseHost.notFound": "Exercise type \"<strong>{subPracticeType}</strong>\" not found or not yet implemented.",
  "errors.exerciseHost.suggestion": "Please check the mapping in ExerciseHost.js or select another exercise.",
  "exercises.selectExerciseHint": "Please select an exercise type above.",

  // Keys for specific exercises UI elements
  "altText.identifyImage": "Identify this image",
  "tooltips.pronounceWord": "Pronounce \"{word}\""
};

export default enTranslations;
