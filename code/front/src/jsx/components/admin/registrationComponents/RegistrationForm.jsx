import React, { Component } from 'react';
import axios from 'axios';
import ContextMenu from '../contextMenuComponents/ContextMenu';
import AddSection from "../contextMenuComponents/sections/AddSection";
import FillSection from "../contextMenuComponents/sections/FillSection";
import ProfileSection from "../contextMenuComponents/sections/ProfileSection";
import "../../../../css/RegistrationForm.css";
import { IP } from "../../../../js/api/addres";

class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            message: '',
            activeSection: null,
            userLogin: '',
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { name, password } = this.state;

        try {
            const response = await axios.post('http://localhost:8080/api/v1/users/login', {
                login: name,
                password: password,
            });

            if (response.data.response) {
                this.setState({
                    message: 'Регистрация прошла успешно!',
                    activeSection: 'context', // Переход к контекстному меню
                    userLogin: name, // Сохраните логин пользователя
                });
            } else {
                this.setState({ message: response.data.error || 'Ошибка регистрации!' });
            }
        } catch (error) {
            this.setState({ message: error.response?.data?.error || 'Ошибка при отправке запроса!' });
        }

        this.setState({ name: '', password: '' });
    };

    handleSelectSection = (section) => {
        this.setState({ activeSection: section });
    };

    handleBack = () => {
        this.setState({ activeSection: 'context' });
    };

    handleLogout = () => {
        this.props.onLogout();
        this.setState({ activeSection: null }); // Сброс активного раздела
    };

    render() {
        const { name, password, message, activeSection, userLogin } = this.state;

        if (activeSection === 'profile') {
            return <ProfileSection userLogin={userLogin} onBack={this.handleBack} />;
        }

        if (activeSection === 'add') {
            return <AddSection onBack={this.handleBack} />;
        }

        if (activeSection === 'fill') {
            return <FillSection onBack={this.handleBack} />;
        }

        if (activeSection === 'context') {
            return (
                <ContextMenu
                    onSelect={this.handleSelectSection}
                    onLogout={this.handleLogout}
                />
            );
        }

        return (
            <div className="registration-form">
                <h2>Регистрация</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>Имя:</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Войти</button>
                </form>
                <button className="logout-button" onClick={this.handleLogout}>
                    Выйти
                </button>
                {message && <p>{message}</p>}
            </div>
        );
    }
}

export default RegistrationForm;