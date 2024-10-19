import React, { Component } from 'react';
import { fetchData, deleteNode } from '../api/Api'; // Импортируем функции из файла api
import Folder from './Folder'; // Импортируем компонент Folder
import File from './File'; // Импортируем компонент File
import '../../css/App.css'; // Импортируем стили

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

      const firstRootFolder = result.find(item => item.parentId === null);
      if (firstRootFolder) {
        this.setState({
          currentFolder: firstRootFolder.id,
          path: [firstRootFolder.id],
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
        data: prevState.data.filter(item => item.id !== id),
        currentFolder: prevState.currentFolder === id ? null : prevState.currentFolder,
        path: prevState.path.filter(p => p !== id),
      }));
    } catch (error) {
      this.setState({ error: "Ошибка при удалении данных: " + error.message });
    }
  };

  handleFolderClick = (id) => {
    this.setState(prevState => ({
      currentFolder: id,
      path: [...prevState.path, id],
    }));
  };

  handleBackClick = () => {
    this.setState(prevState => {
      const newPath = [...prevState.path];
      newPath.pop();
      const parentId = newPath[newPath.length - 1] || null;
      return {
        path: newPath,
        currentFolder: parentId,
      };
    });
  };

  renderTree = (nodes) => {
    return nodes.map(node => {
      const children = this.state.data.filter(item => item.parentId === node.id);
      return (
        <React.Fragment key={node.id}>
          {node.type === 'FOLDER' ? (
            <Folder
              node={node}
              isActive={this.state.currentFolder === node.id}
              onClick={() => this.handleFolderClick(node.id)}
              onDelete={() => this.handleDelete(node.id)}
            >
              {children.length > 0 && this.renderTree(children)} {/* Рендерим дочерние узлы внутри Folder */}
            </Folder>
          ) : (
            <File
              node={node}
              onDelete={() => this.handleDelete(node.id)}
            />
          )}
        </React.Fragment>
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
            <button
              key={node.id}
              className={`root-button ${currentFolder === node.id ? 'active' : ''}`}
              onClick={() => this.handleFolderClick(node.id)}
            >
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
            {this.renderTree(currentChildren)} {/* Здесь рендерятся дочерние узлы */}
          </ul>
        )}
      </div>
    );
  }
}

export default App;