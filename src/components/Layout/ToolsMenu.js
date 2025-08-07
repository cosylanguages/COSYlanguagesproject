import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import TransliterableText from '../Common/TransliterableText';
import './ToolsMenu.css';

const ToolsMenu = () => {
    const { t } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="tools-menu">
            <Button onClick={toggleMenu} className="tools-menu-toggle">
                <TransliterableText text={t('toolsMenu.title', 'Tools')} />
            </Button>
            {menuOpen && (
                <div className="tools-menu-dropdown">
                    <NavLink to="/calculator" className="tools-menu-link">
                        <TransliterableText text={t('toolsMenu.calculator', 'Calculator')} />
                    </NavLink>
                    <NavLink to="/dictionary" className="tools-menu-link">
                        <TransliterableText text={t('toolsMenu.dictionary', 'Dictionary')} />
                    </NavLink>
                    <NavLink to="/grammar-guidebooks" className="tools-menu-link">
                        <TransliterableText text={t('toolsMenu.grammar', 'Grammar')} />
                    </NavLink>
                </div>
            )}
        </div>
    );
};

export default ToolsMenu;
