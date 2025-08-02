import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../i18n/I18nContext';
import SpeakingClubPost from '../components/Community/SpeakingClubPost';
import { getEvents } from '../api/community';
import './Community.css';
import StudyLayout from '../components/Layout/StudyLayout';

const Community = () => {
  const { t } = useI18n();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('current'); // 'current' or 'past'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { events: fetchedEvents, totalPages: fetchedTotalPages } = await getEvents({
        filter,
        page: currentPage,
        limit: 5,
      });
      setEvents(fetchedEvents);
      setTotalPages(fetchedTotalPages);
    } catch (err) {
      setError('Failed to fetch events.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <StudyLayout>
      <div className="community-page">
        <div className="community-header">
          <h1>{t('community.title', 'Community')}</h1>
          <div className="event-filter">
            <button
              className={filter === 'current' ? 'active' : ''}
              onClick={() => handleFilterChange('current')}
            >
              {t('community.filter.current', 'Current Events')}
            </button>
            <button
              className={filter === 'past' ? 'active' : ''}
              onClick={() => handleFilterChange('past')}
            >
              {t('community.filter.past', 'Past Events')}
            </button>
          </div>
        </div>

        <div className="community-main">
          {loading && <p>{t('community.loading', 'Loading...')}</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && events.length > 0 ? (
            events.map(event => (
              <SpeakingClubPost key={event._id} event={event} />
            ))
          ) : (
            !loading && <p>{t('community.noEvents', 'No events to display.')}</p>
          )}
        </div>

        <div className="pagination-controls">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            {t('pagination.previous', 'Previous')}
          </button>
          <span>
            {t('pagination.page', 'Page')} {currentPage} {t('pagination.of', 'of')} {totalPages}
          </span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            {t('pagination.next', 'Next')}
          </button>
        </div>
      </div>
    </StudyLayout>
  );
};

export default Community;
