import React from 'react';

const LetsCelebrate = ({ content }) => {
  if (!content) return null;
  return (
    <div className="specialized-club-section">
      <h4>Let's Celebrate</h4>
      {content.comparisonMatrix && (
        <div>
          <h5>Holiday Comparison</h5>
          {/* A simple table for the matrix */}
          <table>
            <thead>
              <tr>
                <th>Tradition</th>
                <th>Country A</th>
                <th>Country B</th>
              </tr>
            </thead>
            <tbody>
              {content.comparisonMatrix.map((row, i) => (
                <tr key={i}>
                  <td>{row.tradition}</td>
                  <td>{row.countryA}</td>
                  <td>{row.countryB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {content.greetingTemplates && (
        <div>
          <h5>Holiday Greetings</h5>
          {content.greetingTemplates.map((template, i) => (
            <p key={i}>"{template}"</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LetsCelebrate;
