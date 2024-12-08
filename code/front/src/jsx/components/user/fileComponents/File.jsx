import React, { Component } from 'react';
import '../../../../css/File.css'; // Импортируем CSS файл для стилизации
import { isFile, isYouTubeLink } from '../../../../js/functions/checker';
import VideoContainer from "./VideoContainer";

class File extends Component {
  constructor(props) {
    super(props);
    console.log(`FILE CLASS:\n\
            ID: ${this.props.node?.id}
            NAME: ${this.props.node?.name}\n
            TYPE: ${this.props.node?.type}\n
            PID: ${this.props.node?.parent_id}\n
            URL: ${this.props.node?.url}\n,
            DESCRIPTION: ${this.props.node?.description}\n
            POSITION: ${this.props.node?.element_position}
            `
    );
    // Привязываем метод к контексту класса
    this.downloadFile = this.downloadFile.bind(this);
  }

    downloadFile(){
      const { node } = this.props;
      if (!node || !node.url) return;

      fetch(node.url)
          .then(response => {
            if (!response.ok) {
              console.error('Ошибка при загрузке файла:', response.statusText);
              throw new Error('Network response was not ok');
            }
            return response.arrayBuffer();
          })
          .then(buffer => {
            // Установите правильный MIME-тип для Excel
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", node.name || 'download.xlsx');  // Убедитесь, что добавлено расширение файла
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          })
          .catch(error => console.error('Ошибка скачивания:', error));
    }

  render() {
    const { node, onDelete } = this.props;

    // Проверяем, существует ли node и его свойства
    if (!node || !node.url) {
      return null; // Если node или его url не существует, ничего не отображаем
    }

    return (
        <li className="file-item">
          {isYouTubeLink(node.url) ? (
              node.url.includes('embed/') ? (
                  <VideoContainer
                      description={node.description}
                      url={node.url}
                      name={node.name}
                  />
              ) : (
                  <a href={node.url} target="_blank" rel="noopener noreferrer">
                    {node.name} (YouTube)
                  </a>
              )
          ) : isFile(node.url) ? (
              <div className="file-container">
                <p className="file-name">
                  <b>{node.name}</b>
                </p>
                <p className={`description ${node.description?.length > 50 ? 'left' : 'center'}`}>
                  {node.description}
                </p>
                <button onClick={this.downloadFile} className="download-button">Скачать</button>
              </div>
          ) : (

              <div className="image-container">
                <p className={`description ${node.description?.length > 50 ? 'left' : 'center'}`}>
                  {node.description}
                </p>
                <img src={node.url} alt={node.name} style={{pointerEvents: 'none'}}/> {/* Картинка некликабельная */}
              </div>
          )}
          {/* <button onClick={onDelete} className="delete-button">
          Удалить
        </button> */}
        </li>
    );
  }
}

export default File;