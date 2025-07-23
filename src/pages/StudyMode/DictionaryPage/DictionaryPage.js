import React, { useState } from 'react';
import DictionaryTool from '../../components/StudyMode/StudentTools/DictionaryTool';
import './DictionaryPage.css';

const DictionaryPage = () => {
    const [isDictionaryOpen, setIsDictionaryOpen] = useState(true);

    // Since DictionaryTool is now a page, the isOpen prop is always true
    // and the onClose prop is a no-op.
    return (
        <div className="dictionary-page">
            <DictionaryTool
                isOpen={isDictionaryOpen}
                onClose={() => setIsDictionaryOpen(false)}
            />
        </div>
    );
};

export default DictionaryPage;
