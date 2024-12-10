import React, { Component } from 'react';
import '../../../../css/File.css'; // Импортируем CSS файл для стилизации
import { isFile, isYouTubeLink } from '../../../../js/functions/checker';
import VideoContainer from "./VideoContainer";

class File extends Component {
  constructor(props) {
    super(props);
    console.log(`FILE CLASS:\n\
            ID: ${this.props.node?.id}\n\
            NAME: ${this.props.node?.name}\n\
            TYPE: ${this.props.node?.type}\n\
            PID: ${this.props.node?.parent_id}\n\
            URL: ${this.props.node?.url}\n\
            DESCRIPTION: ${this.props.node?.description}\n\
            POSITION: ${this.props.node?.element_position}`
    );
    // Привязываем метод к контексту класса
    this.downloadFile = this.downloadFile.bind(this);
  }

  downloadFile() {
    const { node } = this.props;
    if (!node || !node.url) return;

    // Определяем, является ли файл изображением
    const isImage = this.isImageFile(node.url);
    if (isImage) {
      console.log('Изображения нельзя скачать.');
      return; // Прекращаем выполнение, если файл - изображение
    }

    fetch(node.url)
        .then(response => {
          if (!response.ok) {
            console.error('Ошибка при загрузке файла:', response.statusText);
            throw new Error('Network response was not ok');
          }
          return response.blob(); // Получаем Blob
        })
        .then(blob => {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const fileName = `${node.name || 'download'}_${timestamp}${this.getFileExtension(node.url)}`;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Ошибка скачивания:', error));
  }

  // Функция для получения расширения файла из URL
  getFileExtension(url) {
    const extension = url.split('.').pop().split('?')[0]; // Убираем параметры, если есть
    return extension ? `.${extension}` : ''; // Добавляем точку перед расширением
  }

  // Функция для проверки, является ли файл изображением
  isImageFile(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'];
    const extension = this.getFileExtension(url).toLowerCase().slice(1); // Убираем точку
    return imageExtensions.includes(extension);
  }

  // Функция для проверки, является ли URL ссылкой
  isLink(url) {
    return /^(https?:\/\/|www\.)/.test(url);
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
          ) : this.isLink(node.url) ? (
              <div className="link-container">
                <p className={`description ${node.description?.length > 50 ? 'left' : 'center'}`}>
                  {node.description}
                </p>
                <a href={node.url.startsWith('http') ? node.url : `http://${node.url}`} target="_blank" rel="noopener noreferrer" className="link">
                  {node.name} (Ссылка)
                </a>
              </div>
          ) : (
              <div className="image-container">
                <p className={`description ${node.description?.length > 50 ? 'left' : 'center'}`}>
                  {node.description}
                </p>
                <img src={node.url} alt={node.name} style={{ pointerEvents: 'none' }} /> {/* Картинка некликабельная */}
              </div>
          )}
        </li>
    );
  }
}

export default File;