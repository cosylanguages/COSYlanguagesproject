import React, { useState, useEffect, useCallback } from 'react';
import { getClubs, createClub, updateClub, deleteClub } from '../../api/community';
import { useI18n } from '../../i18n/I18nContext';
import './ClubsManager.css';

const ClubsManager = () => {
  const { t } = useI18n();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClub, setEditingClub] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedClubs = await getClubs();
      setClubs(fetchedClubs);
    } catch (err) {
      setError('Failed to fetch clubs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingClub({
      title: '',
      description: '',
      level: 'Beginner',
      clubType: 'Book Club',
      inspiringMaterial: {
        thumbnail: '',
      },
    });
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setIsCreating(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        await deleteClub(id);
        fetchClubs();
      } catch (err) {
        setError('Failed to delete club.');
        console.error(err);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await createClub(editingClub);
      } else {
        await updateClub(editingClub._id, editingClub);
      }
      setEditingClub(null);
      fetchClubs();
    } catch (err) {
      setError('Failed to save club.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'thumbnail') {
      setEditingClub({
        ...editingClub,
        inspiringMaterial: { ...editingClub.inspiringMaterial, thumbnail: value },
      });
    } else {
      setEditingClub({ ...editingClub, [name]: value });
    }
  };

  if (loading) return <p>{t('community.clubs.loading', 'Loading clubs...')}</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="clubs-manager">
      <h1>{t('admin.clubs.manager.title', 'Clubs Manager')}</h1>
      <button onClick={handleCreate} className="create-btn">{t('admin.clubs.manager.create', 'Create New Club')}</button>

      {editingClub && (
        <div className="club-form">
          <h2>{isCreating ? t('admin.clubs.manager.form.createTitle', 'Create Club') : t('admin.clubs.manager.form.editTitle', 'Edit Club')}</h2>
          <input name="title" value={editingClub.title} onChange={handleChange} placeholder={t('admin.clubs.manager.form.title', 'Title')} />
          <textarea name="description" value={editingClub.description} onChange={handleChange} placeholder={t('admin.clubs.manager.form.description', 'Description')} />
          <input name="level" value={editingClub.level} onChange={handleChange} placeholder={t('admin.clubs.manager.form.level', 'Level')} />
          <input name="clubType" value={editingClub.clubType} onChange={handleChange} placeholder={t('admin.clubs.manager.form.clubType', 'Club Type')} />
          <input name="thumbnail" value={editingClub.inspiringMaterial.thumbnail} onChange={handleChange} placeholder={t('admin.clubs.manager.form.thumbnail', 'Thumbnail URL')} />
          <button onClick={handleSave}>{t('admin.clubs.manager.form.save', 'Save')}</button>
          <button onClick={() => setEditingClub(null)}>{t('admin.clubs.manager.form.cancel', 'Cancel')}</button>
        </div>
      )}

      <div className="clubs-list">
        {clubs.map((club) => (
          <div key={club._id} className="club-item">
            <span>{club.title}</span>
            <div>
              <button onClick={() => handleEdit(club)}>{t('admin.clubs.manager.edit', 'Edit')}</button>
              <button onClick={() => handleDelete(club._id)}>{t('admin.clubs.manager.delete', 'Delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubsManager;
