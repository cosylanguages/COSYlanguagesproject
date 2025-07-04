// Traductions bretonnes
const brTranslations = {
  languageNameNative: 'Brezhoneg', // Added native name
  dayNames: {
    1: "Gerioù diazez",
    2: "Piv out?",
    3: "Ma familh",
    4: "Niveroù",
    5: "Mat pe fall?"
  },
  chooseLanguage: '🌎 Dibab ho yezh:',
  chooseDay: '📅 Dibab an deiz:',
  dayFrom: 'Eus an deiz:',
  dayTo: "D'ar deiz:",
  selectPractice: '🧭 Dibab ar prantad:',
  vocabulary: '🔠 Geriaoueg',
  grammar: '🧩 Yezhadur',
  reading: '📚 Lenn',
  speaking: '🗣️ Komz',
  writing: '✍️ Skrivañ',
  practiceAll: '🔄 Ober an holl',
  randomWord: '🔤 Ger dre zegouezh',
  randomImage: '🖼️ Skeudenn dre zegouezh',
  listening: '🎧 Selaou',
  gender: '✨ Reizh',
  verbs: '🧩 Verbioù',
  possessives: '🔠 Percʼhennañ',
  story: '📖 Istor',
  interestingFacts: '🔄 Faktiou dedennus',
  question: '❓ Goulenn',
  monologue: '💬 Monolog',
  rolePlay: "🎭 C'hoari roll",
  storytelling: '📜 Kontadenn',
  diary: '📔 Deizlevr',
  practiceAllVocab: '🔄 Geriaoueg a-bezh',
  practiceAllGrammar: '🔄 Yezhadur a-bezh',
  practiceAllSpeaking: '🔄 Komz a-bezh',
  selectDay: 'Dibab un deiz',
  selectLang: 'Dibab ur yezh',
  check: 'Gwiriañ',
  trySentence: 'Klask implij ar ger-mañ en ur frazenn!',
  randomImageQ1: 'Petra eo?',
  randomImageQ2a: 'Piv eo?',
  randomImageQ2b: 'Petra eo?',
  verbDay2: 'Bezañ',
  verbDay3: 'Kaout',
  true: 'Gwir',
  false: 'Fals',
  correct: 'Reizh!',
  wrong: 'Fals!',
  means: 'a dalv',
  chooseCorrect: 'Peseurt hini zo reizh?',
  listen: 'Selaou',
  noImages: 'Skeudennoù ebet!',
  chooseVerbForm: 'Dibab stumm reizh ar verb:',
  chooseGender: 'Dibab ar ger evit ar reizh:',
  noVerbs: 'Verbioù ebet!',
  noVerbForms: 'Stummoù verb ebet!',
  noGender: 'Titouroù reizh ebet!',
  funFacts: [
    'Gouzout a rit? Ar pleustr dre astenn a wella ar memor! 🧠',
    'Mnemonik: ijinit un istor fentus gant ar ger!',
    'Pleustriñ un tamm bemdez evit ar gwellañ disocʼhoù!',
    'Imajinait ar ger e-barzh un darvoud fentus!',
    'Lavarit anezhañ gant un ton disheñvel!',
    'Deskit ar ger d’unan all!',
    'Implijit jestroù pe tresit ar ger!',
    'Gwellocʼh eo testañ goude un ehan!'
  ],
  feedbackPleaseType: 'Skrivit ho respont a-us',
  feedbackNotQuite: '❌ N’eo ket reizh. Ar respont reizh eo:',
  checkMatchesButtonLabel: 'Gwiriañ an emdroadurioù',
  feedbackCorrectMatch: '✅ Emdroadur reizh!',
  feedbackNotAMatch: '❌ N’eo ket reizh. Klaskit adarre!',
  feedbackShowingCorrectMatches: 'Diskouezet eo an holl emdroadurioù reizh...',
  infinitiveOf: 'Infinitiv',
  conjugateFor: 'Kemmañ evit',
  forPronoun: 'evit',
  matchVerbPronounTitle: 'Kevreet pep verb gant e rener',
  feedbackGoodMatch: '✅ Kevreadenn vat!',
  feedbackNotCompatible: '❌ N’eo ket kevreet. Klaskit adarre!',
  feedbackAllMatchesCompleted: 'Echu eo an holl gevreadennoù posupl!',
  feedbackCorrectWellDone: '✅ Reizh! Mat eo!',
  feedbackNotQuiteCorrectOrder: '❌ N’eo ket reizh. An urzh reizh eo:',
  continuePromptText: 'Klikit war "Kenderc’hel" evit ar c’hinnig da-heul',
  findOppositeButtonLabel: '⇄ Kavout an enep',
  buildWordButtonLabel: '🔡 Sav ar ger',
  typeTheOppositePlaceholder: 'Skrivit an enep...',
  matchOppositesTitle: 'Kevreet pep ger gant e enep',
  buildWordTitle: 'Sav ar ger:',
  typeTheWordPlaceholder: 'Skrivit ar ger...',
  feedbackNotQuiteTryAgain: '❌ N’eo ket reizh. Klaskit adarre!',
  identifyImageTitle: 'Petra eo?',
  matchImageWordTitle: 'Kevreet ar skeudenn gant ar ger',
  transcribePlaceholder: 'Skrivit ar pezh a glevit...',
  matchSoundWordTitle: 'Kevreet ar son gant ar ger:',
  feedbackNotCorrectTryAgain: '❌ Fazi. Klaskit adarre!',
  noOppositeFound: 'Enep ger ebet kavet',
  pageTitle: 'COSYlanguages',
  mainHeading: 'COSYlanguages',
  selectYourLanguagePrompt: 'Ho yezh',
  selectDayPrompt: 'Deiz',
  levelUpToast: '🎉 Live nevez! Bremañ emaoc’h war live {level}!',
  statsXp: 'XP:',
  statsLevel: 'Live:',
  statsStreak: 'Steud:',
  buttons: {
    check: 'Gwiriañ',
    newExercise: 'Kinnig nevez',
    newWord: 'Ger nevez',
    revealAnswer: 'Diskouez ar respont',
    randomize: '🎲',
    previous: 'Kent',
    next: 'Da-heul',
    back: 'Distreiñ',
    continue: 'Kenderc’hel',
    reset: 'Adkregiñ',
    help: 'Skoazell',
    close: 'Serriñ',
    translate: 'Treiñ',
    done: 'Graet',
    stopRecording: 'Paouez',
    submitAnswer: 'Kas ar respont'
  },
  errors: {
    selectLangDay: 'Dibabit ar yezh hag an deiz da gentañ',
    unexpectedError: 'Fazi dic’hortoz.',
    pronunciationError: 'N’haller ket distagañ ar ger.',
    soundPlayError: 'N’haller ket seniñ ar son.'
  },
  micPermissionDenied: 'Aotreadur ar mikro nac’het. Roit aotre e kefridi ho merdeer.',
  speechRecognitionNotSupported: 'N’eo ket skoret an anaoudegezh dre gomz gant ar merdeer-mañ.',
  recordingInProgress: 'Enrolladur e-kas...',
  errorStartingRecognition: 'Fazi loc’hañ an anaoudegezh',
  noSpeechDetected: 'Komz ebet kavet. Klaskit adarre.',
  hint_firstLetterIs: 'Aluzenn: al lizherenn gentañ eo',
  noSpecificHint: 'Klaskit kevreañ unan eus an elfennoù chomet.',
  noMoreHints: 'Aluzenn ebet ken.',
  hint_nextWordIs: 'Aluzenn: ar ger da-heul eo',
  hint_firstWordIs: 'Aluzenn: ar ger kentañ eo',
  noMoreHintsSlotsFull: 'Leun eo an holl lec’hioù. Gwiriañ ar respont pe adkregiñ.',
  hint_correctLetterForNextSlot: 'Aluzenn: al lizherenn <strong>%s</strong> a ya er lec’h goullo da-heul. He deus ur liv disheñvel.',
  hint_tryMatchingThis: 'Aluzenn: klaskit kevreañ ar ger-mañ.',
  loading: {
    oppositesExercise: 'O kargañ ar c’hinnig enep...',
    imageExercise: 'O kargañ ar c’hinnig skeudenn...',
    transcribeExercise: 'O kargañ ar c’hinnig enrollañ...',
    buildWordExercise: 'O kargañ ar c’hinnig "Sav ar ger"...'
  },
  aria: {
    genderExercise: 'Prantad reizh',
    matchArticlesWords: 'Kevreañ ar gerioù hag an anvioù',
    randomWordExercise: 'Kinnig ger dre zegouezh',
    oppositesExercise: 'Kinnig enep',
    matchOppositesExercise: 'Kevreañ gerioù enep',
    typeYourAnswer: 'Skrivit ho respont',
    checkAnswer: 'Gwiriañ ar respont',
    newExercise: 'Kinnig nevez',
    findOpposite: 'Kavout an enep',
    buildWord: 'Sav ar ger',
    revealAnswer: 'Diskouez ar respont',
    newWord: 'Ger nevez',
    wordsColumn: 'Bann gerioù',
    oppositesColumn: 'Bann gerioù enep',
    articlesColumn: 'Bann anvioù',
    pronounceWord: 'Distagañ ar ger',
    nextWord: 'Ger da-heul',
    checkMatches: 'Gwiriañ an emdroadurioù',
    feedback: 'Evezhiadenn',
    randomize: 'Kinnig dre zegouezh',
    randomWord: 'Ger dre zegouezh',
    randomImage: 'Skeudenn dre zegouezh',
    listening: 'Selaou',
    practiceAll: 'Ober an holl',
    gender: 'Reizh',
    verbs: 'Verbioù',
    possessives: 'Percʼhennañ',
    story: 'Istor',
    interestingFacts: 'Faktiou dedennus',
    question: 'Goulenn',
    monologue: 'Monolog',
    rolePlay: "C'hoari roll",
    storytelling: 'Kontadenn',
    diary: 'Deizlevr',
    practiceAllVocab: 'Geriaoueg a-bezh',
    practiceAllGrammar: 'Yezhadur a-bezh',
    practiceAllSpeaking: 'Komz a-bezh',
    articleAriaLabel: 'Anv:',
    wordAriaLabel: 'Ger:',
    oppositeArrowLabel: 'Bann enep',
    oppositeLabel: 'Enep',
    wordToPracticeLabel: 'Ger da bleustriñ',
    verbExerciseAriaLabel: 'Prantad verb',
    typeTheOpposite: 'Skrivit an enep',
    vocabularyOptions: 'Dibarzhioù geriaoueg',
    grammarOptions: 'Dibarzhioù yezhadur',
    readingOptions: 'Dibarzhioù lenn',
    speakingOptions: 'Dibarzhioù komz',
    writingOptions: 'Dibarzhioù skrivañ',
    playSound: 'Seniñ ar son',
    resetTiles: 'Adkregiñ gant an taolennoù'
  }
};

export default brTranslations;
