// This file contains the translation data for the application.
const translations = {
  en: {
    languageCode: "en",
    cosyName: "COSYenglish",
    greeting: "Hello",
    navHome: "Home",
    navFreestyle: "Freestyle",
    navStudyMode: "Study",
    navMyStudySets: "My Sets",
    navProgress: "Progress",
    navPersonalize: "Personalize",
    navInteractive: "Interactive",
    navCommunity: "Community",
    navStudyTools: "Study Tools",
    selectPractice: "🧭 Choose Your Practice:",
    selectDay: "🗓️ Select Day(s):",
    mainHeading: "COSYlanguages",
    loading: "Loading...",
    saving: "Saving...",
    cancel: "Cancel",
    editButton: "Edit",
    deleteButton: "Delete",
    auth: {
      loadingStatus: "Loading authentication status..."
    },
    vocabulary: "🔠 Vocabulary",
    grammar: "🧩 Grammar",
    reading: "📚 Reading",
    speaking: "🗣️ Speaking",
    writing: "✍️ Writing",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Conjugation Practice",
        sentence_unscramble_exercise: "Sentence Unscramble",
        fill_in_the_blanks_exercise: "Fill in the Blanks"
      },
      vocabulary: {
        vocabulary_random_word_image: "Random Word/Image",
        vocabulary_opposites_match: "Opposites/Match It",
        vocabulary_letters_scramble: "Letters",
        vocabulary_true_false: "True/False",
        vocabulary_listening: "Listening",
        vocabulary_practice_all: "Practice All"
      }
    },
    sentenceUnscramble: {
      title: "Unscramble the Sentence",
      translationLabel: "Meaning:",
      hintLabel: "Hint:",
      dropWordsHere: "Click words below to build the sentence here...",
      clickToRemoveWord: "Click to remove word"
    },
    fillInTheBlanks: {
      title: "Fill in the Blanks",
      translationLabel: "Meaning:",
      hintLabel: "Hint:",
      ariaLabelBlank: "Blank number {number}",
      answersShown: "Answers are shown above."
    },
    controls: {
        checkAnswer: "Check Answer",
        revealAnswer: "Reveal Answer",
        nextExercise: "Next Exercise",
        tryAgain: "Try Again",
        goBack: "Go Back"
    },
    feedback: {
        correct: "Correct!",
        incorrect: "Incorrect, try again."
    },
    loadingExercise: "Loading exercise...",
    loadingExercises: "Loading exercises...",
    errors: {
        loadDataError: "Failed to load data.",
        exerciseHost: {
            notFound: "Exercise type \"<strong>{subPracticeType}</strong>\" not found or not yet implemented.",
            title: "Exercise Error",
            suggestion: "Please check the mapping in ExerciseHost.js or select another exercise."
        }
    },
    exercises: {
        noDataForLanguage: "No exercises found for this language.",
        allCompleted: "All exercises completed! Resetting...",
        noExercisesAvailable: "No exercises available at the moment."
    },
    studySets: {
      myTitle: "My Study Sets",
      createNewSet: "Create New Set",
      noSetsFound: "No study sets found. Create one to get started!",
      itemsCount: "{count, plural, =0 {No items} one {# item} other {# items}}",
      language: "Lang",
      studyButton: "Study",
      confirmDelete: "Are you sure you want to delete the study set \"{setName}\"? This action cannot be undone.",
      deleteSuccess: "Study set \"{setName}\" deleted successfully.",
      deleteErrorNotFound: "Could not delete \"{setName}\". Set not found.",
      deleteErrorGeneric: "An error occurred while deleting \"{setName}\".",
      loadError: "Failed to load study sets.",
      navigateToCreate: "Functionality to create new set coming soon!",
      studySetFunctionality: "Study functionality coming soon!",
      editSetFunctionality: "Edit functionality coming soon!"
    },
    studySetEditor: {
      titleEdit: "Edit Study Set",
      titleCreate: "Create New Study Set",
      nameLabel: "Set Name:",
      namePlaceholder: "e.g., French Vocabulary Chapter 1",
      descriptionLabel: "Description (Optional):",
      descriptionPlaceholder: "A brief description of this set",
      languageCodeLabel: "Language Code:",
      saveChangesButton: "Save Changes",
      createSetButton: "Create Set",
      errorNotFound: "Study set not found.",
      loadError: "Failed to load study set for editing.",
      errorNameRequired: "Set name is required.",
      saveSuccess: "Study set \"{setName}\" saved successfully!",
      errorSaveGeneric: "Failed to save study set.",
      cancelled: "Operation cancelled."
    },
    flashcardEditor: {
      noSetId: "No study set ID provided.",
      setNotFound: "Study set not found.",
      loadError: "Failed to load study set for card editing.",
      confirmDeleteCard: "Are you sure you want to delete the card \"{term1}\"?",
      deleteCardSuccess: "Card deleted successfully.",
      deleteCardError: "Could not delete card.",
      errorTermsRequired: "Term 1 and Term 2 are required.",
      updateCardSuccess: "Card updated successfully.",
      addCardSuccess: "Card added successfully.",
      errorSavingCard: "Failed to save card.",
      editingTitle: "Editing Cards for: {setName}",
      formTitleEdit: "Edit Card",
      formTitleAdd: "Add New Card",
      term1Label: "Term 1 (e.g., Word/Phrase):",
      term2Label: "Term 2 (e.g., Translation/Definition):",
      imageURILabel: "Image URL (Optional):",
      audioURILabel: "Audio URL (Optional):",
      exampleSentenceLabel: "Example Sentence (Optional):",
      notesLabel: "Notes (Optional):",
      saveCardButton: "Save Card",
      addCardButton: "Add Card",
      cancelEditButton: "Cancel Edit",
      cardsListTitle: "Cards in this Set",
      noCardsYet: "No cards in this set yet. Add one above!",
      term1Display: "Term 1:",
      term2Display: "Term 2:",
      exampleDisplay: "Ex:",
      selectSetPrompt: "Select a study set to manage its cards.",
      doneButton: "Done Editing Cards",
      hasImage: "(has image)",
      hasAudio: "(has audio)"
    },
    myStudySetsPage: {
      title: "Manage Your Study Sets",
      backToList: "← Back to Set List",
      errorSetNotFoundForPlayer: "Could not find the set to study. It may have been deleted."
    },
    switchToStudyMode: "Study Mode",
    calculator: {
      intro: "Use this calculator to estimate the cost of your language lessons. Select a package, duration, and quantity to see the total price. Discounts are applied automatically for larger packages."
    }
  },
  fr: {
    languageCode: "fr",
    cosyName: "COSYfrançais",
    greeting: "Bonjour",
    navHome: "Accueil",
    navFreestyle: "Mode Libre",
    navStudyMode: "Mode Étude",
    navMyStudySets: "Mes Decks",
    navProgress: "Progrès",
    navPersonalize: "Personnaliser",
    navInteractive: "Interactif",
    navCommunity: "Communauté",
    navStudyTools: "Outils d'étude",
    selectPractice: "🧭 Choisissez Votre Pratique :",
    selectDay: "🗓️ Sélectionnez le(s) Jour(s) :",
    mainHeading: "COSYlangues",
    loading: "Chargement...",
    saving: "Enregistrement...",
    cancel: "Annuler",
    editButton: "Modifier",
    deleteButton: "Supprimer",
    auth: {
      loadingStatus: "Chargement du statut d'authentification..."
    },
    vocabulary: "🔠 Vocabulaire",
    grammar: "🧩 Grammaire",
    reading: "📚 Lecture",
    speaking: "🗣️ Expression Orale",
    writing: "✍️ Expression Écrite",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Pratique de Conjugaison",
        sentence_unscramble_exercise: "Remettre la Phrase en Ordre",
        fill_in_the_blanks_exercise: "Compléter les Trous"
      },
      vocabulary: {
        vocabulary_random_word_image: "Mot/Image Aléatoire",
        vocabulary_opposites_match: "Contraires/Associer",
        vocabulary_letters_scramble: "Lettres",
        vocabulary_true_false: "Vrai/Faux",
        vocabulary_listening: "Écoute",
        vocabulary_practice_all: "Tout Pratiquer"
      }
    },
    sentenceUnscramble: {
      title: "Remettre la Phrase en Ordre",
      translationLabel: "Signification :",
      hintLabel: "Indice :",
      dropWordsHere: "Cliquez sur les mots ci-dessous pour construire la phrase ici...",
      clickToRemoveWord: "Cliquez pour enlever le mot"
    },
     fillInTheBlanks: {
      title: "Compléter les Trous",
      translationLabel: "Signification :",
      hintLabel: "Indice :",
      ariaLabelBlank: "Espace {number}",
      answersShown: "Les réponses sont affichées ci-dessus."
    },
    controls: {
        checkAnswer: "Vérifier la Réponse",
        revealAnswer: "Révéler la Réponse",
        nextExercise: "Exercice Suivant",
        tryAgain: "Réessayer",
        goBack: "Retour"
    },
    feedback: {
        correct: "Correct !",
        incorrect: "Incorrect, réessayez."
    },
    loadingExercise: "Chargement de l'exercice...",
    loadingExercises: "Chargement des exercices...",
    errors: {
        loadDataError: "Échec du chargement des données.",
         exerciseHost: {
            notFound: "Type d'exercice \"<strong>{subPracticeType}</strong>\" non trouvé ou pas encore implémenté.",
            title: "Erreur d'Exercice",
            suggestion: "Veuillez vérifier le mappage dans ExerciseHost.js ou sélectionner un autre exercice."
        }
    },
    exercises: {
        noDataForLanguage: "Aucun exercice trouvé pour cette langue.",
        allCompleted: "Tous les exercices terminés ! Réinitialisation...",
        noExercisesAvailable: "Aucun exercice disponible pour le moment."
    },
    studySets: {
      myTitle: "Mes Decks d'Étude",
      createNewSet: "Créer un Nouveau Deck",
      noSetsFound: "Aucun deck d'étude trouvé. Créez-en un pour commencer !",
      itemsCount: "{count, plural, =0 {Aucun élément} one {# élément} other {# éléments}}",
      language: "Langue",
      studyButton: "Étudier",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer le deck d'étude \"{setName}\" ? Cette action est irréversible.",
      deleteSuccess: "Le deck d'étude \"{setName}\" a été supprimé avec succès.",
      deleteErrorNotFound: "Impossible de supprimer \"{setName}\". Deck non trouvé.",
      deleteErrorGeneric: "Une erreur s'est produite lors de la suppression de \"{setName}\".",
      loadError: "Échec du chargement des decks d'étude.",
      navigateToCreate: "La fonctionnalité pour créer un nouveau deck arrive bientôt !",
      studySetFunctionality: "La fonctionnalité d'étude arrive bientôt !",
      editSetFunctionality: "La fonctionnalité de modification arrive bientôt !"
    },
    studySetEditor: {
      titleEdit: "Modifier le Deck d'Étude",
      titleCreate: "Créer un Nouveau Deck d'Étude",
      nameLabel: "Nom du Deck :",
      namePlaceholder: "ex: Vocabulaire Français Chapitre 1",
      descriptionLabel: "Description (Optionnel) :",
      descriptionPlaceholder: "Une brève description de ce deck",
      languageCodeLabel: "Code Langue :",
      saveChangesButton: "Enregistrer les Modifications",
      createSetButton: "Créer le Deck",
      errorNotFound: "Deck d'étude non trouvé.",
      loadError: "Échec du chargement du deck pour modification.",
      errorNameRequired: "Le nom du deck est requis.",
      saveSuccess: "Deck d'étude \"{setName}\" enregistré avec succès !",
      errorSaveGeneric: "Échec de l'enregistrement du deck d'étude.",
      cancelled: "Opération annulée."
    },
    flashcardEditor: {
      noSetId: "Aucun ID de deck d'étude fourni.",
      setNotFound: "Deck d'étude non trouvé.",
      loadError: "Échec du chargement du deck pour la modification des fiches.",
      confirmDeleteCard: "Êtes-vous sûr de vouloir supprimer la fiche \"{term1}\" ?",
      deleteCardSuccess: "Fiche supprimée avec succès.",
      deleteCardError: "Impossible de supprimer la fiche.",
      errorTermsRequired: "Terme 1 et Terme 2 sont requis.",
      updateCardSuccess: "Fiche mise à jour avec succès.",
      addCardSuccess: "Fiche ajoutée avec succès.",
      errorSavingCard: "Échec de l'enregistrement de la fiche.",
      editingTitle: "Modification des fiches pour : {setName}",
      formTitleEdit: "Modifier la Fiche",
      formTitleAdd: "Ajouter une Nouvelle Fiche",
      term1Label: "Terme 1 (ex: Mot/Phrase) :",
      term2Label: "Terme 2 (ex: Traduction/Définition) :",
      imageURILabel: "URL de l'Image (Optionnel) :",
      audioURILabel: "URL de l'Audio (Optionnel) :",
      exampleSentenceLabel: "Phrase d'Exemple (Optionnel) :",
      notesLabel: "Notes (Optionnel) :",
      saveCardButton: "Enregistrer la Fiche",
      addCardButton: "Ajouter la Fiche",
      cancelEditButton: "Annuler la Modification",
      cardsListTitle: "Fiches dans ce Deck",
      noCardsYet: "Aucune fiche dans ce deck pour le moment. Ajoutez-en une ci-dessus !",
      term1Display: "Terme 1 :",
      term2Display: "Terme 2 :",
      exampleDisplay: "Ex :",
      selectSetPrompt: "Sélectionnez un deck d'étude pour gérer ses fiches.",
      doneButton: "Terminer la Modification des Fiches",
      hasImage: "(contient image)",
      hasAudio: "(contient audio)"
    },
    myStudySetsPage: {
      title: "Gérer Vos Decks d'Étude",
      backToList: "← Retour à la Liste des Decks",
      errorSetNotFoundForPlayer: "Impossible de trouver le deck à étudier. Il a peut-être été supprimé."
    },
    switchToStudyMode: "Mode Étude",
    calculator: {
      intro: "Utilisez ce calculateur pour estimer le coût de vos cours de langue. Sélectionnez un forfait, une durée et une quantité pour voir le prix total. Les réductions sont appliquées automatiquement pour les forfaits plus importants."
    }
  },
  it: {
    languageCode: "it",
    cosyName: "COSYitaliano",
    languageNameInEnglish: "Italian",
    languageNameNative: "Italiano",
    greeting: "Ciao",
    navHome: "Home",
    navFreestyle: "Freestyle",
    navStudyMode: "Studio",
    navMyStudySets: "I miei set",
    navProgress: "Progressi",
    navPersonalize: "Personalizza",
    navInteractive: "Interattivo",
    navCommunity: "Comunità",
    navStudyTools: "Strumenti di studio",
    selectPractice: "🧭 Scegli la tua pratica:",
    selectDay: "🗓️ Seleziona il/i giorno/i:",
    mainHeading: "COSYlingue",
    loading: "Caricamento...",
    saving: "Salvataggio...",
    cancel: "Annulla",
    editButton: "Modifica",
    deleteButton: "Elimina",
    auth: {
      loadingStatus: "Caricamento stato di autenticazione..."
    },
    vocabulary: "🔠 Vocabolario",
    grammar: "🧩 Grammatica",
    reading: "📚 Lettura",
    speaking: "🗣️ Conversazione",
    writing: "✍️ Scrittura",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Pratica di coniugazione",
        sentence_unscramble_exercise: "Riordina la frase",
        fill_in_the_blanks_exercise: "Completa gli spazi"
      },
      vocabulary: {
        vocabulary_random_word_image: "Parola/Immagine casuale",
        vocabulary_opposites_match: "Opposti/Abbina",
        vocabulary_letters_scramble: "Lettere",
        vocabulary_true_false: "Vero/Falso",
        vocabulary_listening: "Ascolto",
        vocabulary_practice_all: "Pratica tutto"
      }
    },
    sentenceUnscramble: {
      title: "Riordina la frase",
      translationLabel: "Significato:",
      hintLabel: "Suggerimento:",
      dropWordsHere: "Clicca le parole qui sotto per costruire la frase qui...",
      clickToRemoveWord: "Clicca per rimuovere la parola"
    },
    fillInTheBlanks: {
      title: "Completa gli spazi",
      translationLabel: "Significato:",
      hintLabel: "Suggerimento:",
      ariaLabelBlank: "Spazio numero {number}",
      answersShown: "Le risposte sono mostrate sopra."
    },
    controls: {
        checkAnswer: "Controlla la risposta",
        revealAnswer: "Rivela la risposta",
        nextExercise: "Prossimo esercizio",
        tryAgain: "Riprova",
        goBack: "Torna indietro"
    },
    feedback: {
        correct: "Corretto!",
        incorrect: "Sbagliato, riprova."
    },
    loadingExercise: "Caricamento esercizio...",
    loadingExercises: "Caricamento esercizi...",
    errors: {
        loadDataError: "Impossibile caricare i dati.",
        exerciseHost: {
            notFound: "Tipo di esercizio \"<strong>{subPracticeType}</strong>\" non trovato o non ancora implementato.",
            title: "Errore esercizio",
            suggestion: "Controlla il mapping in ExerciseHost.js o seleziona un altro esercizio."
        }
    },
    exercises: {
        noDataForLanguage: "Nessun esercizio trovato per questa lingua.",
        allCompleted: "Tutti gli esercizi completati! Reset in corso...",
        noExercisesAvailable: "Nessun esercizio disponibile al momento."
    },
    studySets: {
      myTitle: "I miei set di studio",
      createNewSet: "Crea nuovo set",
      noSetsFound: "Nessun set di studio trovato. Creane uno per iniziare!",
      itemsCount: "{count, plural, =0 {Nessun elemento} one {# elemento} other {# elementi}}",
      language: "Lingua",
      studyButton: "Studia",
      confirmDelete: "Sei sicuro di voler eliminare il set di studio \"{setName}\"? L'azione non può essere annullata.",
      deleteSuccess: "Set di studio \"{setName}\" eliminato con successo.",
      deleteErrorNotFound: "Impossibile eliminare \"{setName}\". Set non trovato.",
      deleteErrorGeneric: "Si è verificato un errore durante l'eliminazione di \"{setName}\".",
      loadError: "Impossibile caricare i set di studio.",
      navigateToCreate: "La funzionalità per creare un nuovo set sarà presto disponibile!",
      studySetFunctionality: "La funzionalità di studio sarà presto disponibile!",
      editSetFunctionality: "La funzionalità di modifica sarà presto disponibile!"
    },
    studySetEditor: {
      titleEdit: "Modifica set di studio",
      titleCreate: "Crea nuovo set di studio",
      nameLabel: "Nome del set:",
      namePlaceholder: "es. Vocabolario di francese Capitolo 1",
      descriptionLabel: "Descrizione (opzionale):",
      descriptionPlaceholder: "Una breve descrizione di questo set",
      languageCodeLabel: "Codice lingua:",
      saveChangesButton: "Salva modifiche",
      createSetButton: "Crea set",
      errorNotFound: "Set di studio non trovato.",
      loadError: "Impossibile caricare il set di studio per la modifica.",
      errorNameRequired: "Il nome del set è obbligatorio.",
      saveSuccess: "Set di studio \"{setName}\" salvato con successo!",
      errorSaveGeneric: "Impossibile salvare il set di studio.",
      cancelled: "Operazione annullata."
    },
    flashcardEditor: {
      noSetId: "Nessun ID del set di studio fornito.",
      setNotFound: "Set di studio non trovato.",
      loadError: "Impossibile caricare il set di studio per la modifica delle schede.",
      confirmDeleteCard: "Sei sicuro di voler eliminare la scheda \"{term1}\"?",
      deleteCardSuccess: "Scheda eliminata con successo.",
      deleteCardError: "Impossibile eliminare la scheda.",
      errorTermsRequired: "I termini 1 e 2 sono obbligatori.",
      updateCardSuccess: "Scheda aggiornata con successo.",
      addCardSuccess: "Scheda aggiunta con successo.",
      errorSavingCard: "Impossibile salvare la scheda.",
      editingTitle: "Modifica delle schede per: {setName}",
      formTitleEdit: "Modifica scheda",
      formTitleAdd: "Aggiungi nuova scheda",
      term1Label: "Termine 1 (es. Parola/Frase):",
      term2Label: "Termine 2 (es. Traduzione/Definizione):",
      imageURILabel: "URL immagine (opzionale):",
      audioURILabel: "URL audio (opzionale):",
      exampleSentenceLabel: "Frase di esempio (opzionale):",
      notesLabel: "Note (opzionale):",
      saveCardButton: "Salva scheda",
      addCardButton: "Aggiungi scheda",
      cancelEditButton: "Annulla modifica",
      cardsListTitle: "Schede in questo set",
      noCardsYet: "Nessuna scheda in questo set. Aggiungine una sopra!",
      term1Display: "Termine 1:",
      term2Display: "Termine 2:",
      exampleDisplay: "Es:",
      selectSetPrompt: "Seleziona un set di studio per gestire le sue schede.",
      doneButton: "Fine modifica schede",
      hasImage: "(ha immagine)",
      hasAudio: "(ha audio)"
    },
    myStudySetsPage: {
      title: "Gestisci i tuoi set di studio",
      backToList: "← Torna all'elenco dei set",
      errorSetNotFoundForPlayer: "Impossibile trovare il set da studiare. Potrebbe essere stato eliminato."
    },
    switchToStudyMode: "Modalità studio",
    calculator: {
      intro: "Usa questo calcolatore per stimare il costo delle tue lezioni di lingua. Seleziona un pacchetto, una durata e una quantità per vedere il prezzo totale. Gli sconti vengono applicati automaticamente per i pacchetti più grandi."
    }
  },
  es: {
    languageCode: "es",
    cosyName: "COSYespañol",
    languageNameInEnglish: "Spanish",
    languageNameNative: "Español",
    greeting: "Hola",
    navHome: "Inicio",
    navFreestyle: "Freestyle",
    navStudyMode: "Estudio",
    navMyStudySets: "Mis sets",
    navProgress: "Progreso",
    navPersonalize: "Personalizar",
    navInteractive: "Interactivo",
    navCommunity: "Comunidad",
    navStudyTools: "Herramientas de estudio",
    selectPractice: "🧭 Elige tu práctica:",
    selectDay: "🗓️ Selecciona día(s):",
    mainHeading: "COSYidiomas",
    loading: "Cargando...",
    saving: "Guardando...",
    cancel: "Cancelar",
    editButton: "Editar",
    deleteButton: "Eliminar",
    auth: {
      loadingStatus: "Cargando estado de autenticación..."
    },
    vocabulary: "🔠 Vocabulario",
    grammar: "🧩 Gramática",
    reading: "📚 Lectura",
    speaking: "🗣️ Expresión oral",
    writing: "✍️ Escritura",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Práctica de conjugación",
        sentence_unscramble_exercise: "Ordena la frase",
        fill_in_the_blanks_exercise: "Rellena los huecos"
      },
      vocabulary: {
        vocabulary_random_word_image: "Palabra/Imagen aleatoria",
        vocabulary_opposites_match: "Opuestos/Empareja",
        vocabulary_letters_scramble: "Letras",
        vocabulary_true_false: "Verdadero/Falso",
        vocabulary_listening: "Comprensión auditiva",
        vocabulary_practice_all: "Practicar todo"
      }
    },
    sentenceUnscramble: {
      title: "Ordena la frase",
      translationLabel: "Significado:",
      hintLabel: "Pista:",
      dropWordsHere: "Haz clic en las palabras de abajo para construir la frase aquí...",
      clickToRemoveWord: "Haz clic para eliminar la palabra"
    },
    fillInTheBlanks: {
      title: "Rellena los huecos",
      translationLabel: "Significado:",
      hintLabel: "Pista:",
      ariaLabelBlank: "Hueco número {number}",
      answersShown: "Las respuestas se muestran arriba."
    },
    controls: {
        checkAnswer: "Comprobar respuesta",
        revealAnswer: "Revelar respuesta",
        nextExercise: "Siguiente ejercicio",
        tryAgain: "Intentar de nuevo",
        goBack: "Volver"
    },
    feedback: {
        correct: "¡Correcto!",
        incorrect: "Incorrecto, inténtalo de nuevo."
    },
    loadingExercise: "Cargando ejercicio...",
    loadingExercises: "Cargando ejercicios...",
    errors: {
        loadDataError: "Error al cargar los datos.",
        exerciseHost: {
            notFound: "Tipo de ejercicio \"<strong>{subPracticeType}</strong>\" no encontrado o aún no implementado.",
            title: "Error de ejercicio",
            suggestion: "Por favor, comprueba el mapeo en ExerciseHost.js o selecciona otro ejercicio."
        }
    },
    exercises: {
        noDataForLanguage: "No se han encontrado ejercicios para este idioma.",
        allCompleted: "¡Todos los ejercicios completados! Reiniciando...",
        noExercisesAvailable: "No hay ejercicios disponibles en este momento."
    },
    studySets: {
      myTitle: "Mis sets de estudio",
      createNewSet: "Crear nuevo set",
      noSetsFound: "No se han encontrado sets de estudio. ¡Crea uno para empezar!",
      itemsCount: "{count, plural, =0 {Ningún elemento} one {# elemento} other {# elementos}}",
      language: "Idioma",
      studyButton: "Estudiar",
      confirmDelete: "¿Estás seguro de que quieres eliminar el set de estudio \"{setName}\"? Esta acción no se puede deshacer.",
      deleteSuccess: "Set de estudio \"{setName}\" eliminado correctamente.",
      deleteErrorNotFound: "No se pudo eliminar \"{setName}\". Set no encontrado.",
      deleteErrorGeneric: "Ocurrió un error al eliminar \"{setName}\".",
      loadError: "Error al cargar los sets de estudio.",
      navigateToCreate: "¡La funcionalidad para crear un nuevo set llegará pronto!",
      studySetFunctionality: "¡La funcionalidad de estudio llegará pronto!",
      editSetFunctionality: "¡La funcionalidad de edición llegará pronto!"
    },
    studySetEditor: {
      titleEdit: "Editar set de estudio",
      titleCreate: "Crear nuevo set de estudio",
      nameLabel: "Nombre del set:",
      namePlaceholder: "Ej: Vocabulario de francés Capítulo 1",
      descriptionLabel: "Descripción (opcional):",
      descriptionPlaceholder: "Una breve descripción de este set",
      languageCodeLabel: "Código de idioma:",
      saveChangesButton: "Guardar cambios",
      createSetButton: "Crear set",
      errorNotFound: "Set de estudio no encontrado.",
      loadError: "Error al cargar el set de estudio para editar.",
      errorNameRequired: "El nombre del set es obligatorio.",
      saveSuccess: "¡Set de estudio \"{setName}\" guardado correctamente!",
      errorSaveGeneric: "Error al guardar el set de estudio.",
      cancelled: "Operación cancelada."
    },
    flashcardEditor: {
      noSetId: "No se proporcionó ID del set de estudio.",
      setNotFound: "Set de estudio no encontrado.",
      loadError: "Error al cargar el set de estudio para la edición de tarjetas.",
      confirmDeleteCard: "¿Estás seguro de que quieres eliminar la tarjeta \"{term1}\"?",
      deleteCardSuccess: "Tarjeta eliminada correctamente.",
      deleteCardError: "No se pudo eliminar la tarjeta.",
      errorTermsRequired: "Los términos 1 y 2 son obligatorios.",
      updateCardSuccess: "Tarjeta actualizada correctamente.",
      addCardSuccess: "Tarjeta añadida correctamente.",
      errorSavingCard: "Error al guardar la tarjeta.",
      editingTitle: "Editando tarjetas para: {setName}",
      formTitleEdit: "Editar tarjeta",
      formTitleAdd: "Añadir nueva tarjeta",
      term1Label: "Término 1 (Ej: Palabra/Frase):",
      term2Label: "Término 2 (Ej: Traducción/Definición):",
      imageURILabel: "URL de la imagen (opcional):",
      audioURILabel: "URL del audio (opcional):",
      exampleSentenceLabel: "Frase de ejemplo (opcional):",
      notesLabel: "Notas (opcional):",
      saveCardButton: "Guardar tarjeta",
      addCardButton: "Añadir tarjeta",
      cancelEditButton: "Cancelar edición",
      cardsListTitle: "Tarjetas en este set",
      noCardsYet: "Aún no hay tarjetas en este set. ¡Añade una arriba!",
      term1Display: "Término 1:",
      term2Display: "Término 2:",
      exampleDisplay: "Ej:",
      selectSetPrompt: "Selecciona un set de estudio para gestionar sus tarjetas.",
      doneButton: "Finalizar edición de tarjetas",
      hasImage: "(tiene imagen)",
      hasAudio: "(tiene audio)"
    },
    myStudySetsPage: {
      title: "Gestiona tus sets de estudio",
      backToList: "← Volver a la lista de sets",
      errorSetNotFoundForPlayer: "No se pudo encontrar el set para estudiar. Puede que haya sido eliminado."
    },
    switchToStudyMode: "Modo estudio",
    calculator: {
      intro: "Utiliza esta calculadora para estimar el coste de tus clases de idiomas. Selecciona un paquete, una duración y una cantidad para ver el precio total. Los descuentos se aplican automáticamente para los paquetes más grandes."
    }
  },
  pt: {
    languageCode: "pt",
    cosyName: "COSYportuguês",
    languageNameInEnglish: "Portuguese",
    languageNameNative: "Português",
    greeting: "Olá",
    navHome: "Início",
    navFreestyle: "Freestyle",
    navStudyMode: "Estudo",
    navMyStudySets: "Meus conjuntos",
    navProgress: "Progresso",
    navPersonalize: "Personalizar",
    navInteractive: "Interativo",
    navCommunity: "Comunidade",
    navStudyTools: "Ferramentas de estudo",
    selectPractice: "🧭 Escolha sua prática:",
    selectDay: "🗓️ Selecione o(s) dia(s):",
    mainHeading: "COSYlínguas",
    loading: "Carregando...",
    saving: "Salvando...",
    cancel: "Cancelar",
    editButton: "Editar",
    deleteButton: "Excluir",
    auth: {
      loadingStatus: "Carregando status de autenticação..."
    },
    vocabulary: "🔠 Vocabulário",
    grammar: "🧩 Gramática",
    reading: "📚 Leitura",
    speaking: "🗣️ Expressão oral",
    writing: "✍️ Escrita",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Prática de conjugação",
        sentence_unscramble_exercise: "Desembaralhe a frase",
        fill_in_the_blanks_exercise: "Preencha as lacunas"
      },
      vocabulary: {
        vocabulary_random_word_image: "Palavra/Imagem aleatória",
        vocabulary_opposites_match: "Opostos/Combine",
        vocabulary_letters_scramble: "Letras",
        vocabulary_true_false: "Verdadeiro/Falso",
        vocabulary_listening: "Compreensão auditiva",
        vocabulary_practice_all: "Praticar tudo"
      }
    },
    sentenceUnscramble: {
      title: "Desembaralhe la frase",
      translationLabel: "Significado:",
      hintLabel: "Dica:",
      dropWordsHere: "Clique nas palavras abaixo para construir a frase aqui...",
      clickToRemoveWord: "Clique para remover a palavra"
    },
    fillInTheBlanks: {
      title: "Preencha as lacunas",
      translationLabel: "Significado:",
      hintLabel: "Dica:",
      ariaLabelBlank: "Lacuna número {number}",
      answersShown: "As respostas são exibidas acima."
    },
    controls: {
        checkAnswer: "Verificar resposta",
        revealAnswer: "Revelar resposta",
        nextExercise: "Próximo exercício",
        tryAgain: "Tentar novamente",
        goBack: "Voltar"
    },
    feedback: {
        correct: "Correto!",
        incorrect: "Incorreto, tente novamente."
    },
    loadingExercise: "Carregando exercício...",
    loadingExercises: "Carregando exercícios...",
    errors: {
        loadDataError: "Falha ao carregar dados.",
        exerciseHost: {
            notFound: "Tipo de exercício \"<strong>{subPracticeType}</strong>\" não encontrado ou ainda não implementado.",
            title: "Erro de exercício",
            suggestion: "Por favor, verifique o mapeamento em ExerciseHost.js ou selecione outro exercício."
        }
    },
    exercises: {
        noDataForLanguage: "Nenhum exercício encontrado para este idioma.",
        allCompleted: "Todos os exercícios concluídos! Reiniciando...",
        noExercisesAvailable: "Nenhum exercício disponível no momento."
    },
    studySets: {
      myTitle: "Meus conjuntos de estudo",
      createNewSet: "Criar novo conjunto",
      noSetsFound: "Nenhum conjunto de estudo encontrado. Crie um para começar!",
      itemsCount: "{count, plural, =0 {Nenhum item} one {# item} other {# itens}}",
      language: "Idioma",
      studyButton: "Estudar",
      confirmDelete: "Tem certeza de que deseja excluir o conjunto de estudo \"{setName}\"? Esta ação não pode ser desfeita.",
      deleteSuccess: "Conjunto de estudo \"{setName}\" excluído com sucesso.",
      deleteErrorNotFound: "Não foi possível excluir \"{setName}\". Conjunto não encontrado.",
      deleteErrorGeneric: "Ocorreu um erro ao excluir \"{setName}\".",
      loadError: "Falha ao carregar os conjuntos de estudo.",
      navigateToCreate: "A funcionalidade para criar um novo conjunto estará disponível em breve!",
      studySetFunctionality: "A funcionalidade de estudo estará disponível em breve!",
      editSetFunctionality: "A funcionalidade de edição estará disponível em breve!"
    },
    studySetEditor: {
      titleEdit: "Editar conjunto de estudo",
      titleCreate: "Criar novo conjunto de estudo",
      nameLabel: "Nome do conjunto:",
      namePlaceholder: "Ex: Vocabulário de francês Capítulo 1",
      descriptionLabel: "Descrição (opcional):",
      descriptionPlaceholder: "Uma breve descrição deste conjunto",
      languageCodeLabel: "Código do idioma:",
      saveChangesButton: "Salvar alterações",
      createSetButton: "Criar conjunto",
      errorNotFound: "Conjunto de estudo não encontrado.",
      loadError: "Falha ao carregar o conjunto de estudo para edição.",
      errorNameRequired: "O nome do conjunto é obrigatório.",
      saveSuccess: "Conjunto de estudo \"{setName}\" salvo com sucesso!",
      errorSaveGeneric: "Falha ao salvar o conjunto de estudo.",
      cancelled: "Operação cancelada."
    },
    flashcardEditor: {
      noSetId: "Nenhum ID de conjunto de estudo fornecido.",
      setNotFound: "Conjunto de estudo não encontrado.",
      loadError: "Falha ao carregar o conjunto de estudo para edição de cartões.",
      confirmDeleteCard: "Tem certeza de que deseja excluir o cartão \"{term1}\"?",
      deleteCardSuccess: "Cartão excluído com sucesso.",
      deleteCardError: "Não foi possível excluir o cartão.",
      errorTermsRequired: "Os termos 1 e 2 são obrigatórios.",
      updateCardSuccess: "Cartão atualizado com sucesso.",
      addCardSuccess: "Cartão adicionado com sucesso.",
      errorSavingCard: "Falha ao salvar o cartão.",
      editingTitle: "Editando cartões para: {setName}",
      formTitleEdit: "Editar cartão",
      formTitleAdd: "Adicionar novo cartão",
      term1Label: "Termo 1 (Ex: Palavra/Frase):",
      term2Label: "Termo 2 (Ex: Tradução/Definição):",
      imageURILabel: "URL da imagem (opcional):",
      audioURILabel: "URL do áudio (opcional):",
      exampleSentenceLabel: "Frase de exemplo (opcional):",
      notesLabel: "Notas (opcional):",
      saveCardButton: "Salvar cartão",
      addCardButton: "Adicionar cartão",
      cancelEditButton: "Cancelar edição",
      cardsListTitle: "Cartões neste conjunto",
      noCardsYet: "Ainda não há cartões neste conjunto. Adicione um acima!",
      term1Display: "Termo 1:",
      term2Display: "Termo 2:",
      exampleDisplay: "Ex:",
      selectSetPrompt: "Selecione um conjunto de estudo para gerenciar seus cartões.",
      doneButton: "Concluir edição de cartões",
      hasImage: "(tem imagem)",
      hasAudio: "(tem áudio)"
    },
    myStudySetsPage: {
      title: "Gerencie seus conjuntos de estudo",
      backToList: "← Voltar para a lista de conjuntos",
      errorSetNotFoundForPlayer: "Não foi possível encontrar o conjunto para estudar. Ele pode ter sido excluído."
    },
    switchToStudyMode: "Modo de estudo",
    calculator: {
      intro: "Use esta calculadora para estimar o custo das suas aulas de idiomas. Selecione um pacote, duração e quantidade para ver o preço total. Os descontos são aplicados automaticamente para pacotes maiores."
    }
  },
  de: {
    languageCode: "de",
    cosyName: "COSYdeutsch",
    languageNameInEnglish: "German",
    languageNameNative: "Deutsch",
    greeting: "Hallo",
    navHome: "Startseite",
    navFreestyle: "Freestyle",
    navStudyMode: "Lernmodus",
    navMyStudySets: "Meine Sets",
    navProgress: "Fortschritt",
    navPersonalize: "Personalisieren",
    navInteractive: "Interaktiv",
    navCommunity: "Gemeinschaft",
    navStudyTools: "Lernwerkzeuge",
    selectPractice: "🧭 Wähle deine Übung:",
    selectDay: "🗓️ Wähle Tag(e):",
    mainHeading: "COSYsprachen",
    loading: "Wird geladen...",
    saving: "Wird gespeichert...",
    cancel: "Abbrechen",
    editButton: "Bearbeiten",
    deleteButton: "Löschen",
    auth: {
      loadingStatus: "Authentifizierungsstatus wird geladen..."
    },
    vocabulary: "🔠 Wortschatz",
    grammar: "🧩 Grammatik",
    reading: "📚 Lesen",
    speaking: "🗣️ Sprechen",
    writing: "✍️ Schreiben",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Konjugationsübung",
        sentence_unscramble_exercise: "Satz neu ordnen",
        fill_in_the_blanks_exercise: "Lückentext"
      },
      vocabulary: {
        vocabulary_random_word_image: "Zufälliges Wort/Bild",
        vocabulary_opposites_match: "Gegensätze/Zuordnen",
        vocabulary_letters_scramble: "Buchstaben",
        vocabulary_true_false: "Richtig/Falsch",
        vocabulary_listening: "Hörverstehen",
        vocabulary_practice_all: "Alles üben"
      }
    },
    sentenceUnscramble: {
      title: "Satz neu ordnen",
      translationLabel: "Bedeutung:",
      hintLabel: "Hinweis:",
      dropWordsHere: "Klicke auf die Wörter unten, um den Satz hier zu bilden...",
      clickToRemoveWord: "Klicke, um das Wort zu entfernen"
    },
    fillInTheBlanks: {
      title: "Lückentext",
      translationLabel: "Bedeutung:",
      hintLabel: "Hinweis:",
      ariaLabelBlank: "Lücke Nummer {number}",
      answersShown: "Die Antworten werden oben angezeigt."
    },
    controls: {
        checkAnswer: "Antwort prüfen",
        revealAnswer: "Antwort aufdecken",
        nextExercise: "Nächste Übung",
        tryAgain: "Erneut versuchen",
        goBack: "Zurück"
    },
    feedback: {
        correct: "Richtig!",
        incorrect: "Falsch, versuche es erneut."
    },
    loadingExercise: "Übung wird geladen...",
    loadingExercises: "Übungen werden geladen...",
    errors: {
        loadDataError: "Daten konnten nicht geladen werden.",
        exerciseHost: {
            notFound: "Übungstyp \"<strong>{subPracticeType}</strong>\" nicht gefunden oder noch nicht implementiert.",
            title: "Übungsfehler",
            suggestion: "Bitte überprüfe das Mapping in ExerciseHost.js oder wähle eine andere Übung."
        }
    },
    exercises: {
        noDataForLanguage: "Keine Übungen für diese Sprache gefunden.",
        allCompleted: "Alle Übungen abgeschlossen! Wird zurückgesetzt...",
        noExercisesAvailable: "Im Moment sind keine Übungen verfügbar."
    },
    studySets: {
      myTitle: "Meine Lernsets",
      createNewSet: "Neues Set erstellen",
      noSetsFound: "Keine Lernsets gefunden. Erstelle eines, um loszulegen!",
      itemsCount: "{count, plural, =0 {Keine Elemente} one {# Element} other {# Elemente}}",
      language: "Sprache",
      studyButton: "Lernen",
      confirmDelete: "Möchtest du das Lernset \"{setName}\" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      deleteSuccess: "Lernset \"{setName}\" erfolgreich gelöscht.",
      deleteErrorNotFound: "Konnte \"{setName}\" nicht löschen. Set nicht gefunden.",
      deleteErrorGeneric: "Beim Löschen von \"{setName}\" ist ein Fehler aufgetreten.",
      loadError: "Lernsets konnten nicht geladen werden.",
      navigateToCreate: "Die Funktion zum Erstellen eines neuen Sets wird in Kürze verfügbar sein!",
      studySetFunctionality: "Die Lernfunktion wird in Kürze verfügbar sein!",
      editSetFunctionality: "Die Bearbeitungsfunktion wird in Kürze verfügbar sein!"
    },
    studySetEditor: {
      titleEdit: "Lernset bearbeiten",
      titleCreate: "Neues Lernset erstellen",
      nameLabel: "Set-Name:",
      namePlaceholder: "z.B. Französisch Vokabeln Kapitel 1",
      descriptionLabel: "Beschreibung (optional):",
      descriptionPlaceholder: "Eine kurze Beschreibung dieses Sets",
      languageCodeLabel: "Sprachcode:",
      saveChangesButton: "Änderungen speichern",
      createSetButton: "Set erstellen",
      errorNotFound: "Lernset nicht gefunden.",
      loadError: "Lernset konnte zur Bearbeitung nicht geladen werden.",
      errorNameRequired: "Set-Name ist erforderlich.",
      saveSuccess: "Lernset \"{setName}\" erfolgreich gespeichert!",
      errorSaveGeneric: "Lernset konnte nicht gespeichert werden.",
      cancelled: "Vorgang abgebrochen."
    },
    flashcardEditor: {
      noSetId: "Keine Lernset-ID angegeben.",
      setNotFound: "Lernset nicht gefunden.",
      loadError: "Lernset konnte zur Kartenbearbeitung nicht geladen werden.",
      confirmDeleteCard: "Möchtest du die Karte \"{term1}\" wirklich löschen?",
      deleteCardSuccess: "Karte erfolgreich gelöscht.",
      deleteCardError: "Karte konnte nicht gelöscht werden.",
      errorTermsRequired: "Begriff 1 und Begriff 2 sind erforderlich.",
      updateCardSuccess: "Karte erfolgreich aktualisiert.",
      addCardSuccess: "Karte erfolgreich hinzugefügt.",
      errorSavingCard: "Karte konnte nicht gespeichert werden.",
      editingTitle: "Karten bearbeiten für: {setName}",
      formTitleEdit: "Karte bearbeiten",
      formTitleAdd: "Neue Karte hinzufügen",
      term1Label: "Begriff 1 (z.B. Wort/Satz):",
      term2Label: "Begriff 2 (z.B. Übersetzung/Definition):",
      imageURILabel: "Bild-URL (optional):",
      audioURILabel: "Audio-URL (optional):",
      exampleSentenceLabel: "Beispielsatz (optional):",
      notesLabel: "Notizen (optional):",
      saveCardButton: "Karte speichern",
      addCardButton: "Karte hinzufügen",
      cancelEditButton: "Bearbeitung abbrechen",
      cardsListTitle: "Karten in diesem Set",
      noCardsYet: "Noch keine Karten in diesem Set. Füge oben eine hinzu!",
      term1Display: "Begriff 1:",
      term2Display: "Begriff 2:",
      exampleDisplay: "Bsp:",
      selectSetPrompt: "Wähle ein Lernset, um dessen Karten zu verwalten.",
      doneButton: "Kartenbearbeitung abschließen",
      hasImage: "(hat Bild)",
      hasAudio: "(hat Audio)"
    },
    myStudySetsPage: {
      title: "Deine Lernsets verwalten",
      backToList: "← Zurück zur Set-Liste",
      errorSetNotFoundForPlayer: "Das zu lernende Set konnte nicht gefunden werden. Es wurde möglicherweise gelöscht."
    },
    switchToStudyMode: "Lernmodus",
    calculator: {
      intro: "Verwenden Sie diesen Rechner, um die Kosten für Ihren Sprachunterricht zu schätzen. Wählen Sie ein Paket, eine Dauer und eine Menge aus, um den Gesamtpreis anzuzeigen. Rabatte werden für größere Pakete automatisch angewendet."
    }
  },
  ru: {
    languageCode: "ru",
    cosyName: "ТАКОЙрусский",
    languageNameInEnglish: "Russian",
    languageNameNative: "Русский",
    greeting: "Привет",
    navHome: "Главная",
    navFreestyle: "Фристайл",
    navStudyMode: "Режим обучения",
    navMyStudySets: "Мои наборы",
    navProgress: "Прогресс",
    navPersonalize: "Персонализировать",
    navInteractive: "Интерактив",
    navCommunity: "Сообщество",
    navStudyTools: "Инструменты для обучения",
    selectPractice: "🧭 Выберите свою практику:",
    selectDay: "🗓️ Выберите день(дни):",
    mainHeading: "COSYязыки",
    loading: "Загрузка...",
    saving: "Сохранение...",
    cancel: "Отмена",
    editButton: "Редактировать",
    deleteButton: "Удалить",
    auth: {
      loadingStatus: "Загрузка статуса аутентификации..."
    },
    vocabulary: "🔠 Словарь",
    grammar: "🧩 Грамматика",
    reading: "📚 Чтение",
    speaking: "🗣️ Говорение",
    writing: "✍️ Письмо",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Практика спряжения",
        sentence_unscramble_exercise: "Составьте предложение",
        fill_in_the_blanks_exercise: "Заполните пропуски"
      },
      vocabulary: {
        vocabulary_random_word_image: "Случайное слово/изображение",
        vocabulary_opposites_match: "Антонимы/Сопоставьте",
        vocabulary_letters_scramble: "Буквы",
        vocabulary_true_false: "Верно/Неверно",
        vocabulary_listening: "Аудирование",
        vocabulary_practice_all: "Практиковать все"
      }
    },
    sentenceUnscramble: {
      title: "Составьте предложение",
      translationLabel: "Значение:",
      hintLabel: "Подсказка:",
      dropWordsHere: "Нажмите на слова ниже, чтобы составить предложение здесь...",
      clickToRemoveWord: "Нажмите, чтобы удалить слово"
    },
    fillInTheBlanks: {
      title: "Заполните пропуски",
      translationLabel: "Значение:",
      hintLabel: "Подсказка:",
      ariaLabelBlank: "Пропуск номер {number}",
      answersShown: "Ответы показаны выше."
    },
    controls: {
        checkAnswer: "Проверить ответ",
        revealAnswer: "Показать ответ",
        nextExercise: "Следующее упражнение",
        tryAgain: "Попробовать еще раз",
        goBack: "Назад"
    },
    feedback: {
        correct: "Правильно!",
        incorrect: "Неправильно, попробуйте еще раз."
    },
    loadingExercise: "Загрузка упражнения...",
    loadingExercises: "Загрузка упражнений...",
    errors: {
        loadDataError: "Не удалось загрузить данные.",
        exerciseHost: {
            notFound: "Тип упражнения \"<strong>{subPracticeType}</strong>\" не найден или еще не реализован.",
            title: "Ошибка упражнения",
            suggestion: "Пожалуйста, проверьте сопоставление в ExerciseHost.js или выберите другое упражнение."
        }
    },
    exercises: {
        noDataForLanguage: "Для этого языка упражнений не найдено.",
        allCompleted: "Все упражнения выполнены! Перезагрузка...",
        noExercisesAvailable: "На данный момент упражнений нет."
    },
    studySets: {
      myTitle: "Мои учебные наборы",
      createNewSet: "Создать новый набор",
      noSetsFound: "Учебных наборов не найдено. Создайте один, чтобы начать!",
      itemsCount: "{count, plural, =0 {Нет элементов} one {# элемент} few {# элемента} many {# элементов} other {# элементов}}",
      language: "Язык",
      studyButton: "Учить",
      confirmDelete: "Вы уверены, что хотите удалить учебный набор \"{setName}\"? Это действие нельзя будет отменить.",
      deleteSuccess: "Учебный набор \"{setName}\" успешно удален.",
      deleteErrorNotFound: "Не удалось удалить \"{setName}\". Набор не найден.",
      deleteErrorGeneric: "Произошла ошибка при удалении \"{setName}\".",
      loadError: "Не удалось загрузить учебные наборы.",
      navigateToCreate: "Функция создания нового набора скоро появится!",
      studySetFunctionality: "Функция изучения скоро появится!",
      editSetFunctionality: "Функция редактирования скоро появится!"
    },
    studySetEditor: {
      titleEdit: "Редактировать учебный набор",
      titleCreate: "Создать новый учебный набор",
      nameLabel: "Название набора:",
      namePlaceholder: "например, Французский словарь Глава 1",
      descriptionLabel: "Описание (необязательно):",
      descriptionPlaceholder: "Краткое описание этого набора",
      languageCodeLabel: "Код языка:",
      saveChangesButton: "Сохранить изменения",
      createSetButton: "Создать набор",
      errorNotFound: "Учебный набор не найден.",
      loadError: "Не удалось загрузить учебный набор для редактирования.",
      errorNameRequired: "Название набора обязательно.",
      saveSuccess: "Учебный набор \"{setName}\" успешно сохранен!",
      errorSaveGeneric: "Не удалось сохранить учебный набор.",
      cancelled: "Операция отменена."
    },
    flashcardEditor: {
      noSetId: "Не указан ID учебного набора.",
      setNotFound: "Учебный набор не найден.",
      loadError: "Не удалось загрузить учебный набор для редактирования карточек.",
      confirmDeleteCard: "Вы уверены, что хотите удалить карточку \"{term1}\"?",
      deleteCardSuccess: "Карточка успешно удалена.",
      deleteCardError: "Не удалось удалить карточку.",
      errorTermsRequired: "Термин 1 и Термин 2 обязательны.",
      updateCardSuccess: "Карточка успешно обновлена.",
      addCardSuccess: "Карточка успешно добавлена.",
      errorSavingCard: "Не удалось сохранить карточку.",
      editingTitle: "Редактирование карточек для: {setName}",
      formTitleEdit: "Редактировать карточку",
      formTitleAdd: "Добавить новую карточку",
      term1Label: "Термин 1 (напр., Слово/Фраза):",
      term2Label: "Термин 2 (напр., Перевод/Определение):",
      imageURILabel: "URL изображения (необязательно):",
      audioURILabel: "URL аудио (необязательно):",
      exampleSentenceLabel: "Пример предложения (необязательно):",
      notesLabel: "Примечания (необязательно):",
      saveCardButton: "Сохранить карточку",
      addCardButton: "Добавить карточку",
      cancelEditButton: "Отменить редактирование",
      cardsListTitle: "Карточки в этом наборе",
      noCardsYet: "В этом наборе пока нет карточек. Добавьте одну выше!",
      term1Display: "Термин 1:",
      term2Display: "Термин 2:",
      exampleDisplay: "Пример:",
      selectSetPrompt: "Выберите учебный набор, чтобы управлять его карточками.",
      doneButton: "Завершить редактирование карточек",
      hasImage: "(есть изображение)",
      hasAudio: "(есть аудио)"
    },
    myStudySetsPage: {
      title: "Управление вашими учебными наборами",
      backToList: "← Назад к списку наборов",
      errorSetNotFoundForPlayer: "Не удалось найти набор для изучения. Возможно, он был удален."
    },
    switchToStudyMode: "Режим обучения",
    calculator: {
      intro: "Используйте этот калькулятор для оценки стоимости ваших языковых уроков. Выберите пакет, продолжительность и количество, чтобы увидеть общую стоимость. Скидки применяются автоматически для больших пакетов."
    }
  },
  el: {
    languageCode: "el",
    cosyName: "ΚΟΖΥελληνικά",
    languageNameInEnglish: "Greek",
    languageNameNative: "Ελληνικά",
    greeting: "Γειά σου",
    navHome: "Αρχική",
    navFreestyle: "Freestyle",
    navStudyMode: "Λειτουργία Μελέτης",
    navMyStudySets: "Τα σετ μου",
    navProgress: "Πρόοδος",
    navPersonalize: "Εξατομίκευση",
    navInteractive: "Διαδραστικό",
    navCommunity: "Κοινότητα",
    navStudyTools: "Εργαλεία Μελέτης",
    selectPractice: "🧭 Επιλέξτε την πρακτική σας:",
    selectDay: "🗓️ Επιλέξτε ημέρα(ες):",
    mainHeading: "COSYγλώσσες",
    loading: "Φόρτωση...",
    saving: "Αποθήκευση...",
    cancel: "Άκυρο",
    editButton: "Επεξεργασία",
    deleteButton: "Διαγραφή",
    auth: {
      loadingStatus: "Φόρτωση κατάστασης ελέγχου ταυτότητας..."
    },
    vocabulary: "🔠 Λεξιλόγιο",
    grammar: "🧩 Γραμματική",
    reading: "📚 Ανάγνωση",
    speaking: "🗣️ Ομιλία",
    writing: "✍️ Γραφή",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Πρακτική Κλίσης",
        sentence_unscramble_exercise: "Αναδιάταξη Πρότασης",
        fill_in_the_blanks_exercise: "Συμπλήρωση Κενών"
      },
      vocabulary: {
        vocabulary_random_word_image: "Τυχαία Λέξη/Εικόνα",
        vocabulary_opposites_match: "Αντίθετα/Αντιστοίχιση",
        vocabulary_letters_scramble: "Γράμματα",
        vocabulary_true_false: "Σωστό/Λάθος",
        vocabulary_listening: "Ακρόαση",
        vocabulary_practice_all: "Εξάσκηση σε όλα"
      }
    },
    sentenceUnscramble: {
      title: "Αναδιάταξη Πρότασης",
      translationLabel: "Σημασία:",
      hintLabel: "Υπόδειξη:",
      dropWordsHere: "Κάντε κλικ στις παρακάτω λέξεις για να φτιάξετε την πρόταση εδώ...",
      clickToRemoveWord: "Κάντε κλικ για να αφαιρέσετε τη λέξη"
    },
    fillInTheBlanks: {
      title: "Συμπλήρωση Κενών",
      translationLabel: "Σημασία:",
      hintLabel: "Υπόδειξη:",
      ariaLabelBlank: "Κενό νούμερο {number}",
      answersShown: "Οι απαντήσεις εμφανίζονται παραπάνω."
    },
    controls: {
        checkAnswer: "Έλεγχος Απάντησης",
        revealAnswer: "Αποκάλυψη Απάντησης",
        nextExercise: "Επόμενη Άσκηση",
        tryAgain: "Προσπαθήστε ξανά",
        goBack: "Πίσω"
    },
    feedback: {
        correct: "Σωστά!",
        incorrect: "Λάθος, προσπαθήστε ξανά."
    },
    loadingExercise: "Φόρτωση άσκησης...",
    loadingExercises: "Φόρτωση ασκήσεων...",
    errors: {
        loadDataError: "Αποτυχία φόρτωσης δεδομένων.",
        exerciseHost: {
            notFound: "Ο τύπος άσκησης \"<strong>{subPracticeType}</strong>\" δεν βρέθηκε ή δεν έχει υλοποιηθεί ακόμη.",
            title: "Σφάλμα Άσκησης",
            suggestion: "Παρακαλώ ελέγξτε την αντιστοίχιση στο ExerciseHost.js ή επιλέξτε άλλη άσκηση."
        }
    },
    exercises: {
        noDataForLanguage: "Δεν βρέθηκαν ασκήσεις για αυτήν τη γλώσσα.",
        allCompleted: "Όλες οι ασκήσεις ολοκληρώθηκαν! Επαναφορά...",
        noExercisesAvailable: "Δεν υπάρχουν διαθέσιμες ασκήσεις αυτή τη στιγμή."
    },
    studySets: {
      myTitle: "Τα Σετ Μελέτης μου",
      createNewSet: "Δημιουργία Νέου Σετ",
      noSetsFound: "Δεν βρέθηκαν σετ μελέτης. Δημιουργήστε ένα για να ξεκινήσετε!",
      itemsCount: "{count, plural, =0 {Κανένα στοιχείο} one {# στοιχείο} other {# στοιχεία}}",
      language: "Γλώσσα",
      studyButton: "Μελέτη",
      confirmDelete: "Είστε σίγουροι ότι θέλετε να διαγράψετε το σετ μελέτης \"{setName}\"; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
      deleteSuccess: "Το σετ μελέτης \"{setName}\" διαγράφηκε επιτυχώς.",
      deleteErrorNotFound: "Δεν ήταν δυνατή η διαγραφή του \"{setName}\". Το σετ δεν βρέθηκε.",
      deleteErrorGeneric: "Παρουσιάστηκε σφάλμα κατά τη διαγραφή του \"{setName}\".",
      loadError: "Αποτυχία φόρτωσης των σετ μελέτης.",
      navigateToCreate: "Η λειτουργία δημιουργίας νέου σετ έρχεται σύντομα!",
      studySetFunctionality: "Η λειτουργία μελέτης έρχεται σύντομα!",
      editSetFunctionality: "Η λειτουργία επεξεργασίας έρχεται σύντομα!"
    },
    studySetEditor: {
      titleEdit: "Επεξεργασία Σετ Μελέτης",
      titleCreate: "Δημιουργία Νέου Σετ Μελέτης",
      nameLabel: "Όνομα Σετ:",
      namePlaceholder: "π.χ., Γαλλικό Λεξιλόγιο Κεφάλαιο 1",
      descriptionLabel: "Περιγραφή (Προαιρετικά):",
      descriptionPlaceholder: "Μια σύντομη περιγραφή αυτού του σετ",
      languageCodeLabel: "Κωδικός Γλώσσας:",
      saveChangesButton: "Αποθήκευση Αλλαγών",
      createSetButton: "Δημιουργία Σετ",
      errorNotFound: "Το σετ μελέτης δεν βρέθηκε.",
      loadError: "Αποτυχία φόρτωσης του σετ μελέτης για επεξεργασία.",
      errorNameRequired: "Το όνομα του σετ είναι υποχρεωτικό.",
      saveSuccess: "Το σετ μελέτης \"{setName}\" αποθηκεύτηκε επιτυχώς!",
      errorSaveGeneric: "Αποτυχία αποθήκευσης του σετ μελέτης.",
      cancelled: "Η λειτουργία ακυρώθηκε."
    },
    flashcardEditor: {
      noSetId: "Δεν δόθηκε ID σετ μελέτης.",
      setNotFound: "Το σετ μελέτης δεν βρέθηκε.",
      loadError: "Αποτυχία φόρτωσης του σετ μελέτης για επεξεργασία καρτών.",
      confirmDeleteCard: "Είστε σίγουροι ότι θέλετε να διαγράψετε την κάρτα \"{term1}\";",
      deleteCardSuccess: "Η κάρτα διαγράφηκε επιτυχώς.",
      deleteCardError: "Δεν ήταν δυνατή η διαγραφή της κάρτας.",
      errorTermsRequired: "Ο Όρος 1 και ο Όρος 2 είναι υποχρεωτικοί.",
      updateCardSuccess: "Η κάρτα ενημερώθηκε επιτυχώς.",
      addCardSuccess: "Η κάρτα προστέθηκε επιτυχώς.",
      errorSavingCard: "Αποτυχία αποθήκευσης της κάρτας.",
      editingTitle: "Επεξεργασία Καρτών για: {setName}",
      formTitleEdit: "Επεξεργασία Κάρτας",
      formTitleAdd: "Προσθήκη Νέας Κάρτας",
      term1Label: "Όρος 1 (π.χ., Λέξη/Φράση):",
      term2Label: "Όρος 2 (π.χ., Μετάφραση/Ορισμός):",
      imageURILabel: "URL Εικόνας (Προαιρετικά):",
      audioURILabel: "URL Ήχου (Προαιρετικά):",
      exampleSentenceLabel: "Παράδειγμα Πρότασης (Προαιρετικά):",
      notesLabel: "Σημειώσεις (Προαιρετικά):",
      saveCardButton: "Αποθήκευση Κάρτας",
      addCardButton: "Προσθήκη Κάρτας",
      cancelEditButton: "Άκυρο Επεξεργασίας",
      cardsListTitle: "Κάρτες σε αυτό το Σετ",
      noCardsYet: "Δεν υπάρχουν ακόμη κάρτες σε αυτό το σετ. Προσθέστε μία παραπάνω!",
      term1Display: "Όρος 1:",
      term2Display: "Όρος 2:",
      exampleDisplay: "Παρ:",
      selectSetPrompt: "Επιλέξτε ένα σετ μελέτης για να διαχειριστείτε τις κάρτες του.",
      doneButton: "Ολοκλήρωση Επεξεργασίας Καρτών",
      hasImage: "(έχει εικόνα)",
      hasAudio: "(έχει ήχο)"
    },
    myStudySetsPage: {
      title: "Διαχείριση των Σετ Μελέτης σας",
      backToList: "← Επιστροφή στη Λίστα Σετ",
      errorSetNotFoundForPlayer: "Δεν ήταν δυνατό να βρεθεί το σετ για μελέτη. Μπορεί να έχει διαγραφεί."
    },
    switchToStudyMode: "Λειτουργία Μελέτης",
    calculator: {
      intro: "Χρησιμοποιήστε αυτόν τον υπολογιστή για να εκτιμήσετε το κόστος των μαθημάτων γλώσσας σας. Επιλέξτε ένα πακέτο, διάρκεια και ποσότητα για να δείτε τη συνολική τιμή. Οι εκπτώσεις εφαρμόζονται αυτόματα για μεγαλύτερα πακέτα."
    }
  },
  br: {
    languageCode: "br",
    cosyName: "COSYbrezhoneg",
    languageNameInEnglish: "Breton",
    languageNameNative: "Brezhoneg",
    greeting: "Demat",
    navHome: "Degemer",
    navFreestyle: "Freestyle",
    navStudyMode: "Mod studi",
    navMyStudySets: "Ma setoù",
    navProgress: "Araokadennoù",
    navPersonalize: "Personelaat",
    navInteractive: "Etrewezhiat",
    navCommunity: "Kumuniezh",
    navStudyTools: "Binvioù studi",
    selectPractice: "🧭 Dibabit ho pleustr:",
    selectDay: "🗓️ Dibabit an deiz(ioù):",
    mainHeading: "COSYyezhoù",
    loading: "O kargañ...",
    saving: "O enrollañ...",
    cancel: "Nullañ",
    editButton: "Kemmañ",
    deleteButton: "Dilemel",
    auth: {
      loadingStatus: "O kargañ statud an dilesadur..."
    },
    vocabulary: "🔠 Geriaoueg",
    grammar: "🧩 Yezhadur",
    reading: "📚 Lenn",
    speaking: "🗣️ Komz",
    writing: "✍️ Skrivañ",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Pleustriñ an displegañ",
        sentence_unscramble_exercise: "Adsevel ar frazenn",
        fill_in_the_blanks_exercise: "Leuniañ an toulloù"
      },
      vocabulary: {
        vocabulary_random_word_image: "Ger/Skeudenn dargouezhek",
        vocabulary_opposites_match: "Geriaoueg/Klotさせる",
        vocabulary_letters_scramble: "Lizherennoù",
        vocabulary_true_false: "Gwir/Gaou",
        vocabulary_listening: "Selaou",
        vocabulary_practice_all: "Pleustriñ pep tra"
      }
    },
    sentenceUnscramble: {
      title: "Adsevel ar frazenn",
      translationLabel: "Ster:",
      hintLabel: "Tavak:",
      dropWordsHere: "Klikit war ar gerioù a-is evit sevel ar frazenn amañ...",
      clickToRemoveWord: "Klikit evit tennañ ar ger"
    },
    fillInTheBlanks: {
      title: "Leuniañ an toulloù",
      translationLabel: "Ster:",
      hintLabel: "Tavak:",
      ariaLabelBlank: "Toll niverenn {number}",
      answersShown: "Diskouezet eo ar respontoù a-us."
    },
    controls: {
        checkAnswer: "Gwiriañ ar respont",
        revealAnswer: "Diskouez ar respont",
        nextExercise: "Pleustradenn da-heul",
        tryAgain: "Klask en-dro",
        goBack: "Distreiñ"
    },
    feedback: {
        correct: "Reizh!",
        incorrect: "Direizh, klaskit en-dro."
    },
    loadingExercise: "O kargañ ar pleustradenn...",
    loadingExercises: "O kargañ ar pleustradennoù...",
    errors: {
        loadDataError: "C'hwitet eo kargañ ar roadennoù.",
        exerciseHost: {
            notFound: "N'eo ket bet kavet pe n'eo ket bet lakaet e pleustr c'hoazh ar seurt pleustradenn \"<strong>{subPracticeType}</strong>\".",
            title: "Fazi pleustradenn",
            suggestion: "Gwiriit an mapping en ExerciseHost.js pe dibabit ur pleustradenn all."
        }
    },
    exercises: {
        noDataForLanguage: "N'eus bet kavet pleustradenn ebet evit ar yezh-mañ.",
        allCompleted: "An holl bleustradennoù zo bet graet! O adderaouekaat...",
        noExercisesAvailable: "N'eus pleustradenn ebet hegerz evit ar poent."
    },
    studySets: {
      myTitle: "Ma setoù studi",
      createNewSet: "Krouiñ ur set nevez",
      noSetsFound: "N'eus bet kavet set studi ebet. Krouit unan evit kregiñ!",
      itemsCount: "{count, plural, =0 {Elfenn ebet} one {# elfenn} other {# elfenn}}",
      language: "Yezh",
      studyButton: "Studi",
      confirmDelete: "Ha sur oc'h e fell deoc'h dilemel ar set studi \"{setName}\"? Ní vo ket tu da zistreiñ war an ober-mañ.",
      deleteSuccess: "Dilemet eo bet ar set studi \"{setName}\" gant berzh.",
      deleteErrorNotFound: "N'eus ket bet gallet dilemel \"{setName}\". N'eo ket bet kavet ar set.",
      deleteErrorGeneric: "Ur fazi zo bet e-ser dilemel \"{setName}\".",
      loadError: "C'hwitet eo bet kargañ ar setoù studi.",
      navigateToCreate: "An arc'hwel evit krouiñ ur set nevez a vo hegerz a-benn nebeut!",
      studySetFunctionality: "An arc'hwel studi a vo hegerz a-benn nebeut!",
      editSetFunctionality: "An arc'hwel kemmañ a vo hegerz a-benn nebeut!"
    },
    studySetEditor: {
      titleEdit: "Kemmañ ar set studi",
      titleCreate: "Krouiñ ur set studi nevez",
      nameLabel: "Anv ar set:",
      namePlaceholder: "da sk. Geriaoueg galleg Pennad 1",
      descriptionLabel: "Deskrivadur (diret):",
      descriptionPlaceholder: "Un deskrivadur berr eus ar set-mañ",
      languageCodeLabel: "Kod yezh:",
      saveChangesButton: "Enrollañ ar c'hemmoù",
      createSetButton: "Krouiñ ar set",
      errorNotFound: "N'eo ket bet kavet ar set studi.",
      loadError: "C'hwitet eo bet kargañ ar set studi evit e gemmañ.",
      errorNameRequired: "Rekis eo anv ar set.",
      saveSuccess: "Enrollet eo bet ar set studi \"{setName}\" gant berzh!",
      errorSaveGeneric: "C'hwitet eo bet enrollañ ar set studi.",
      cancelled: "Obererezh nullet."
    },
    flashcardEditor: {
      noSetId: "N'eus bet roet ID set studi ebet.",
      setNotFound: "N'eo ket bet kavet ar set studi.",
      loadError: "C'hwitet eo bet kargañ ar set studi evit kemmañ ar c'hartennoù.",
      confirmDeleteCard: "Ha sur oc'h e fell deoc'h dilemel ar gartenn \"{term1}\"?",
      deleteCardSuccess: "Dilemet eo bet ar gartenn gant berzh.",
      deleteCardError: "N'eus ket bet gallet dilemel ar gartenn.",
      errorTermsRequired: "Rekis eo an termen 1 hag an termen 2.",
      updateCardSuccess: "Hizivaet eo bet ar gartenn gant berzh.",
      addCardSuccess: "Ouzhpennet eo bet ar gartenn gant berzh.",
      errorSavingCard: "C'hwitet eo bet enrollañ ar gartenn.",
      editingTitle: "O kemmañ kartennoù evit: {setName}",
      formTitleEdit: "Kemmañ ar gartenn",
      formTitleAdd: "Ouzhpennañ ur gartenn nevez",
      term1Label: "Termen 1 (da sk. Ger/Frazen):",
      term2Label: "Termen 2 (da sk. Troidigezh/Termenadur):",
      imageURILabel: "URL ar skeudenn (diret):",
      audioURILabel: "URL an odio (diret):",
      exampleSentenceLabel: "Frazenn skouer (diret):",
      notesLabel: "Notennoù (diret):",
      saveCardButton: "Enrollañ ar gartenn",
      addCardButton: "Ouzhpennañ ar gartenn",
      cancelEditButton: "Nullañ ar c'hemmañ",
      cardsListTitle: "Kartennoù er set-mañ",
      noCardsYet: "N'eus kartenn ebet er set-mañ c'hoazh. Ouzhpennit unan a-us!",
      term1Display: "Termen 1:",
      term2Display: "Termen 2:",
      exampleDisplay: "Sk.:",
      selectSetPrompt: "Dibabit ur set studi evit merañ e gartennoù.",
      doneButton: "Echuet kemmañ ar c'hartennoù",
      hasImage: "(gant skeudenn)",
      hasAudio: "(gant odio)"
    },
    myStudySetsPage: {
      title: "Merañ ho setoù studi",
      backToList: "← Distreiñ da roll ar setoù",
      errorSetNotFoundForPlayer: "N'eus ket bet gallet kavout ar set da studi. Marteze eo bet dilemet."
    },
    switchToStudyMode: "Mod studi",
    calculator: {
      intro: "Grit gant ar jederez-mañ evit istimañ koust ho kentelioù yezh. Dibabit ur paket, ur padelezh hag ur c'hementad evit gwelet ar priz hollek. Ar prizioù-dinskrog a vez lakaet ent emgefreek evit ar pakadoù brasañ."
    }
  },
  tt: {
    languageCode: "tt",
    cosyName: "COSYtatarça",
    languageNameInEnglish: "Tatar",
    languageNameNative: "Татарча",
    greeting: "Сәлам",
    navHome: "Баш бит",
    navFreestyle: "Фристайл",
    navStudyMode: "Өйрәнү режимы",
    navMyStudySets: "Минем комплектлар",
    navProgress: "Прогресс",
    navPersonalize: "Шәхсиләштерү",
    navInteractive: "Интерактив",
    navCommunity: "Берләшмә",
    navStudyTools: "Өйрәнү кораллары",
    selectPractice: "🧭 Практикагызны сайлагыз:",
    selectDay: "🗓️ Көн(нәр)не сайлагыз:",
    mainHeading: "COSYтелләр",
    loading: "Йөкләнә...",
    saving: "Саклана...",
    cancel: "Баш тарту",
    editButton: "Төзәтү",
    deleteButton: "Бетерү",
    auth: {
      loadingStatus: "Аутентификация статусы йөкләү..."
    },
    vocabulary: "🔠 Сүзлек",
    grammar: "🧩 Грамматика",
    reading: "📚 Уку",
    speaking: "🗣️ Сөйләм",
    writing: "✍️ Язу",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Фигыльләрне төрләндерү практикасы",
        sentence_unscramble_exercise: "Җөмләне тәртипкә китерү",
        fill_in_the_blanks_exercise: "Буш урыннарны тутыру"
      },
      vocabulary: {
        vocabulary_random_word_image: "Очраклы сүз/рәсем",
        vocabulary_opposites_match: "Антонимнар/туры китерү",
        vocabulary_letters_scramble: "Хәрефләр",
        vocabulary_true_false: "Дөрес/Ялган",
        vocabulary_listening: "Тыңлау",
        vocabulary_practice_all: "Барысын да практикалау"
      }
    },
    sentenceUnscramble: {
      title: "Җөмләне тәртипкә китерү",
      translationLabel: "Мәгънәсе:",
      hintLabel: "Киңәш:",
      dropWordsHere: "Монда җөмлә төзү өчен астагы сүзләргә басыгыз...",
      clickToRemoveWord: "Сүзне бетерү өчен басыгыз"
    },
    fillInTheBlanks: {
      title: "Буш урыннарны тутыру",
      translationLabel: "Мәгънәсе:",
      hintLabel: "Киңәш:",
      ariaLabelBlank: "Буш урын номеры {number}",
      answersShown: "Җаваплар югарыда күрсәтелгән."
    },
    controls: {
        checkAnswer: "Җавапны тикшерү",
        revealAnswer: "Җавапны күрсәтү",
        nextExercise: "Киләсе күнегү",
        tryAgain: "Яңадан тырышыгыз",
        goBack: "Артка"
    },
    feedback: {
        correct: "Дөрес!",
        incorrect: "Дөрес түгел, яңадан тырышыгыз."
    },
    loadingExercise: "Күнегү йөкләү...",
    loadingExercises: "Күнегүләр йөкләү...",
    errors: {
        loadDataError: "Мәгълүматларны йөкләү хатасы.",
        exerciseHost: {
            notFound: "\"<strong>{subPracticeType}</strong>\" күнегү төре табылмады яки әлегә тормышка ашырылмаган.",
            title: "Күнегү хатасы",
            suggestion: "Зинһар, ExerciseHost.js'тагы картаны тикшерегез яки башка күнегү сайлагыз."
        }
    },
    exercises: {
        noDataForLanguage: "Бу тел өчен күнегүләр табылмады.",
        allCompleted: "Барлык күнегүләр дә тәмам! Яңадан башлау...",
        noExercisesAvailable: "Хәзерге вакытта күнегүләр юк."
    },
    studySets: {
      myTitle: "Минем өйрәнү комплектларым",
      createNewSet: "Яңа комплект булдыру",
      noSetsFound: "Өйрәнү комплектлары табылмады. Башлау өчен берне булдырыгыз!",
      itemsCount: "{count, plural, =0 {Элементлар юк} one {# элемент} other {# элемент}}",
      language: "Тел",
      studyButton: "Өйрәнү",
      confirmDelete: "\"{setName}\" өйрәнү комплектын бетерергә теләгәнегезгә ышанасызмы? Бу гамәлне кире кайтарып булмый.",
      deleteSuccess: "\"{setName}\" өйрәнү комплекты уңышлы бетерелде.",
      deleteErrorNotFound: "\"{setName}\" бетерелмәде. Комплект табылмады.",
      deleteErrorGeneric: "\"{setName}\" бетергәндә хата килеп чыкты.",
      loadError: "Өйрәнү комплектларын йөкләү хатасы.",
      navigateToCreate: "Яңа комплект булдыру функциясе тиздән булачак!",
      studySetFunctionality: "Өйрәнү функциясе тиздән булачак!",
      editSetFunctionality: "Төзәтү функциясе тиздән булачак!"
    },
    studySetEditor: {
      titleEdit: "Өйрәнү комплектын төзәтү",
      titleCreate: "Яңа өйрәнү комплекты булдыру",
      nameLabel: "Комплект исеме:",
      namePlaceholder: "мәсәлән, Француз теле сүзлеге 1 нче бүлек",
      descriptionLabel: "Тасвирлама (өстәмә):",
      descriptionPlaceholder: "Бу комплектның кыскача тасвирламасы",
      languageCodeLabel: "Тел коды:",
      saveChangesButton: "Үзгәрешләрне саклау",
      createSetButton: "Комплект булдыру",
      errorNotFound: "Өйрәнү комплекты табылмады.",
      loadError: "Төзәтү өчен өйрәнү комплектын йөкләү хатасы.",
      errorNameRequired: "Комплект исеме мәҗбүри.",
      saveSuccess: "\"{setName}\" өйрәнү комплекты уңышлы сакланды!",
      errorSaveGeneric: "Өйрәнү комплектын саклау хатасы.",
      cancelled: "Гамәл туктатылды."
    },
    flashcardEditor: {
      noSetId: "Өйрәнү комплектының ID'сы күрсәтелмәгән.",
      setNotFound: "Өйрәнү комплекты табылмады.",
      loadError: "Карточкаларны төзәтү өчен өйрәнү комплектын йөкләү хатасы.",
      confirmDeleteCard: "\"{term1}\" карточкасын бетерергә теләгәнегезгә ышанасызмы?",
      deleteCardSuccess: "Карточка уңышлы бетерелде.",
      deleteCardError: "Карточканы бетереп булмады.",
      errorTermsRequired: "1 нче һәм 2 нче терминнар мәҗбүри.",
      updateCardSuccess: "Карточка уңышлы яңартылды.",
      addCardSuccess: "Карточка уңышлы өстәлде.",
      errorSavingCard: "Карточканы саклау хатасы.",
      editingTitle: "Карточкаларны төзәтү: {setName}",
      formTitleEdit: "Карточканы төзәтү",
      formTitleAdd: "Яңа карточка өстәү",
      term1Label: "1 нче термин (мәсәлән, Сүз/Сүзтезмә):",
      term2Label: "2 нче термин (мәсәлән, Тәрҗемә/Билгеләмә):",
      imageURILabel: "Рәсем URL'ы (өстәмә):",
      audioURILabel: "Аудио URL'ы (өстәмә):",
      exampleSentenceLabel: "Мисал җөмлә (өстәмә):",
      notesLabel: "Искәрмәләр (өстәмә):",
      saveCardButton: "Карточканы саклау",
      addCardButton: "Карточка өстәү",
      cancelEditButton: "Төзәтүне туктату",
      cardsListTitle: "Бу комплекттагы карточкалар",
      noCardsYet: "Бу комплектта әлегә карточкалар юк. Югарыда берне өстәгез!",
      term1Display: "1 нче термин:",
      term2Display: "2 нче термин:",
      exampleDisplay: "Мәс.:",
      selectSetPrompt: "Аның карточкаларын идарә итү өчен өйрәнү комплектын сайлагыз.",
      doneButton: "Карточкаларны төзәтүне тәмамлау",
      hasImage: "(рәсем бар)",
      hasAudio: "(аудио бар)"
    },
    myStudySetsPage: {
      title: "Өйрәнү комплектларыгыз белән идарә итү",
      backToList: "← Комплектлар исемлегенә кире кайту",
      errorSetNotFoundForPlayer: "Өйрәнү өчен комплект табылмады. Ул бетерелгән булырга мөмкин."
    },
    switchToStudyMode: "Өйрәнү режимы",
    calculator: {
      intro: "Тел дәресләрегезнең бәясен бәяләү өчен бу калькуляторны кулланыгыз. Гомуми бәяне күрү өчен пакет, дәвамлылык һәм санны сайлагыз. Зуррак пакетлар өчен ташламалар автоматик рәвештә кулланыла."
    }
  },
  ba: {
    languageCode: "ba",
    cosyName: "COSYbashkort",
    languageNameInEnglish: "Bashkir",
    languageNameNative: "Башҡортса",
    greeting: "Сәләм",
    navHome: "Төп бит",
    navFreestyle: "Ирекле стиль",
    navStudyMode: "Өйрәнеү режимы",
    navMyStudySets: "Минең йыйылмаларым",
    navProgress: "Алға китеш",
    navPersonalize: "Шәхсиләштереү",
    navInteractive: "Интерактив",
    navCommunity: "Берләшмә",
    navStudyTools: "Өйрәнеү ҡоралдары",
    selectPractice: "🧭 Практикағыҙҙы һайлағыҙ:",
    selectDay: "🗓️ Көн(дәр)ҙе һайлағыҙ:",
    mainHeading: "COSYтелдәр",
    loading: "Тейәлә...",
    saving: "Һаҡлана...",
    cancel: "Баш тартыу",
    editButton: "Үҙгәртергә",
    deleteButton: "Юйырға",
    auth: {
      loadingStatus: "Аутентификация торошон тейәү..."
    },
    vocabulary: "🔠 Һүҙлек",
    grammar: "🧩 Грамматика",
    reading: "📚 Уҡыу",
    speaking: "🗣️ Һөйләү",
    writing: "✍️ Яҙыу",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Ҡылымдарҙы үҙгәртеү практикаһы",
        sentence_unscramble_exercise: "Һөйләмде тәртипкә килтереү",
        fill_in_the_blanks_exercise: "Буш урындарҙы тултырыу"
      },
      vocabulary: {
        vocabulary_random_word_image: "Осраҡлы һүҙ/һүрәт",
        vocabulary_opposites_match: "Антонимдар/тап килтереү",
        vocabulary_letters_scramble: "Хәрефтәр",
        vocabulary_true_false: "Дөрөҫ/Ялған",
        vocabulary_listening: "Тыңлау",
        vocabulary_practice_all: "Барыһын да практикалау"
      }
    },
    sentenceUnscramble: {
      title: "Һөйләмде тәртипкә килтереү",
      translationLabel: "Мәғәнәһе:",
      hintLabel: "Кәңәш:",
      dropWordsHere: "Бында һөйләм төҙөү өсөн аҫтағы һүҙҙәргә баҫығыҙ...",
      clickToRemoveWord: "Һүҙҙе юйыр өсөн баҫығыҙ"
    },
    fillInTheBlanks: {
      title: "Буш урындарҙы тултырыу",
      translationLabel: "Мәғәнәһе:",
      hintLabel: "Кәңәш:",
      ariaLabelBlank: "Буш урын номеры {number}",
      answersShown: "Яуаптар юғарыла күрһәтелгән."
    },
    controls: {
        checkAnswer: "Яуапты тикшереү",
        revealAnswer: "Яуапты күрһәтеү",
        nextExercise: "Киләһе күнегеү",
        tryAgain: "Яңынан тырышығыҙ",
        goBack: "Артҡа"
    },
    feedback: {
        correct: "Дөрөҫ!",
        incorrect: "Дөрөҫ түгел, яңынан тырышығыҙ."
    },
    loadingExercise: "Күнегеү тейәлә...",
    loadingExercises: "Күнегеүҙәр тейәлә...",
    errors: {
        loadDataError: "Мәғлүмәттәрҙе тейәү хатаһы.",
        exerciseHost: {
            notFound: "\"<strong>{subPracticeType}</strong>\" күнегеү төрө табылманы йәки әлегә тормошҡа ашырылмаған.",
            title: "Күнегеү хатаһы",
            suggestion: "Зинһар, ExerciseHost.js'тағы картаны тикшерегеҙ йәки икенсе күнегеү һайлағыҙ."
        }
    },
    exercises: {
        noDataForLanguage: "Был тел өсөн күнегеүҙәр табылманы.",
        allCompleted: "Бөтә күнегеүҙәр ҙә тамам! Яңынан башлау...",
        noExercisesAvailable: "Әлеге ваҡытта күнегеүҙәр юҡ."
    },
    studySets: {
      myTitle: "Минең өйрәнеү йыйылмаларым",
      createNewSet: "Яңы йыйылма булдырыу",
      noSetsFound: "Өйрәнеү йыйылмалары табылманы. Башлар өсөн берҙе булдырығыҙ!",
      itemsCount: "{count, plural, =0 {Элементтар юҡ} one {# элемент} other {# элемент}}",
      language: "Тел",
      studyButton: "Өйрәнеү",
      confirmDelete: "\"{setName}\" өйрәнеү йыйылмаһын юйырға теләгәнегеҙгә ышанаһығыҙмы? Был ғәмәлде кире ҡайтарып булмай.",
      deleteSuccess: "\"{setName}\" өйрәнеү йыйылмаһы уңышлы юйылды.",
      deleteErrorNotFound: "\"{setName}\" юйылманы. Йыйылма табылманы.",
      deleteErrorGeneric: "\"{setName}\" юйғанда хата килеп сыҡты.",
      loadError: "Өйрәнеү йыйылмаларын тейәү хатаһы.",
      navigateToCreate: "Яңы йыйылма булдырыу функцияһы тиҙҙән буласаҡ!",
      studySetFunctionality: "Өйрәнеү функцияһы тиҙҙән буласаҡ!",
      editSetFunctionality: "Үҙгәртеү функцияһы тиҙҙән буласаҡ!"
    },
    studySetEditor: {
      titleEdit: "Өйрәнеү йыйылмаһын үҙгәртеү",
      titleCreate: "Яңы өйрәнеү йыйылмаһы булдырыу",
      nameLabel: "Йыйылма исеме:",
      namePlaceholder: "мәҫәлән, Француз теле һүҙлеге 1-се бүлек",
      descriptionLabel: "Тасуирлама (өҫтәмә):",
      descriptionPlaceholder: "Был йыйылманың ҡыҫҡаса тасуирламаһы",
      languageCodeLabel: "Тел коды:",
      saveChangesButton: "Үҙгәрештәрҙе һаҡларға",
      createSetButton: "Йыйылма булдырыу",
      errorNotFound: "Өйрәнеү йыйылмаһы табылманы.",
      loadError: "Үҙгәртеү өсөн өйрәнеү йыйылмаһын тейәү хатаһы.",
      errorNameRequired: "Йыйылма исеме мотлаҡ.",
      saveSuccess: "\"{setName}\" өйрәнеү йыйылмаһы уңышлы һаҡланды!",
      errorSaveGeneric: "Өйрәнеү йыйылмаһын һаҡлау хатаһы.",
      cancelled: "Ғәмәл туҡтатылды."
    },
    flashcardEditor: {
      noSetId: "Өйрәнеү йыйылмаһының ID-һы күрһәтелмәгән.",
      setNotFound: "Өйрәнеү йыйылмаһы табылманы.",
      loadError: "Карточкаларҙы үҙгәртеү өсөн өйрәнеү йыйылмаһын тейәү хатаһы.",
      confirmDeleteCard: "\"{term1}\" карточкаһын юйырға теләгәнегеҙгә ышанаһығыҙмы?",
      deleteCardSuccess: "Карточка уңышлы юйылды.",
      deleteCardError: "Карточканы юйып булманы.",
      errorTermsRequired: "1-се һәм 2-се терминдар мотлаҡ.",
      updateCardSuccess: "Карточка уңышлы яңыртылды.",
      addCardSuccess: "Карточка уңышлы өҫтәлде.",
      errorSavingCard: "Карточканы һаҡлау хатаһы.",
      editingTitle: "Карточкаларҙы үҙгәртеү: {setName}",
      formTitleEdit: "Карточканы үҙгәртеү",
      formTitleAdd: "Яңы карточка өҫтәү",
      term1Label: "1-се термин (мәҫәлән, Һүҙ/Һүҙбәйләнеш):",
      term2Label: "2-се термин (мәҫәлән, Тәржемә/Билдәләмә):",
      imageURILabel: "Һүрәт URL-ы (өҫтәмә):",
      audioURILabel: "Аудио URL-ы (өҫтәмә):",
      exampleSentenceLabel: "Миҫал һөйләм (өҫтәмә):",
      notesLabel: "Иҫкәрмәләр (өҫтәмә):",
      saveCardButton: "Карточканы һаҡларға",
      addCardButton: "Карточка өҫтәргә",
      cancelEditButton: "Үҙгәртеүҙе туҡтатырға",
      cardsListTitle: "Был йыйылмалағы карточкалар",
      noCardsYet: "Был йыйылмала әлегә карточкалар юҡ. Юғарыла берҙе өҫтәгеҙ!",
      term1Display: "1-се термин:",
      term2Display: "2-се термин:",
      exampleDisplay: "Мәҫ.:",
      selectSetPrompt: "Уның карточкаларын идара итеү өсөн өйрәнеү йыйылмаһын һайлағыҙ.",
      doneButton: "Карточкаларҙы үҙгәртеүҙе тамамларға",
      hasImage: "(һүрәт бар)",
      hasAudio: "(аудио бар)"
    },
    myStudySetsPage: {
      title: "Өйрәнеү йыйылмаларығыҙ менән идара итеү",
      backToList: "← Йыйылмалар исемлегенә кире ҡайтыу",
      errorSetNotFoundForPlayer: "Өйрәнеү өсөн йыйылма табылманы. Ул юйылған булырға мөмкин."
    },
    switchToStudyMode: "Өйрәнеү режимы",
    calculator: {
      intro: "Тел дәрестәрегеҙҙең хаҡын баһалау өсөн был калькуляторҙы ҡулланығыҙ. Дөйөм хаҡты күреү өсөн пакет, оҙайлылыҡ һәм һанды һайлағыҙ. Ҙурыраҡ пакеттар өсөн ташламалар автоматик рәүештә ҡулланыла."
    }
  },
  hy: {
    languageCode: "hy",
    cosyName: "ԾՈՍՅհայկական",
    languageNameInEnglish: "Armenian",
    languageNameNative: "Հայերեն",
    greeting: "Բարև",
    navHome: "Գլխավոր",
    navFreestyle: "Ֆրիսթայլ",
    navStudyMode: "Ուսումնական ռեժիմ",
    navMyStudySets: "Իմ հավաքածուները",
    navProgress: "Առաջընթաց",
    navPersonalize: "Անհատականացնել",
    navInteractive: "Ինտերակտիվ",
    navCommunity: "Համայնք",
    navStudyTools: "Ուսումնական գործիքներ",
    selectPractice: "🧭 Ընտրեք ձեր պրակտիկան:",
    selectDay: "🗓️ Ընտրեք օր(եր):",
    mainHeading: "COSYլեզուներ",
    loading: "Բեռնվում է...",
    saving: "Պահպանվում է...",
    cancel: "Չեղարկել",
    editButton: "Խմբագրել",
    deleteButton: "Ջնջել",
    auth: {
      loadingStatus: "Բեռնվում է նույնականացման կարգավիճակը..."
    },
    vocabulary: "🔠 Բառապաշար",
    grammar: "🧩 Քերականություն",
    reading: "📚 Ընթերցանություն",
    speaking: "🗣️ Խոսակցական",
    writing: "✍️ Գրավոր",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Բայերի խոնարհման պրակտիկա",
        sentence_unscramble_exercise: "Կազմիր նախադասություն",
        fill_in_the_blanks_exercise: "Լրացրու բաց թողնված տեղերը"
      },
      vocabulary: {
        vocabulary_random_word_image: "Պատահական բառ/նկար",
        vocabulary_opposites_match: "Հականիշներ/համապատասխանեցրու",
        vocabulary_letters_scramble: "Տառեր",
        vocabulary_true_false: "Ճիշտ/Սխալ",
        vocabulary_listening: "Լսողական",
        vocabulary_practice_all: "Կիրառիր բոլորը"
      }
    },
    sentenceUnscramble: {
      title: "Կազմիր նախադասություն",
      translationLabel: "Նշանակությունը՝",
      hintLabel: "Հուշում՝",
      dropWordsHere: "Սեղմիր բառերի վրա՝ այստեղ նախադասություն կազմելու համար...",
      clickToRemoveWord: "Սեղմիր՝ բառը հեռացնելու համար"
    },
    fillInTheBlanks: {
      title: "Լրացրու բաց թողնված տեղերը",
      translationLabel: "Նշանակությունը՝",
      hintLabel: "Հուշում՝",
      ariaLabelBlank: "Բաց թողնված տեղ {number}",
      answersShown: "Պատասխանները ցուցադրված են վերևում:"
    },
    controls: {
        checkAnswer: "Ստուգել պատասխանը",
        revealAnswer: "Ցույց տալ պատասխանը",
        nextExercise: "Հաջորդ վարժությունը",
        tryAgain: "Փորձել կրկին",
        goBack: "Հետ"
    },
    feedback: {
        correct: "Ճիշտ է:",
        incorrect: "Սխալ է, փորձիր կրկին:"
    },
    loadingExercise: "Բեռնվում է վարժությունը...",
    loadingExercises: "Բեռնվում են վարժությունները...",
    errors: {
        loadDataError: "Տվյալները բեռնել չհաջողվեց:",
        exerciseHost: {
            notFound: "Վարժության տեսակը \"<strong>{subPracticeType}</strong>\" չի գտնվել կամ դեռ ներդրված չէ:",
            title: "Վարժության սխալ",
            suggestion: "Խնդրում ենք ստուգել ExerciseHost.js-ի քարտեզագրումը կամ ընտրել այլ վարժություն:"
        }
    },
    exercises: {
        noDataForLanguage: "Այս լեզվի համար վարժություններ չեն գտնվել:",
        allCompleted: "Բոլոր վարժություններն ավարտված են: Վերականգնում...",
        noExercisesAvailable: "Այս պահին վարժություններ չկան:"
    },
    studySets: {
      myTitle: "Իմ ուսումնական հավաքածուները",
      createNewSet: "Ստեղծել նոր հավաքածու",
      noSetsFound: "Ուսումնական հավաքածուներ չեն գտնվել: Ստեղծեք մեկը՝ սկսելու համար:",
      itemsCount: "{count, plural, =0 {Տարրեր չկան} one {# տարր} other {# տարրեր}}",
      language: "Լեզու",
      studyButton: "Ուսումնասիրել",
      confirmDelete: "Համոզվա՞ծ եք, որ ցանկանում եք ջնջել \"{setName}\" ուսումնական հավաքածուն: Այս գործողությունը հնարավոր չէ հետարկել:",
      deleteSuccess: "\"{setName}\" ուսումնական հավաքածուն հաջողությամբ ջնջվել է:",
      deleteErrorNotFound: "Չհաջողվեց ջնջել \"{setName}\"-ը: Հավաքածուն չի գտնվել:",
      deleteErrorGeneric: "\"{setName}\"-ը ջնջելիս սխալ առաջացավ:",
      loadError: "Ուսումնական հավաքածուները բեռնել չհաջողվեց:",
      navigateToCreate: "Նոր հավաքածու ստեղծելու գործառույթը շուտով հասանելի կլինի:",
      studySetFunctionality: "Ուսումնասիրելու գործառույթը շուտով հասանելի կլինի:",
      editSetFunctionality: "Խմբագրելու գործառույթը շուտով հասանելի կլինի:"
    },
    studySetEditor: {
      titleEdit: "Խմբագրել ուսումնական հավաքածուն",
      titleCreate: "Ստեղծել նոր ուսումնական հավաքածու",
      nameLabel: "Հավաքածուի անվանումը՝",
      namePlaceholder: "օր.՝ Ֆրանսերենի բառապաշար Գլուխ 1",
      descriptionLabel: "Նկարագրություն (ըստ ցանկության)՝",
      descriptionPlaceholder: "Այս հավաքածուի համառոտ նկարագրությունը",
      languageCodeLabel: "Լեզվի կոդը՝",
      saveChangesButton: "Պահպանել փոփոխությունները",
      createSetButton: "Ստեղծել հավաքածու",
      errorNotFound: "Ուսումնական հավաքածուն չի գտնվել:",
      loadError: "Խմբագրման համար ուսումնական հավաքածուն բեռնել չհաջողվեց:",
      errorNameRequired: "Հավաքածուի անվանումը պարտադիր է:",
      saveSuccess: "\"{setName}\" ուսումնական հավաքածուն հաջողությամբ պահպանվել է:",
      errorSaveGeneric: "Ուսումնական հավաքածուն պահպանել չհաջողվեց:",
      cancelled: "Գործողությունը չեղարկվել է:"
    },
    flashcardEditor: {
      noSetId: "Ուսումնական հավաքածուի ID նշված չէ:",
      setNotFound: "Ուսումնական հավաքածուն չի գտնվել:",
      loadError: "Քարտերը խմբագրելու համար ուսումնական հավաքածուն բեռնել չհաջողվեց:",
      confirmDeleteCard: "Համոզվա՞ծ եք, որ ցանկանում եք ջնջել \"{term1}\" քարտը:",
      deleteCardSuccess: "Քարտը հաջողությամբ ջնջվել է:",
      deleteCardError: "Քարտը ջնջել չհաջողվեց:",
      errorTermsRequired: "Термин 1-ը և Термин 2-ը պարտադիր են:",
      updateCardSuccess: "Քարտը հաջողությամբ թարմացվել է:",
      addCardSuccess: "Քարտը հաջողությամբ ավելացվել է:",
      errorSavingCard: "Քարտը պահպանել չհաջողվեց:",
      editingTitle: "Խմբագրում եք քարտերը՝ {setName}",
      formTitleEdit: "Խմբագրել քարտը",
      formTitleAdd: "Ավելացնել նոր քարտ",
      term1Label: "Термин 1 (օր.՝ Բառ/Արտահայտություն)՝",
      term2Label: "Термин 2 (օր.՝ Թարգմանություն/Սահմանում)՝",
      imageURILabel: "Նկարի URL (ըստ ցանկության)՝",
      audioURILabel: "Աուդիոյի URL (ըստ ցանկության)՝",
      exampleSentenceLabel: "Օրինակ նախադասություն (ըստ ցանկության)՝",
      notesLabel: "Նշումներ (ըստ ցանկության)՝",
      saveCardButton: "Պահպանել քարտը",
      addCardButton: "Ավելացնել քարտ",
      cancelEditButton: "Չեղարկել խմբագրումը",
      cardsListTitle: "Քարտերն այս հավաքածուում",
      noCardsYet: "Այս հավաքածուում դեռ քարտեր չկան: Ավելացրեք մեկը վերևում:",
      term1Display: "Термин 1՝",
      term2Display: "Термин 2՝",
      exampleDisplay: "Օր.՝",
      selectSetPrompt: "Ընտրեք ուսումնական հավաքածու՝ դրա քարտերը կառավարելու համար:",
      doneButton: "Ավարտել քարտերի խմբագրումը",
      hasImage: "(նկար կա)",
      hasAudio: "(աուդիո կա)"
    },
    myStudySetsPage: {
      title: "Կառավարեք ձեր ուսումնական հավաքածուները",
      backToList: "← Վերադառնալ հավաքածուների ցանկ",
      errorSetNotFoundForPlayer: "Ուսումնասիրելու համար հավաքածուն չի գտնվել: Հնարավոր է՝ այն ջնջվել է:"
    },
    switchToStudyMode: "Ուսումնական ռեժիմ",
    calculator: {
      intro: "Օգտագործեք այս հաշվիչը՝ ձեր լեզվի դասերի արժեքը գնահատելու համար: Ընտրեք փաթեթ, տևողություն և քանակ՝ ընդհանուր գինը տեսնելու համար: Զեղչերն ավտոմատ կերպով կիրառվում են ավելի մեծ փաթեթների համար:"
    }
  },
  ka: {
    languageCode: "ka",
    cosyName: "COSYgeorgian",
    languageNameInEnglish: "Georgian",
    languageNameNative: "ქართული",
    greeting: "გამარჯობა",
    navHome: "მთავარი",
    navFreestyle: "თავისუფალი სტილი",
    navStudyMode: "სწავლის რეჟიმი",
    navMyStudySets: "ჩემი ნაკრებები",
    navProgress: "პროგრესი",
    navPersonalize: "პერსონალიზაცია",
    navInteractive: "ინტერაქტიული",
    navCommunity: "საზოგადოება",
    navStudyTools: "სასწავლო ინსტრუმენტები",
    selectPractice: "🧭 აირჩიეთ თქვენი პრაქტიკა:",
    selectDay: "🗓️ აირჩიეთ დღე(ები):",
    mainHeading: "COSYენები",
    loading: "იტვირთება...",
    saving: "ინახება...",
    cancel: "გაუქმება",
    editButton: "რედაქტირება",
    deleteButton: "წაშლა",
    auth: {
      loadingStatus: "ავთენტიფიკაციის სტატუსი იტვირთება..."
    },
    vocabulary: "🔠 ლექსიკა",
    grammar: "🧩 გრამატიკა",
    reading: "📚 კითხვა",
    speaking: "🗣️ საუბარი",
    writing: "✍️ წერა",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "უღლების პრაქტიკა",
        sentence_unscramble_exercise: "წინადადების აწყობა",
        fill_in_the_blanks_exercise: "შეავსეთ გამოტოვებული ადგილები"
      },
      vocabulary: {
        vocabulary_random_word_image: "შემთხვევითი სიტყვა/სურათი",
        vocabulary_opposites_match: "საპირისპიროები/შეასაბამეთ",
        vocabulary_letters_scramble: "ასოები",
        vocabulary_true_false: "참/거짓",
        vocabulary_listening: "მოსმენა",
        vocabulary_practice_all: "ყველას პრაქტიკა"
      }
    },
    sentenceUnscramble: {
      title: "წინადადების აწყობა",
      translationLabel: "მნიშვნელობა:",
      hintLabel: "მინიშნება:",
      dropWordsHere: "დააჭირეთ ქვემოთ მოცემულ სიტყვებს, რომ აქ წინადადება ააწყოთ...",
      clickToRemoveWord: "დააჭირეთ სიტყვის ამოსაღებად"
    },
    fillInTheBlanks: {
      title: "შეავსეთ გამოტოვებული ადგილები",
      translationLabel: "მნიშვნელობა:",
      hintLabel: "მინიშნება:",
      ariaLabelBlank: "გამოტოვებული ადგილი ნომერი {number}",
      answersShown: "პასუხები ნაჩვენებია ზემოთ."
    },
    controls: {
        checkAnswer: "პასუხის შემოწმება",
        revealAnswer: "პასუხის ჩვენება",
        nextExercise: "შემდეგი სავარჯიშო",
        tryAgain: "სცადეთ თავიდან",
        goBack: "უკან"
    },
    feedback: {
        correct: "სწორია!",
        incorrect: "არასწორია, სცადეთ თავიდან."
    },
    loadingExercise: "სავარჯიშო იტვირთება...",
    loadingExercises: "სავარჯიშოები იტვირთება...",
    errors: {
        loadDataError: "მონაცემების ჩატვირთვა ვერ მოხერხდა.",
        exerciseHost: {
            notFound: "სავარჯიშოს ტიპი \"<strong>{subPracticeType}</strong>\" ვერ მოიძებნა ან ჯერ არ არის დანერგილი.",
            title: "სავარჯიშოს შეცდომა",
            suggestion: "გთხოვთ, შეამოწმოთ რუკა ExerciseHost.js-ში ან აირჩიოთ სხვა სავარჯიშო."
        }
    },
    exercises: {
        noDataForLanguage: "ამ ენისთვის სავარჯიშოები ვერ მოიძებნა.",
        allCompleted: "ყველა სავარჯიშო დასრულებულია! თავიდან დაწყება...",
        noExercisesAvailable: "ამჟამად სავარჯიშოები არ არის ხელმისაწვდომი."
    },
    studySets: {
      myTitle: "ჩემი სასწავლო ნაკრებები",
      createNewSet: "ახალი ნაკრების შექმნა",
      noSetsFound: "სასწავლო ნაკრებები ვერ მოიძებნა. დასაწყებად შექმენით ერთი!",
      itemsCount: "{count, plural, =0 {ნივთები არ არის} one {# ნივთი} other {# ნივთი}}",
      language: "ენა",
      studyButton: "სწავლა",
      confirmDelete: "დარწმუნებული ხართ, რომ გსურთ წაშალოთ სასწავლო ნაკრები \"{setName}\"? ამ მოქმედების გაუქმება შეუძლებელია.",
      deleteSuccess: "სასწავლო ნაკრები \"{setName}\" წარმატებით წაიშალა.",
      deleteErrorNotFound: "\"{setName}\"-ის წაშლა ვერ მოხერხდა. ნაკრები ვერ მოიძებნა.",
      deleteErrorGeneric: "\"{setName}\"-ის წაშლისას მოხდა შეცდომა.",
      loadError: "სასწავლო ნაკრებების ჩატვირთვა ვერ მოხერხდა.",
      navigateToCreate: "ახალი ნაკრების შექმნის ფუნქცია მალე იქნება!",
      studySetFunctionality: "სწავლის ფუნქცია მალე იქნება!",
      editSetFunctionality: "რედაქტირების ფუნქცია მალე იქნება!"
    },
    studySetEditor: {
      titleEdit: "სასწავლო ნაკრების რედაქტირება",
      titleCreate: "ახალი სასწავლო ნაკრების შექმნა",
      nameLabel: "ნაკრების სახელი:",
      namePlaceholder: "მაგ., ფრანგული ლექსიკა თავი 1",
      descriptionLabel: "აღწერა (სურვილისამებრ):",
      descriptionPlaceholder: "ამ ნაკრების მოკლე აღწერა",
      languageCodeLabel: "ენის კოდი:",
      saveChangesButton: "ცვლილებების შენახვა",
      createSetButton: "ნაკრების შექმნა",
      errorNotFound: "სასწავლო ნაკრები ვერ მოიძებნა.",
      loadError: "რედაქტირებისთვის სასწავლო ნაკრების ჩატვირთვა ვერ მოხერხდა.",
      errorNameRequired: "ნაკრების სახელი აუცილებელია.",
      saveSuccess: "სასწავლო ნაკრები \"{setName}\" წარმატებით შეინახა!",
      errorSaveGeneric: "სასწავლო ნაკრების შენახვა ვერ მოხერხდა.",
      cancelled: "ოპერაცია გაუქმდა."
    },
    flashcardEditor: {
      noSetId: "სასწავლო ნაკრების ID არ არის მითითებული.",
      setNotFound: "სასწავლო ნაკრები ვერ მოიძებნა.",
      loadError: "ბარათების რედაქტირებისთვის სასწავლო ნაკრების ჩატვირთვა ვერ მოხერხდა.",
      confirmDeleteCard: "დარწმუნებული ხართ, რომ გსურთ წაშალოთ ბარათი \"{term1}\"?",
      deleteCardSuccess: "ბარათი წარმატებით წაიშალა.",
      deleteCardError: "ბარათის წაშლა ვერ მოხერხდა.",
      errorTermsRequired: "ტერმინი 1 და ტერმინი 2 აუცილებელია.",
      updateCardSuccess: "ბარათი წარმატებით განახლდა.",
      addCardSuccess: "ბარათი წარმატებით დაემატა.",
      errorSavingCard: "ბარათის შენახვა ვერ მოხერხდა.",
      editingTitle: "ბარათების რედაქტირება: {setName}",
      formTitleEdit: "ბარათის რედაქტირება",
      formTitleAdd: "ახალი ბარათის დამატება",
      term1Label: "ტერმინი 1 (მაგ., სიტყვა/ფრაზა):",
      term2Label: "ტერმინი 2 (მაგ., თარგმანი/განმარტება):",
      imageURILabel: "სურათის URL (სურვილისამებრ):",
      audioURILabel: "აუდიოს URL (სურვილისამებრ):",
      exampleSentenceLabel: "მაგალითი წინადადება (სურვილისამებრ):",
      notesLabel: "შენიშვნები (სურვილისამებრ):",
      saveCardButton: "ბარათის შენახვა",
      addCardButton: "ბარათის დამატება",
      cancelEditButton: "რედაქტირების გაუქმება",
      cardsListTitle: "ბარათები ამ ნაკრებში",
      noCardsYet: "ამ ნაკრებში ჯერ ბარათები არ არის. დაამატეთ ერთი ზემოთ!",
      term1Display: "ტერმინი 1:",
      term2Display: "ტერმინი 2:",
      exampleDisplay: "მაგ.:",
      selectSetPrompt: "აირჩიეთ სასწავლო ნაკრები მისი ბარათების სამართავად.",
      doneButton: "ბარათების რედაქტირების დასრულება",
      hasImage: "(აქვს სურათი)",
      hasAudio: "(აქვს აუდიო)"
    },
    myStudySetsPage: {
      title: "თქვენი სასწავლო ნაკრებების მართვა",
      backToList: "← ნაკრებების სიაში დაბრუნება",
      errorSetNotFoundForPlayer: "სასწავლო ნაკრები ვერ მოიძებნა. ის შესაძლოა წაშლილი იყოს."
    },
    switchToStudyMode: "სწავლის რეჟიმი",
    calculator: {
      intro: "გამოიყენეთ ეს კალკულატორი თქვენი ენის გაკვეთილების ღირებულების შესაფასებლად. აირჩიეთ პაკეტი, ხანგრძლივობა და რაოდენობა, რომ ნახოთ მთლიანი ფასი. ფასდაკლებები ავტომატურად ვრცელდება უფრო დიდ პაკეტებზე."
    }
  }
};

export default translations;
