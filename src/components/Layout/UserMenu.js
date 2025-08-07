import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import TransliterableText from '../Common/TransliterableText';
import './UserMenu.css';

const UserMenu = () => {
    const { currentUser, logout, loadingAuth } = useAuth();
    const { t } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        // Navigate to login or home page after logout
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="user-menu">
            <Button onClick={toggleMenu} className="user-menu-toggle">
                <TransliterableText text={currentUser.username || 'User'} />
            </Button>
            {menuOpen && (
                <div className="user-menu-dropdown">
                    <NavLink to="/profile" className="user-menu-link">
                        <TransliterableText text={t('userMenu.profile', 'Profile')} />
                    </NavLink>
                    <NavLink to="/my-sets" className="user-menu-link">
                        <TransliterableText text={t('userMenu.mySets', 'My Sets')} />
                    </NavLink>
                    {currentUser?.role === 'admin' && (
                        <NavLink to="/admin/clubs" className="user-menu-link">
                            <TransliterableText text={t('userMenu.admin', 'Admin')} />
                        </NavLink>
                    )}
                    <Button onClick={handleLogout} disabled={loadingAuth} className="button--secondary">
                        {loadingAuth ? t('loggingOut', 'Logging out...') : t('btnLogout', 'Logout')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
