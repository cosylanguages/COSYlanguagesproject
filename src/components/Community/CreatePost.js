
import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';

const CreatePost = ({ userId }) => {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);
    formData.append('caption', caption);
    formData.append('author', userId);
    axios.post('/posts/add', formData)
      .then(res => console.log(res.data));
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div>
        <label>Vidéo</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
      </div>
      <div>
        <label>Légende</label>
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      <button type="submit">Publier</button>
    </form>
  );
};

export default CreatePost;
