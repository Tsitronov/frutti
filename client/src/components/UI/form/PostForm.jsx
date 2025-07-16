import React, { useState } from 'react';
import MyButton from '../button/MyButton'

const PostForm = ({ createPost }) => {
  const [post, setPost] = useState({ name: '', email: '' });

  const addPost = (e) => {
    e.preventDefault();
    const newPost = { ...post, id: Date.now() };
    createPost(newPost);
    setPost({ name: '', email: '' });
  };

  return (
    <div className = "form__wrapper">
      <div>
        <input
          type="text"
          placeholder="name"
          value={post.name}
          onChange={(e) => setPost({ ...post, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="email"
          value={post.email}
          onChange={(e) => setPost({ ...post, email: e.target.value })}
        />
        <MyButton onClick={addPost}>addPost</MyButton>
      </div>
    </div>
  );
};

export default PostForm;