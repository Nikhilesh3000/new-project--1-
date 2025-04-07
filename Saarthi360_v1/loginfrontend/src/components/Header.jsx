import React, { useState } from 'react';
import './Header.css';
import { FaRegQuestionCircle, FaBell, FaCog } from 'react-icons/fa';
import logo from "../assets/logo.png"; // Adjust path as needed

function Header() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const toggleSettingsDropdown = () => {
        setSettingsOpen(!settingsOpen);
        setNotificationsOpen(false); // Close notifications if open
    };

    const toggleNotificationsDropdown = () => {
        setNotificationsOpen(!notificationsOpen);
        setSettingsOpen(false); // Close settings if open
    };

    return (
        <div className="header">
            <div className="header-left">
                <img src={logo} alt="logo" className="header-logo" />
                <span className="company-name">Talent Corner HR Services Pvt. Ltd</span>
            </div>
            <div className="header-right">
                <FaRegQuestionCircle className="help-icon" />
                
                {/* Notifications */}
                <div className="icon-container" onClick={toggleNotificationsDropdown}>
                    <FaBell className="icon" />
                    {notificationsOpen && (
                        <div className="dropdown-menu notifications-dropdown">
                            <ul>
                                <li>You have a meeting at 8 AM</li>
                                <li>New employee access request</li>
                                <li>New client logged in</li>
                                <li>Message from HR</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* User Profile & Settings */}
                <div className="profile-container" onClick={toggleSettingsDropdown}>
                    <div className="user-profile"></div>
                    <FaCog className="icon" />
                    {settingsOpen && (
                        <div className="dropdown-menu settings-dropdown">
                            <ul>
                                <li>Profile</li>
                                <li>Settings</li>
                                <li>Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
