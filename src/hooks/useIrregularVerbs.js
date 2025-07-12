import { useState, useEffect } from 'react';

const useIrregularVerbs = (levels, variety) => {
    const [verbs, setVerbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVerbs = async () => {
            try {
                const response = await fetch(`/data/grammar/verbs/irregular/irregular_verbs_${variety}.json`);
                if (!response.ok) {
                    throw new Error('Failed to fetch irregular verbs');
                }
                const allVerbs = await response.json();

                // Filter verbs based on levels and variety if provided
                let filteredVerbs = allVerbs;
                if (levels) {
                    const levelSet = new Set(levels.split(','));
                    filteredVerbs = filteredVerbs.filter(verb => levelSet.has(verb.level));
                }
                if (variety) {
                    filteredVerbs = filteredVerbs.filter(verb => verb.variety === variety);
                }

                setVerbs(filteredVerbs);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVerbs();
    }, [levels, variety]);

    return { verbs, loading, error };
};

export default useIrregularVerbs;
