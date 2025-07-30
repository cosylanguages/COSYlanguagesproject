import React from 'react';
import './Post.css';

// This component displays a single post in the feed.
function Post({ post, t }) {
  // TODO: The `t` function should be provided by a proper i18n context/provider.
  const translate = t || ((key, vars) => {
    // Basic placeholder for variable substitution
    if (vars) {
      return Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, v), key);
    }
    return key.split('.').pop();
  });


  const { author, avatar, text, image, likes, comments } = post;

  return (
    <div className="post">
      <div className="post-header">
        <img src={avatar} alt={translate('post.authorAvatar', { author })} className="post-avatar" />
        <h3 className="post-author">{author}</h3>
      </div>
      <p className="post-text">{text}</p>
      {image && <img src={image} alt={translate('post.imageAlt')} className="post-image" />}
      <div className="post-actions">
        <button className="post-action-button" onClick={() => { /* TODO: Implement like functionality */ }}>{translate('post.like', { count: likes })}</button>
        <button className="post-action-button" onClick={() => { /* TODO: Implement comment functionality */ }}>{translate('post.comment', { count: comments })}</button>
        <button className="post-action-button" onClick={() => { /* TODO: Implement share functionality */ }}>{translate('post.share')}</button>
      </div>
    </div>
  );
}

export default Post;
