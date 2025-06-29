import React, { useEffect } from 'react';
import { usePlan } from './PlanContext';

function App({ authToken }) {
    const { plan, fetchPlan } = usePlan();

    useEffect(() => {
        if (authToken) fetchPlan(authToken);
    }, [authToken, fetchPlan]);

    // Example rendering of days and study sets
    return (
        <div>
            <h1>Plan Overview</h1>
            <h2>Days</h2>
            <ul>
                {plan.days.map(day => (
                    <li key={day.id}>
                        <strong>{day.title || `Day ${day.id}`}</strong>
                        <ul>
                            {day.sections.map(section => (
                                <li key={section.id}>
                                    {section.title || `Section ${section.id}`}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <h2>Study Sets</h2>
            <ul>
                {plan.studySets.map(set => (
                    <li key={set.id}>
                        {set.title || `Set ${set.id}`} ({set.itemCount} items)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;