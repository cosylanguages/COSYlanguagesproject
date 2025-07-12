import { useState, useEffect, useCallback } from 'react';

const useIrregularVerbs = (levels, variety) => {
    const [verbs, setVerbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVerbs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch irregular verbs
            const irregularVerbsResponse = await fetch('/data/grammar/verbs/irregular/irregular_verbs_COSYenglish.json');
            const irregularVerbsData = await irregularVerbsResponse.json();

            // Fetch verb definitions
            const dictionaryPromises = levels.split(',').map(level =>
                fetch(`/data/vocabulary/dictionary/en/${level}.js`).then(res => res.text())
            );
            const dictionaryScripts = await Promise.all(dictionaryPromises);

            const allVerbs = {};
            dictionaryScripts.forEach(script => {
                const exports = {};
                const processScript = new Function('exports', script);
                processScript(exports);
                const vocabData = Object.values(exports)[0];
                Object.values(vocabData).forEach(category => {
                    category.forEach(verb => {
                        if (verb.partOfSpeech.startsWith('v')) {
                            allVerbs[verb.term] = {
                                definition: verb.definition,
                                example: verb.example,
                                level: verb.level
                            };
                        }
                    });
                });
            });

            // Combine irregular verbs with definitions
            const combinedVerbs = irregularVerbsData.map(verb => {
                const details = allVerbs[verb.base];
                return {
                    ...verb,
                    ...details
                };
            }).filter(verb => verb.level && levels.split(',').includes(verb.level));

            setVerbs(combinedVerbs);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [levels]);

    useEffect(() => {
        fetchVerbs();
    }, [fetchVerbs]);

    return { verbs, loading, error };
};

export default useIrregularVerbs;
