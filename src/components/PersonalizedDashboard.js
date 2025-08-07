import React from 'react';

const PersonalizedDashboard = () => {
  return (
    <div>
      <h1>Welcome to your Cosy Learning Nook!</h1>

      <div className="todays-focus">
        <h2>Today's Focus</h2>
        <p>Let's practice some common greetings in French!</p>
      </div>

      <div className="my-learning-garden">
        <h2>My Learning Garden</h2>
        <p>Your garden is just starting to grow! Keep learning to see it blossom.</p>
      </div>

      <div className="cosy-corner">
        <h2>Cosy Corner</h2>
        <p>Here are some interesting links for you:</p>
        <ul>
          <li><a href="#">Article: The Art of French Pastries</a></li>
          <li><a href="#">Video: A Virtual Tour of the Louvre</a></li>
          <li><a href="#">Music: A Playlist of French Cafe Music</a></li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
