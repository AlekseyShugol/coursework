import React, { Component } from 'react';
import { fetchData, deleteNode } from '../../js/api/Api';
import Folder from './Folder';
import File from './File';
import SideTree from './SideTree';
import '../../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      error: null,
      currentFolder: null,
      path: [],
      isSidebarOpen: false,
    };
  }

  async componentDidMount() {
    try {
      const result = await fetchData();
      if (result && Array.isArray(result)) {
        this.setState({ data: result, loading: false });

        const rootFolders = result.filter(item => item.parentId === null);
        if (rootFolders.length > 0) {
          this.setState({
            currentFolder: rootFolders[0].id,
            path: [rootFolders[0].id],
          });
        }
      }

      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('click', this.handleOutsideClick);
    } catch (error) {
      this.setState({ error: `Ошибка при получении данных: ${error.message}`, loading: false });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.setState({ isSidebarOpen: false });
    }
  };

  handleOutsideClick = (event) => {
    const sidebar = document.querySelector('.sidebar');
    if (this.state.isSidebarOpen && sidebar && !sidebar.contains(event.target)) {
      this.setState({ isSidebarOpen: false });
    }
  };

  handleDelete = async (id) => {
    try {
      await deleteNode(id);
      this.setState(prevState => ({
        data: prevState.data.filter(item => item.id !== id),
        currentFolder: prevState.currentFolder === id ? null : prevState.currentFolder,
        path: prevState.path.filter(p => p !== id),
      }));
    } catch (error) {
      this.setState({ error: `Ошибка при удалении данных: ${error.message}` });
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

  toggleSidebar = () => {
    this.setState(prevState => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }));
  };

  renderTree = (nodes) => {
    const sortedNodes = nodes.sort((a, b) => a.element_position - b.element_position);

    return sortedNodes.map(node => {
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
              {children.length > 0 && this.renderTree(children)}
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
    const { data, loading, error, currentFolder, path, isSidebarOpen } = this.state;

    if (loading) return <div>Загрузка...</div>;
    if (error) {
      return <div>{error}</div>;
    }

    const rootFolders = data.filter(item => item.parentId === null)
      .sort((a, b) => a.element_position - b.element_position);
    const currentChildren = data.filter(item => item.parentId === currentFolder);
    const isAtRoot = rootFolders.some(folder => folder.id === currentFolder);

    return (
      <div className="container">
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <SideTree
            data={data}
            currentFolder={currentFolder}
            onFolderClick={this.handleFolderClick}
            onDelete={this.handleDelete}
          />
        </div>
        <div className="main-content">
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

          {/* Условие для отображения кнопки "Назад" */}
          {!isAtRoot && (
            <button
              className="back-button"
              onClick={this.handleBackClick}
            >
              Назад
            </button>
          )}

          {currentFolder && currentChildren.length > 0 ? (
            <ul>
              {this.renderTree(currentChildren)}
            </ul>
          ) : currentFolder ? (
            <div className="emptyFolder">Тут пока что пусто</div> // Message for empty folder
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;