import React, { Component } from 'react';
import axios from 'axios';
import { IP } from "../../../../../js/api/addres";

class FillSection extends Component {
    state = {
        folders: [],
        newFolderName: '',
        showAddOptions: false,
    };

    componentDidMount() {
        this.loadFolders();
    }

    loadFolders = async () => {
        try {
            const response = await axios.get(`http://${IP}:8080/api/v1/nodes`);
            const folders = response.data || []; // Убедитесь, что это массив
            const structuredFolders = this.buildFolderTree(folders);
            this.setState({ folders: structuredFolders });
        } catch (error) {
            console.error('Ошибка при загрузке папок:', error);
        }
    };

    buildFolderTree = (folders) => {
        const folderMap = {};
        folders.forEach(folder => {
            folderMap[folder.id] = { ...folder, children: [] };
        });

        const folderTree = [];
        folders.forEach(folder => {
            if (folder.parentId === null) {
                folderTree.push(folderMap[folder.id]); // Корневая папка
            } else {
                folderMap[folder.parentId].children.push(folderMap[folder.id]); // Подпапка
            }
        });

        // Сортируем корневые папки по полю element_position
        return this.sortFolders(folderTree);
    };

    sortFolders = (folders) => {
        return folders
            .sort((a, b) => a.element_position - b.element_position) // Сортировка по element_position
            .map(folder => ({
                ...folder,
                children: this.sortFolders(folder.children), // Рекурсивная сортировка подпапок
            }));
    };

    handleFolderClick = (folderId) => {
        this.setState(prevState => {
            const folders = this.toggleFolderExpand(prevState.folders, folderId);
            return { folders };
        });
    };

    toggleFolderExpand = (folders, folderId) => {
        return folders.map(folder => {
            if (folder.id === folderId) {
                return { ...folder, expanded: !folder.expanded };
            }
            if (folder.children) {
                return { ...folder, children: this.toggleFolderExpand(folder.children, folderId) };
            }
            return folder;
        });
    };

    handleDeleteFolder = async (folderId) => {
        try {
            await axios.delete(`http://${IP}:8080/api/v1/nodes/${folderId}`);
            this.setState(prevState => ({
                folders: this.deleteFolder(prevState.folders, folderId),
            }));
        } catch (error) {
            console.error('Ошибка при удалении папки:', error);
        }
    };

    deleteFolder = (folders, folderId) => {
        return folders.filter(folder => {
            if (folder.id === folderId) {
                return false; // Удаляем папку
            }
            if (folder.children) {
                folder.children = this.deleteFolder(folder.children, folderId);
            }
            return true;
        });
    };

    handleAddFolder = async () => {
        const { newFolderName } = this.state;
        if (!newFolderName) return; // Предотвращаем добавление пустой папки
        try {
            const response = await axios.post(`http://${IP}:8080/api/v1/nodes`, {
                name: newFolderName,
                type: 'FOLDER',
                parentId: null, // Установите parentId в нужное значение
                element_position: 0, // Установите позицию по умолчанию
            });
            const newFolder = { ...response.data, children: [] };
            this.setState(prevState => ({
                folders: this.sortFolders([...prevState.folders, newFolder]), // Сортируем обновленный список папок
                newFolderName: '',
                showAddOptions: false,
            }));
        } catch (error) {
            console.error('Ошибка при добавлении папки:', error);
        }
    };

    renderFolders = (folders) => {
        return folders.map(folder => (
            <div key={folder.id} style={{ marginLeft: '20px', border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h3 onClick={() => this.handleFolderClick(folder.id)}>
                    {folder.name} {folder.children && folder.children.length > 0 && (folder.expanded ? '-' : '+')}
                </h3>
                <button onClick={() => this.handleDeleteFolder(folder.id)} style={{ marginLeft: 10 }}>Удалить</button>
                {folder.expanded && folder.children.length > 0 && this.renderFolders(folder.children)}
            </div>
        ));
    };

    render() {
        const { folders, showAddOptions, newFolderName } = this.state;

        return (
            <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', border: '2px solid #000' }}>
                <h1>Список папок</h1>
                <button onClick={() => this.setState({ showAddOptions: true })}>Добавить папку</button>
                {showAddOptions && (
                    <div>
                        <input
                            type="text"
                            placeholder="Имя папки"
                            value={newFolderName}
                            onChange={(e) => this.setState({ newFolderName: e.target.value })}
                        />
                        <button onClick={this.handleAddFolder}>Сохранить</button>
                    </div>
                )}
                {folders.length > 0 ? this.renderFolders(folders) : <p>Нет доступных папок.</p>}
            </div>
        );
    }
}

export default FillSection;