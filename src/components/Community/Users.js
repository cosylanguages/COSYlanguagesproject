// src/components/Community/Users.js
import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { getUsers as apiGetUsers } from '../../api/community';
import './Users.css';

const Users = () => {
  const { t } = useI18n();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="users">
      <h3>{t('community.users.title', 'Users')}</h3>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>{t('community.users.loading', 'Loading users...')}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
