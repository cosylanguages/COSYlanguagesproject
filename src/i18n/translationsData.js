// Fichier de données de traduction factice pour débloquer la compilation
// Ajoutez ici vos traductions réelles au besoin

const translations = {
  COSYenglish: {
    greeting: "Hello",
    navHome: "Home",
    navFreestyle: "Freestyle",
    navStudyMode: "Study",
    navMyStudySets: "My Sets",
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
    sentenceSkills: "📝 Sentence Skills",
    reading: "📚 Reading",
    speaking: "🗣️ Speaking",
    writing: "✍️ Writing",
    listening: "🎧 Listening",
    practiceAll: "🔁 Practice All",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Conjugation Practice"
      },
      sentenceSkills: {
        sentence_unscramble_exercise: "Sentence Unscramble"
      }
    },
    sentenceUnscramble: {
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
    loadingExercise: "Loading exercise...",
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
      selectSetPrompt: "Select a study set to manage its cards."
    },
    myStudySetsPage: {
      title: "Manage Your Study Sets",
      backToList: "← Back to Set List",
      errorSetNotFoundForPlayer: "Could not find the set to study. It may have been deleted." // New key
    }
  },
  COSYfrench: {
    greeting: "Bonjour",
    navHome: "Accueil",
    navFreestyle: "Mode Libre",
    navStudyMode: "Mode Étude",
    navMyStudySets: "Mes Decks",
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
    sentenceSkills: "📝 Compétences de Phrase",
    reading: "📚 Lecture",
    speaking: "🗣️ Expression Orale",
    writing: "✍️ Expression Écrite",
    listening: "🎧 Écoute",
    practiceAll: "🔁 Tout Pratiquer",
    subPractice: {
      grammar: {
        grammar_conjugation_practice: "Pratique de Conjugaison"
      },
      sentenceSkills: {
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
    loadingExercise: "Chargement de l'exercice...",
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
      selectSetPrompt: "Sélectionnez un deck d'étude pour gérer ses fiches."
    },
    myStudySetsPage: {
      title: "Gérer Vos Decks d'Étude",
      backToList: "← Retour à la Liste des Decks",
      errorSetNotFoundForPlayer: "Impossible de trouver le deck à étudier. Il a peut-être été supprimé." // New key
    }
  }
};

export default translations;
