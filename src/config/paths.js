const { join, resolve } = require('path');

const base = resolve(__dirname, '../..');

const paths = {
  base,
  gallerySrc: join(base, 'assets/images/galeria'),
  galleryDest: join(base, 'imagens'),
  pagesSrc: join(base, 'src/pages'),
  pagesDest: base,
  scriptsSrc: join(base, 'src/scripts'),
  scriptsDest: join(base, 'assets/scripts'),
  stylesSrc: join(base, 'src/styles'),
  stylesDest: join(base, 'assets/styles'),
  templatesSrc: join(base, 'src/templates'),
};

module.exports = paths;
