import { useState, useEffect } from 'react';

const useVerbs = (levels, lang) => {
    const [verbs, setVerbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVerbs = async () => {
            try {
                console.log('Fetching verbs for lang:', lang);
                const response = await fetch(`/data/grammar/verbs/verbs_${lang}.json`);
                console.log('Fetch response:', response);
                if (!response.ok) {
                    throw new Error('Failed to fetch verbs');
                }
                const allVerbsData = await response.json();
                console.log('Fetched data:', allVerbsData);

                let allVerbs = [];
                allVerbsData.forEach(category => {
                    allVerbs.push(...category.verbs);
                });
                console.log('All verbs:', allVerbs);

                // Filter verbs based on levels if provided
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
