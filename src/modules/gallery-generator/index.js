const fs = require('fs');
const { basename, join, relative } = require('path');
const pug = require('pug');
const slug = require('slug');

slug.charmap['_'] = '-';

const { base, gallerySrc, galleryDest, templatesSrc } = require('../../config/paths');
const pageLocals = require('../../config/page-locals');

const template = pug.compileFile(join(templatesSrc, 'gallery-page.pug'));

const imagesPath = gallerySrc;
const galleryRelativeSrc = relative(base, gallerySrc);

const parseFolderName = (folderName) => unescape(folderName.replace(/_/g, ' ').replace(/-([a-z0-9]{2})/ig, '%$1'));

const slugFolder = folder => slug(folder, { lower: true });

const getSamples = folder => {
  if (folder.files.length) {
    return folder.files.slice(0, 3);
  } else if (folder.dirs[0]) {
    return getSamples(folder.dirs[0]);
  }
};

const makeGallery = (path) => {
  const currentFolder = basename(path);
  const currentRelative = parseFolderName(relative(imagesPath, path));
  const currentFolderName = parseFolderName(currentFolder);
  const relativeDestPath = currentRelative
    .split('/')
    .map(slugFolder)
    .join('/');

  if (!fs.existsSync(join(galleryDest, relativeDestPath))) {
    fs.mkdirSync(join(galleryDest, relativeDestPath));
  }

  const name = currentFolderName;
  const dirs = [];
  const files = [];
  const breadcrumbs = [ { name: 'Imagens', href: '/imagens/' } ];
  let breadcrumbAux = '/imagens';

  currentRelative.split('/').forEach(folder => {
    if (!folder) {
      return;
    }

    breadcrumbAux = `${breadcrumbAux}/${slugFolder(folder)}`;
    const breadcrumb = {
      name: folder,
      href: `${breadcrumbAux}/`,
    };
    breadcrumbs.push(breadcrumb);
  });

  fs.readdirSync(path).forEach(file => {
    const stat = fs.statSync(join(path, file));
    if (stat.isDirectory()) {
      const dir = makeGallery(join(path, file));
      dir.samples = getSamples(dir);
      dirs.push(dir);
    } else if (!file.match(/^(\.|tn_)/)) {
      const thumbnail = `tn_${file.replace(/\.[^.]+$/, '.jpg')}`;
      files.push({
        image: `/${galleryRelativeSrc}/${join(relative(imagesPath, path), file)}`,
        thumbnail: `/${galleryRelativeSrc}/${join(relative(imagesPath, path), thumbnail)}`,
      });
    }
  });

  const href = `/imagens/${relativeDestPath}`.replace(/\/$/, '');

  const templateVars = {
    self: Object.assign({ currentPage: 'imagens', url: href + '/' }, pageLocals),
    breadcrumbs,
    name,
    dirs,
    files,
    href,
  };

  fs.writeFileSync(join(galleryDest, relativeDestPath, 'index.html'), template(templateVars));

  return templateVars;
};

makeGallery(imagesPath);
