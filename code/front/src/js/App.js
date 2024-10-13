import React, { Component } from 'react';
import { fetchData, deleteNode } from './api'; // Импортируем функции из файла api
import '../css/App.css'; // Импортируем стили

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        loading: true,
        error: null,
        currentFolder: null,
        path: [],
      };
    }
  
    async componentDidMount() {
      try {
        const result = await fetchData(); // Получаем данные при монтировании компонента
        this.setState({ data: result, loading: false });
  
        // Устанавливаем первую корневую папку как текущую, если она есть
        const firstRootFolder = result.find(item => item.parentId === null);
        if (firstRootFolder) {
          this.setState({
            currentFolder: firstRootFolder.id,
            path: [firstRootFolder.id], // Добавляем первую папку в путь
          });
        }
      } catch (error) {
        this.setState({ error: "Ошибка при получении данных: " + error.message, loading: false });
      }
    }
  
    handleDelete = async (id) => {
      try {
        await deleteNode(id); // Удаляем узел
        this.setState(prevState => ({
          data: prevState.data.filter(item => item.id !== id), // Удаляем узел из состояния
          currentFolder: prevState.currentFolder === id ? null : prevState.currentFolder, // Если удаляем текущую папку, сбрасываем её
          path: prevState.path.filter(p => p !== id), // Удаляем папку из пути, если она там есть
        }));
      } catch (error) {
        this.setState({ error: "Ошибка при удалении данных: " + error.message });
      }
    };
  
    handleFolderClick = (id) => {
      this.setState(prevState => ({
        currentFolder: id,
        path: [...prevState.path, id], // Добавляем текущую папку к пути
      }));
    };
  
    handleBackClick = () => {
      this.setState(prevState => {
        const newPath = [...prevState.path];
        newPath.pop(); // Удаляем последнюю папку из пути
        const parentId = newPath[newPath.length - 1] || null; // Получаем родительскую папку
        return {
          path: newPath,
          currentFolder: parentId, // Устанавливаем родительскую папку как текущую
        };
      });
    };
  
    renderTree = (nodes) => {
      return nodes.map(node => {
        const children = this.state.data.filter(item => item.parentId === node.id);
        return (
          <li key={node.id}>
            {node.type === 'FOLDER' ? (
              <div>
                <button className={`root-button ${this.state.currentFolder === node.id ? 'active' : ''}`} onClick={() => this.handleFolderClick(node.id)}>
                  {node.name}
                </button>
                <button onClick={() => this.handleDelete(node.id)} style={{ marginLeft: '10px', color: 'red' }}>
                  Удалить
                </button>
              </div>
            ) : (
              <div>
                <a href={node.url} target="_blank" rel="noopener noreferrer">
                  {node.name}
                </a>
                <button onClick={() => this.handleDelete(node.id)} style={{ marginLeft: '10px', color: 'red' }}>
                  Удалить
                </button>
              </div>
            )}
          </li>
        );
      });
    };
  
    render() {
      const { data, loading, error, currentFolder, path } = this.state;
  
      if (loading) return <div>Загрузка...</div>;
      if (error) return <div>{error}</div>;
  
      const topLevelNodes = data.filter(item => item.parentId === null);
      const currentChildren = data.filter(item => item.parentId === currentFolder);
  
      return (
        <div className="container">
          <h1>Корневые папки:</h1>
          <div className="root-buttons">
            {topLevelNodes.map(node => (
              <button key={node.id} className={`root-button ${currentFolder === node.id ? 'active' : ''}`} onClick={() => this.handleFolderClick(node.id)}>
                {node.name}
              </button>
            ))}
          </div>
          
          {path.length > 0 && (
            <button onClick={this.handleBackClick} className="back-button">
              Вернуться назад
            </button>
          )}
  
          {currentFolder && (
            <ul>
              {this.renderTree(currentChildren)}
            </ul>
          )}
        </div>
      );
    }
  }
  
  export default App;