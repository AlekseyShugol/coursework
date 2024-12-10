const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS
app.use(cors());

// Настройка Multer для хранения загруженных файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/resources/files'); // Папка для загруженных файлов
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Используем оригинальное имя файла
    },
});

const upload = multer({ storage });

// Создаем папку для загрузок, если ее нет
const uploadsDir = path.join(__dirname, 'public/resources/files');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Эндпоинт для загрузки файлов
app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Файлы не загружены.' });
    }

    req.files.forEach((file) => {
        const ext = path.extname(file.originalname);
        const cleanName = req.body.fileName || file.originalname; // Используем имя файла, введенное пользователем или оригинальное
        const newFileName = `${cleanName}${ext}`;
        const oldPath = path.join(__dirname, 'public/resources/files', file.filename);
        const newPath = path.join(__dirname, 'public/resources/files', newFileName);

        // Переименование файла
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Ошибка при переименовании файла:', err);
            }
        });
    });

    res.json({ message: 'Files uploaded successfully!' });
});

// Статическая папка для доступа к загруженным файлам
app.use('/files', express.static(path.join(__dirname, 'public/resources/files')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});