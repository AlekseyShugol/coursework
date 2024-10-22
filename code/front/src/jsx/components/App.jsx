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

      const rootFolders = result.filter(item => item.parentId === null);
      if (rootFolders.length > 0) {
        this.setState({
          currentFolder: rootFolders[0].id, // Устанавливаем первую корневую папку как текущую
          path: [rootFolders[0].id],
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
      newPath.pop(); // Убираем текущую папку из пути
      const parentId = newPath[newPath.length - 1] || null; // Получаем родительский ID
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

    const rootFolders = data.filter(item => item.parentId === null); // Корневые папки
    const currentChildren = data.filter(item => item.parentId === currentFolder);

    // Проверяем, находимся ли мы в корне (если currentFolder является одной из корневых папок)
    const isAtRoot = rootFolders.some(folder => folder.id === currentFolder);

    return (
      <div className="container">
        <h1>Корневые папки:</h1>
        <div className="root-buttons">
          {rootFolders.map(node => (
            <button
              key={node.id}
              className={`root-button ${currentFolder === node.id ? 'active' : ''}`}
              onClick={() => this.handleFolderClick(node.id)}
            >
              {node.name}
            </button>
          ))}
        </div>

        <button
          className="back-button"
          onClick={this.handleBackClick}
          disabled={isAtRoot} // Делаем кнопку неактивной, если находимся в корне
        >
          Назад
        </button>

        {currentFolder && currentChildren.length > 0 && (
          <ul>
            {this.renderTree(currentChildren)} {/* Здесь рендерятся дочерние узлы */}
          </ul>
        )}
      </div>
    );
  }
}

export default App;