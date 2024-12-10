import React, { Component } from 'react';
import axios from 'axios';
import { IP } from "../../../../../js/api/addres";

class FillSection extends Component {
    state = {
        folders: [],
        currentParentId: null,
        currentType: null,
        showAddOptions: null,
        inputValues: {
            name: '',
            url: '',
            description: '',
            file: null,
            fileExtension: '', // Добавлено свойство для расширения файла
            element_position: 0,
        },
    };

    componentDidMount() {
        this.loadFolders();
    }

    loadFolders = async () => {
        try {
            const response = await axios.get(`http://${IP}:8080/api/v1/nodes`);
            const folders = response.data || [];
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
                folderTree.push(folderMap[folder.id]);
            } else {
                folderMap[folder.parentId]?.children.push(folderMap[folder.id]);
            }
        });

        return this.sortFolders(folderTree);
    };

    sortFolders = (folders) => {
        return folders
            .sort((a, b) => a.element_position - b.element_position)
            .map(folder => ({
                ...folder,
                children: this.sortFolders(folder.children),
            }));
    };

    handleAddItem = async () => {
        const { currentParentId, currentType, inputValues } = this.state;

        // Проверка на наличие типа и имени
        if (!currentType || !inputValues.name) {
            console.warn('Необходимо указать тип и название.');
            return;
        }

        // Условие для загрузки файла
        if (currentType === 'FILE' && inputValues.file) {
            try {
                const fileResponse = await this.uploadFile(inputValues.file, currentParentId, inputValues.name, inputValues.description);
                const fileUrl = fileResponse.data.filePath;

                // Сохраняем имя исходного файла и получаем его расширение
                const originalFileName = inputValues.file.name;
                const fileExtension = originalFileName.split('.').pop(); // Получаем расширение

                // Формируем новый URL с расширением
                const fullUrl = `/resources/files/${inputValues.name}.${fileExtension}`;

                const payload = {
                    name: inputValues.name,
                    type: currentType,
                    parentId: currentParentId,
                    url: fullUrl, // Используем полный URL с расширением
                    description: inputValues.description || null,
                    element_position: inputValues.element_position || 0,
                };

                console.log('Payload для добавления:', payload); // Для отладки

                await axios.post(`http://${IP}:8080/api/v1/nodes`, payload);
                this.resetAddState();
                this.loadFolders();
            } catch (error) {
                console.error('Ошибка при добавлении файла:', error);
            }
        } else {
            const payload = {
                name: inputValues.name,
                type: currentType,
                parentId: currentParentId,
                url: currentType === 'FILE' ? `/resources/files/${inputValues.name}` : inputValues.url,
                description: inputValues.description || null,
                element_position: inputValues.element_position || 0,
            };

            try {
                await axios.post(`http://${IP}:8080/api/v1/nodes`, payload);
                this.resetAddState();
                this.loadFolders();
            } catch (error) {
                console.error('Ошибка при добавлении элемента:', error);
            }
        }
    };

    uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('fileName', this.state.inputValues.name);

        const fileExtension = file.name.split('.').pop(); // Извлечение расширения файла
        this.setState(prevState => ({
            inputValues: {
                ...prevState.inputValues,
                fileExtension, // Сохранение расширения в состоянии
            }
        }));

        return await axios.post(`http://localhost:5000/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    resetAddState = () => {
        this.setState({
            currentParentId: null,
            currentType: null,
            showAddOptions: null,
            inputValues: { name: '', url: '', description: '', file: null, fileExtension: '', element_position: 0 },
        });
    };

    handleDeleteFolder = async (folderId) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту папку?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://${IP}:8080/api/v1/nodes/${folderId}`);
                this.loadFolders();
            } catch (error) {
                console.error('Ошибка при удалении папки:', error);
            }
        }
    };

    renderAddForm = (folderId) => {
        const { inputValues, currentType } = this.state;

        return (
            <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
                <h4>Добавление {currentType === 'FOLDER' ? 'папки' : currentType === 'LINK' ? 'ссылки' : 'файла'}</h4>
                <input
                    type="text"
                    placeholder="Название"
                    value={inputValues.name}
                    onChange={(e) => this.setState({ inputValues: { ...inputValues, name: e.target.value } })}
                />
                {currentType === 'LINK' && (
                    <>
                        <input
                            type="text"
                            placeholder="Ссылка"
                            value={inputValues.url}
                            onChange={(e) => this.setState({ inputValues: { ...inputValues, url: e.target.value } })}
                        />
                        <input
                            type="text"
                            placeholder="Описание"
                            value={inputValues.description}
                            onChange={(e) => this.setState({ inputValues: { ...inputValues, description: e.target.value } })}
                        />
                    </>
                )}
                {currentType === 'FILE' && (
                    <>
                        <input
                            type="text"
                            placeholder="Описание"
                            value={inputValues.description}
                            onChange={(e) => this.setState({ inputValues: { ...inputValues, description: e.target.value } })}
                        />
                        <input
                            type="file"
                            onChange={(e) => this.setState({ inputValues: { ...inputValues, file: e.target.files[0] } })}
                        />
                        <input
                            type="number"
                            placeholder="Позиция элемента"
                            value={inputValues.element_position}
                            onChange={(e) => this.setState({ inputValues: { ...inputValues, element_position: Number(e.target.value) } })}
                        />
                    </>
                )}
                <div>
                    <button onClick={this.handleAddItem} style={{ backgroundColor: 'green', color: 'white', margin: '5px' }}>
                        Сохранить
                    </button>
                    <button onClick={this.resetAddState} style={{ backgroundColor: 'red', color: 'white' }}>
                        Отмена
                    </button>
                </div>
            </div>
        );
    };

    renderAddOptions = (folderId) => {
        return (
            <div>
                <button onClick={() => this.setState({ currentType: 'FOLDER', showAddOptions: folderId })}>Папка</button>
                <button onClick={() => this.setState({ currentType: 'FILE', showAddOptions: folderId })}>Файл</button>
                <button onClick={() => this.setState({ currentType: 'LINK', showAddOptions: folderId })}>Ссылка</button>
            </div>
        );
    };

    renderFolders = (folders) => {
        return folders.map(folder => (
            <div key={folder.id} style={{ marginLeft: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>
                    {folder.name}
                    <button
                        onClick={() => {
                            this.setState({
                                currentParentId: folder.id,
                                showAddOptions: folder.id,
                                currentType: null,
                            });
                        }}
                        style={{ backgroundColor: 'green', color: 'white', marginLeft: '10px' }}
                    >
                        Добавить
                    </button>
                    <button
                        onClick={() => this.handleDeleteFolder(folder.id)}
                        style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
                    >
                        Удалить
                    </button>
                </h3>
                {this.state.showAddOptions === folder.id && this.renderAddOptions(folder.id)}
                {this.state.showAddOptions === folder.id && this.renderAddForm(folder.id)}
                {folder.children.length > 0 && this.renderFolders(folder.children)}
            </div>
        ));
    };

    render() {
        const { folders } = this.state;

        return (
            <div style={{ padding: '20px' }}>
                <h1>Управление папками</h1>
                {folders.length ? this.renderFolders(folders) : <p>Нет доступных папок.</p>}
            </div>
        );
    }
}

export default FillSection;