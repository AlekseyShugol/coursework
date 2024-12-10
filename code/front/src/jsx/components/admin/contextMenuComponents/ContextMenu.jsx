import React, { Component } from 'react';
import '../../../../css/ContextMenu.css'

class ContextMenu extends Component {
    render() {
        return (
            <div className="context-menu">
                <ul>
                    <li onClick={() => this.props.onSelect('profile')}>Личный кабинет</li>
                    <li onClick={() => this.props.onSelect('add')}>Изменить раздел</li>
                    <li onClick={() => this.props.onSelect('fill')}>Заполнить раздел</li>
                    <li onClick={this.props.onLogout}>Выйти</li> {/* Кнопка "Выйти" */}
                </ul>
            </div>
        );
    }
}

export default ContextMenu;