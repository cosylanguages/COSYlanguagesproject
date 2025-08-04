import { useState, useEffect } from 'react';

/**
 * A custom hook that fetches and filters verb data.
 * @param {string} levels - A comma-separated string of verb levels to filter by.
 * @param {string} lang - The language of the verbs to fetch.
 * @returns {{verbs: Array, loading: boolean, error: object|null}} An object containing the filtered verbs, a loading state, and an error object.
 */
const useVerbs = (levels, lang) => {
    const [verbs, setVerbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVerbs = async () => {
            try {
                console.log('Fetching verbs for lang:', lang);
                const response = await fetch(`/data/grammar/verbs/grammar_verbs_${lang}.json`);
                console.log('Fetch response:', response);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.warn(`No verb data found for language: ${lang}`);
                        setVerbs([]);
                        return;
                    }
                    throw new Error('Failed to fetch verbs');
                }
                const allVerbsData = await response.json();
                console.log('Fetched data:', allVerbsData);

                let allVerbs = [];
                allVerbsData.forEach(category => {
                    allVerbs.push(...category.verbs);
                });
                console.log('All verbs:', allVerbs);

                let filteredVerbs = allVerbs;
                if (levels) {
                    const levelSet = new Set(levels.split(','));
                    console.log('Filtering by levels:', levelSet);
                    filteredVerbs = filteredVerbs.filter(verb => verb.verb_group === levels);
                }
                console.log('Filtered verbs:', filteredVerbs);

                setVerbs(filteredVerbs);
            } catch (err) {
                console.error('Error fetching verbs:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (lang) {
            fetchVerbs();
        }
    }, [levels, lang]);

    return { verbs, loading, error };
};

export default useVerbs;
