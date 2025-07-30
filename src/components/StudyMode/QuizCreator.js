import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import toast from 'react-hot-toast';

const QuizCreator = () => {
    const { t } = useI18n();
    const [quiz, setQuiz] = useState(() => {
        const savedQuiz = localStorage.getItem('quiz');
        return savedQuiz ? JSON.parse(savedQuiz) : { title: '', questions: [] };
    });

    useEffect(() => {
        localStorage.setItem('quiz', JSON.stringify(quiz));
    }, [quiz]);

    const handleAddQuestion = () => {
        const newQuestion = {
            text: '',
            options: ['', '', '', ''],
            correctOption: 0,
            type: 'multiple-choice',
        };
        setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[index][field] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSaveQuiz = () => {
        // In a real app, this would save to a backend.
        // For now, we just show a success message.
        toast.success(t('studyMode.quizSaved', 'Quiz saved successfully!'));
    };

    return (
        <div className="quiz-creator">
            <h2>{t('studyMode.quizCreatorTitle', 'Quiz Creator')}</h2>
            <input
                type="text"
                placeholder={t('studyMode.quizTitlePlaceholder', 'Quiz Title')}
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
            {quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-creator">
                    <input
                        type="text"
                        placeholder={t('studyMode.questionPlaceholder', 'Question Text')}
                        value={question.text}
                        onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    />
                    {question.options.map((option, oIndex) => (
                        <input
                            key={oIndex}
                            type="text"
                            placeholder={t('studyMode.optionPlaceholder', `Option ${oIndex + 1}`)}
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        />
                    ))}
                    <select
                        value={question.correctOption}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctOption', parseInt(e.target.value))}
                    >
                        {question.options.map((_, oIndex) => (
                            <option key={oIndex} value={oIndex}>
                                {t('studyMode.optionLabel', `Option ${oIndex + 1}`)}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            <button onClick={handleAddQuestion}>{t('studyMode.addQuestionButton', 'Add Question')}</button>
            <button onClick={handleSaveQuiz}>{t('studyMode.saveQuizButton', 'Save Quiz')}</button>
        </div>
    );
};

export default QuizCreator;
