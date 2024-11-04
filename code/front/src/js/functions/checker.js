export function isFile(url) {
    return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|gif)$/.test(url);
}

export function isYouTubeLink(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url);
}