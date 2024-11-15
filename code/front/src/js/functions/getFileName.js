export function getFileName(path) {

    // Последнее вхождение '\' и '/'
    const backSlashIndex = path.lastIndexOf('\\');
    const slashIndex = path.lastIndexOf('/');

    // Находим максимальный индекс из двух
    const lastIndex = Math.max(backSlashIndex, slashIndex);
    if(lastIndex === -1) {
        return path;
    }
    return path.substring(lastIndex + 1);
}