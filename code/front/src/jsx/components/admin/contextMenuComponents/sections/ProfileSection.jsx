import React, { Component } from 'react';
import axios from 'axios';
import '../../../../../css/ProfileSection.css'; // Импорт стилей
import { IP } from "../../../../../js/api/addres";

class ProfileSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            loading: true,
            error: null,
            newLogin: '',
            newPassword: '',
            updateMessage: '',
            updateSuccess: false,
            showUpdateFields: false,
            newUser: {
                login: '',
                password: '',
                role: ''
            },
            roles: ['admin', 'redactor'],
            showAddUserFields: false,
            addUserMessage: '',
            addUserSuccess: false,
        };
    }

    async componentDidMount() {
        const { userLogin } = this.props;
        try {
            const response = await axios.get(`http://${IP}:8080/api/v1/users/logins/${userLogin}`);
            this.setState({ userData: response.data, loading: false });
        } catch (error) {
            this.setState({ error: 'Ошибка при загрузке данных пользователя', loading: false });
        }
    }

    handleUpdateUser = async () => {
        const { newLogin, newPassword, userData } = this.state;
        const userId = userData.id;

        const updateData = {
            id: userId,
            login: newLogin || userData.login,
            password: newPassword || userData.password,
            role: userData.role,
        };

        try {
            const response = await axios.put(`http://${IP}:8080/api/v1/users/${userId}`, updateData);
            console.log('Response:', response.data);

            if (response.status === 202) {
                this.setState({
                    updateMessage: 'Данные успешно изменены!',
                    updateSuccess: true,
                    userData: { ...userData, login: updateData.login },
                });
            } else {
                this.setState({
                    updateMessage: 'Не удалось изменить данные.',
                    updateSuccess: false,
                });
            }
        } catch (error) {
            console.log('Error:', error);
            this.setState({
                updateMessage: 'Ошибка при изменении данных',
                updateSuccess: false,
            });
        }
    };

    handleAddUser = async () => {
        const { newUser } = this.state;

        try {
            const response = await axios.post(`http://${IP}:8080/api/v1/users`, newUser);
            console.log('Response:', response.data);

            if (response.status === 201) {
                this.setState({
                    addUserMessage: 'Пользователь успешно добавлен!',
                    addUserSuccess: true,
                    newUser: { login: '', password: '', role: '' }, // Сброс формы
                });
            } else {
                this.setState({
                    addUserMessage: 'Не удалось добавить пользователя.',
                    addUserSuccess: false,
                });
            }
        } catch (error) {
            console.log('Error:', error);
            this.setState({
                addUserMessage: 'Ошибка при добавлении пользователя',
                addUserSuccess: false,
            });
        }
    };

    render() {
        const { userData, loading, error, updateMessage, updateSuccess, showUpdateFields,
            newUser, roles, showAddUserFields, addUserMessage, addUserSuccess } = this.state;

        if (loading) return <div>Загрузка...</div>;
        if (error) return <div className="error-message">{error}</div>;

        return (
            <div className="profile-section">
                <h2>Личный кабинет</h2>
                <h3>{userData.login}</h3>
                <p>Роль: {userData.role}</p>

                <button onClick={() => this.setState({ showUpdateFields: !showUpdateFields })}>
                    {showUpdateFields ? 'Скрыть поля изменения данных' : 'Изменить данные'}
                </button>

                {showUpdateFields && (
                    <div>
                        <input
                            type="text"
                            placeholder="Новый логин"
                            onChange={(e) => this.setState({ newLogin: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Новый пароль"
                            onChange={(e) => this.setState({ newPassword: e.target.value })}
                        />
                        <button onClick={this.handleUpdateUser}>Подтвердить изменение</button>
                    </div>
                )}

                {updateMessage && (
                    <p className={updateSuccess ? 'success-message' : 'error-message'}>
                        {updateMessage}
                    </p>
                )}

                <button onClick={() => this.setState({ showAddUserFields: !showAddUserFields })}>
                    {showAddUserFields ? 'Скрыть добавление пользователя' : 'Добавить пользователя'}
                </button>

                {showAddUserFields && (
                    <div>
                        <input
                            type="text"
                            placeholder="Логин"
                            value={newUser.login}
                            onChange={(e) => this.setState({ newUser: { ...newUser, login: e.target.value } })}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={newUser.password}
                            onChange={(e) => this.setState({ newUser: { ...newUser, password: e.target.value } })}
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => this.setState({ newUser: { ...newUser, role: e.target.value } })}
                        >
                            <option value="">Выберите роль</option>
                            {roles.map((role, index) => (
                                <option key={index} value={role}>{role}</option>
                            ))}
                        </select>
                        <button onClick={this.handleAddUser}>Добавить</button>
                    </div>
                )}

                {addUserMessage && (
                    <p className={addUserSuccess ? 'success-message' : 'error-message'}>
                        {addUserMessage}
                    </p>
                )}

                <button onClick={this.props.onBack}>Назад</button>
            </div>
        );
    }
}

export default ProfileSection;