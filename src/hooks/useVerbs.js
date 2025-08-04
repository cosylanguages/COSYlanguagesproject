import { useState, useEffect } from 'react';
import { loadConjugationData } from '../utils/conjugationDataService';

// This is the reverse mapping of langFileMap in exerciseDataService.js
const langIdentifierMap = {
    'english': 'COSYenglish',
    'french': 'COSYfrench',
    'spanish': 'COSYespañol',
    'italian': 'COSYitalian',
    'german': 'COSYdeutsch',
    'portuguese': 'COSYportugese',
    'greek': 'COSYgreek',
    'russian': 'COSYrussian',
    'armenian': 'COSYarmenian',
    'breton': 'COSYbrezhoneg',
    'tatar': 'COSYtatar',
    'bashkir': 'COSYbachkir'
};


/**
 * A custom hook that fetches and filters verb data.
 * @param {string} levels - A comma-separated string of verb levels to filter by.
 * @param {string} lang - The language of the verbs to fetch (e.g., 'en', 'es').
 * @returns {{verbs: Array, loading: boolean, error: object|null}} An object containing the filtered verbs, a loading state, and an error object.
 */
const useVerbs = (levels, lang) => {
    const [verbs, setVerbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVerbs = async () => {
            setLoading(true);
            try {
                const languageIdentifier = langIdentifierMap[lang] || `COSY${lang}`;
                const { data, error: fetchError } = await loadConjugationData(languageIdentifier);

                if (fetchError) {
                    throw new Error(fetchError);
                }

                const allVerbs = data ? data.verbs : [];

                let filteredVerbs = allVerbs;
                if (levels && levels !== 'all') {
                    const levelSet = new Set(levels.split(','));
                    filteredVerbs = allVerbs.filter(verb => {
                        // If a verb has no group, we include it, or if its group is in the selected levels.
                        return !verb.verb_group || levelSet.has(verb.verb_group);
                    });
                }

                setVerbs(filteredVerbs);
            } catch (err) {
                console.error('Error fetching or processing verbs:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (lang) {
            fetchVerbs();
        } else {
            setLoading(false);
        }
    }, [levels, lang]);

    return { verbs, loading, error };
};

export default useVerbs;
