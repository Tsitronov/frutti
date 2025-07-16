import React, { useState } from 'react';
import MyButton from '../button/MyButton'

const UserForm = ({ createUser }) => {
  const [user, setUser] = useState({ title: '', body: '' });

  const addUser = (e) => {
    e.preventDefault();
    const newUser = { ...user, id: Date.now() };
    createUser(newUser);
    setUser({ title: '', body: '' });
  };

  return (
    <div className = "form__wrapper">
      <div>
        <input
          type="text"
          placeholder="Title"
          value={user.title}
          onChange={(e) => setUser({ ...user, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Body"
          value={user.body}
          onChange={(e) => setUser({ ...user, body: e.target.value })}
        />
        <MyButton onClick={addUser}>Add User</MyButton>
      </div>
    </div>
  );
};

export default UserForm;