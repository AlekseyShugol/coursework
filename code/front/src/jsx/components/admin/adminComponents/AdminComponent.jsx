// src/jsx/components/admin/Admin.js
import React from 'react';
import RegistrationForm from '../registrationComponents/RegistrationForm'; // Импортируйте вашу форму регистрации

const Admin = () => {
    return (
        <div>
            <h1>Добро пожаловать в административную панель!</h1>
            <RegistrationForm />
        </div>
    );
};

export default Admin;