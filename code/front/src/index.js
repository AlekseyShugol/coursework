import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './jsx/components/App'; // Импортируем класс App



// Получаем корневой элемент из HTML
const rootElement = document.getElementById('root');

// Создаем корень React
const root = ReactDOM.createRoot(rootElement);

// Рендерим компонент App
root.render(<React.StrictMode>
  <App />
</React.StrictMode>);