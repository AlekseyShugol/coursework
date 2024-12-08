import React, { Component } from 'react';
import axios from 'axios';
import ContextMenu from '../contextMenuComponents/ContextMenu'; // Импорт нового компонента
import "../../../../css/RegistrationForm.css";

class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            message: '',
            isLoggedIn: false, // Новое состояние для отслеживания входа
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
                    isLoggedIn: true // Устанавливаем состояние входа
                });
            } else {
                this.setState({ message: response.data.error || 'Ошибка регистрации!' });
            }
        } catch (error) {
            this.setState({ message: error.response?.data?.error || 'Ошибка при отправке запроса!' });
        }

        this.setState({ name: '', password: '' });
    };

    render() {
        const { name, password, message, isLoggedIn } = this.state;

        if (isLoggedIn) {
            return <ContextMenu />; // Рендерим контекстное меню
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
                {message && <p>{message}</p>}
            </div>
        );
    }
}

export default RegistrationForm;