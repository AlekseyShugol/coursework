import React, { Component } from 'react';
import './ProfileSection.css';

class ProfileSection extends Component {
    render() {
        return (
            <div className="profile-section">
                <h2>Личный кабинет</h2>
                <p>Добро пожаловать в ваш личный кабинет!</p>
                <button onClick={this.props.onBack}>Назад</button>
            </div>
        );
    }
}

export default ProfileSection;