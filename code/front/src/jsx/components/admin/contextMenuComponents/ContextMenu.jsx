import React, { Component } from 'react';

class ContextMenu extends Component {
    handleMenuClick = (section) => {
        alert(`Вы выбрали: ${section}`); // Здесь можно заменить на логику для работы с выбранным разделом
    };

    render() {
        return (
            <div className="context-menu">
                <h2>Личный кабинет</h2>
                <ul>
                    <li onClick={() => this.handleMenuClick('Добавить раздел')}>Добавить раздел</li>
                    <li onClick={() => this.handleMenuClick('Заполнить раздел')}>Заполнить раздел</li>
                </ul>
            </div>
        );
    }
}

export default ContextMenu;