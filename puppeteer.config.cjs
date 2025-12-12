const { join } = require('path')

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Define o diretório de cache para dentro do projeto
  cacheDirectory: join(__dirname, '.puppeteer'),
}
