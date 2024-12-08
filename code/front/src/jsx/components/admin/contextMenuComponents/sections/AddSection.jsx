import React, { Component } from 'react';
import axios from 'axios';
// import './AddSection.css';
import '../../../../../css/AddSection.css'

class AddSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSubmenu: false,
            nodes: [],
            newName: '',
            newDescription: '',
            message: '',
            success: false,
            positions: {},
        };
    }

    async componentDidMount() {
        this.fetchNodes();
    }

    fetchNodes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/nodes');
            const nodes = response.data.filter(node => node.parentId === null);
            this.setState({ nodes: nodes.sort((a, b) => a.element_position - b.element_position) });
        } catch (error) {
            console.error('Ошибка при загрузке узлов:', error);
        }
    };

    handlePositionChange = (id, newPosition) => {
        this.setState(prevState => ({
            positions: {
                ...prevState.positions,
                [id]: newPosition,
            },
        }));
    };

    handleSavePositions = async () => {
        const { nodes, positions } = this.state;
        const updates = nodes.map(node => {
            const newPosition = positions[node.id] || node.element_position;
            return axios.put(`http://localhost:8080/api/v1/nodes/${node.id}`, {
                name: node.name,
                type: 'FOLDER',
                parentId: null,
                url: null,
                description: node.description,
                element_position: newPosition,
            });
        });

        try {
            await Promise.all(updates);
            this.setState({ message: 'Позиции успешно обновлены!', success: true });
            this.fetchNodes(); // Обновляем список узлов
        } catch (error) {
            console.error('Ошибка при обновлении позиций узлов:', error);
            this.setState({ message: 'Ошибка при обновлении позиций.', success: false });
        }
    };

    handleDeleteNode = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/nodes/${id}`);
            this.fetchNodes(); // Обновляем список узлов
        } catch (error) {
            console.error('Ошибка при удалении узла:', error);
        }
    };

    handleAddNode = async () => {
        const { newName, newDescription } = this.state;

        const newNode = {
            name: newName,
            type: 'FOLDER',
            parentId: null,
            url: null,
            description: newDescription,
            element_position: null, // Позиция будет установлена автоматически
        };

        try {
            const response = await axios.post('http://localhost:8080/api/v1/nodes', newNode);
            if (response.status === 201) {
                this.setState({
                    message: 'Раздел успешно добавлен!',
                    success: true,
                    newName: '',
                    newDescription: '',
                });
                this.fetchNodes(); // Обновляем список узлов
            }
        } catch (error) {
            console.error('Ошибка при добавлении раздела:', error);
            this.setState({
                message: 'Ошибка при добавлении раздела.',
                success: false,
            });
        }
    };

    render() {
        const { showSubmenu, nodes, newName, newDescription, message, success, positions } = this.state;

        return (
            <div className="add-section">
                <h2>Управление разделами</h2>
                <button className="toggle-button" onClick={() => this.setState({ showSubmenu: !showSubmenu })}>
                    {showSubmenu ? 'Скрыть подменю' : 'Показать подменю'}
                </button>

                {showSubmenu && (
                    <div className="submenu">
                        <h3>Изменить разделы</h3>
                        {nodes.map((node) => (
                            <div key={node.id} className="node-item">
                                <span>{node.name}</span>
                                <input
                                    type="number"
                                    placeholder="Позиция"
                                    defaultValue={node.element_position || ''}
                                    onChange={(e) => this.handlePositionChange(node.id, e.target.value)}
                                />
                                <button className="delete-button" onClick={() => this.handleDeleteNode(node.id)}>Удалить</button>
                            </div>
                        ))}
                        <button className="save-button" onClick={this.handleSavePositions}>Сохранить изменения позиций</button>

                        <h3>Добавить раздел</h3>
                        <input
                            type="text"
                            placeholder="Имя раздела"
                            value={newName}
                            onChange={(e) => this.setState({ newName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Описание"
                            value={newDescription}
                            onChange={(e) => this.setState({ newDescription: e.target.value })}
                        />
                        <button className="add-button" onClick={this.handleAddNode}>Добавить</button>
                    </div>
                )}

                {message && (
                    <p className={success ? 'success-message' : 'error-message'}>
                        {message}
                    </p>
                )}
                <button className="back-button" onClick={this.props.onBack}>Назад</button>
            </div>
        );
    }
}

export default AddSection;