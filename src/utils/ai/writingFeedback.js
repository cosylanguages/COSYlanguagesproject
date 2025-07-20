export const getWritingFeedback = async (text) => {
    const response = await fetch('https://languagetool.org/api/v2/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(text)}&language=en-US`,
    });

    if (!response.ok) {
        throw new Error('Failed to get writing feedback from LanguageTool API');
    }

    const data = await response.json();

    return data.matches.map(match => ({
        message: match.message,
        type: match.rule.issueType,
    }));
};
