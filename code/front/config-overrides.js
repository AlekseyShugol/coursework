const { override } = require('customize-cra');

module.exports = override((config) => {
    // Убедитесь, что allowedHosts содержит хотя бы одну непустую строку
    config.devServer.allowedHosts = ['.localhost', '192.168.0.107'];
    return config;
});