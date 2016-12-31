(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Body {
  constructor({ element }) {
    this.el = element;
    setTimeout(() => element.classList.add('-has-transitions-enabled'), 100);
  }
}

module.exports = Body;

},{}],2:[function(require,module,exports){
class Gallery {
  constructor({ element }) {
    this.el = element;

    this.state = {};
    this.previousState = {};
    this.images = [];

    this.$html = document.querySelector('html');
    this.$fullscreen = element.querySelector('[data-ref="Gallery-fullscreen"]');
    this.$fullscreenImage = element.querySelector('[data-ref="Gallery-fullscreen-image"]');
    this.$fullscreenPrevious = element.querySelector('[data-ref="Gallery-fullscreen-previous"]');
    this.$fullscreenNext = element.querySelector('[data-ref="Gallery-fullscreen-next"]');

    element.addEventListener('keydown', (event) => this.handleKeyDown(event));
    this.$fullscreen.addEventListener('click', (event) => this.handleFullscreenClick(event));
    this.$fullscreenPrevious.addEventListener('click', (event) => this.handleFullscreenNavigationClick(event, -1));
    this.$fullscreenNext.addEventListener('click', (event) => this.handleFullscreenNavigationClick(event, 1));

    Array.from(element.querySelectorAll('[data-ref="Gallery-image-open"]')).forEach((element, i) => {
      this.images.push(element.getAttribute('href'));
      element.addEventListener('click', (event) => this.handleImageClick(event, i));
    });
  }

  handleImageClick(event, i) {
    event.preventDefault();

    this.fullscreenOpen(i);
  }

  handleFullscreenClick(event) {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      this.fullscreenClose();
    }
  }

  handleFullscreenNavigationClick(event, direction) {
    event.preventDefault();

    this.fullscreenNavigateBy(direction);
  }

  handleKeyDown(event) {
    if (!this.state.fullscreenOpen) {
      return;
    }

    if (event.keyCode == 27) {
      event.preventDefault();
      this.fullscreenClose();
    }

    if (event.keyCode == 37) {
      event.preventDefault();
      this.fullscreenNavigateBy(-1);
    }

    if (event.keyCode == 39) {
      event.preventDefault();
      this.fullscreenNavigateBy(1);
    }
  }

  fullscreenOpen(index) {
    this.state.fullscreenOpen = true;
    this.state.fullscreenImageIndex = index;
    this.render();
  }

  fullscreenClose() {
    this.state.fullscreenOpen = false;
    this.render();
  }

  fullscreenNavigateBy(direction) {
    let newIndex = this.state.fullscreenImageIndex + direction;
    const maxIndex = this.images.length - 1;
    if (newIndex < 0) {
      newIndex = maxIndex;
    }
    if (newIndex > maxIndex) {
      newIndex = 0;
    }
    this.state.fullscreenImageIndex = newIndex;
    this.render();
  }

  render() {
    if (this.previousState.fullscreenOpen !== this.state.fullscreenOpen) {
      if (this.state.fullscreenOpen) {
        this.$html.classList.add('-cannot-scroll');
        this.$fullscreen.removeAttribute('hidden');
      } else {
        this.$html.classList.remove('-cannot-scroll');
        this.$fullscreen.setAttribute('hidden', '');
      }
      this.previousState.fullscreenOpen = this.state.fullscreenOpen;
    }

    if (this.previousState.fullscreenImageIndex !== this.state.fullscreenImageIndex) {
      this.$fullscreenImage.setAttribute('src', this.images[this.state.fullscreenImageIndex]);
      this.previousState.fullscreenImageIndex = this.state.fullscreenImageIndex;
    }
  }
}

module.exports = Gallery;

},{}],3:[function(require,module,exports){
class KiCalculator {
  constructor({ element }) {
    this.el = element;

    this.state = {};
    this.previousState = {};

    this.$form = element.querySelector('[data-ref="KiCalculator-form"]');
    this.$reset = element.querySelector('[data-ref="KiCalculator-reset"]');
    this.$result = element.querySelector('[data-ref="KiCalculator-result"]');
    this.$resultKi = element.querySelector('[data-ref="KiCalculator-result-ki"]');

    this.$form.addEventListener('submit', (event) => this.handleFormSubmit(event));
    this.$reset.addEventListener('click', (event) => this.handleResetClick(event));
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const age = this.$form.querySelector('[name="age"]').value;
    const weight = this.$form.querySelector('[name="weight"]').value;
    const height = this.$form.querySelector('[name="height"]').value;
    const strenght = this.$form.querySelector('[name="strenght"]').value;
    const fitness = this.$form.querySelector('[name="fitness"]').value;

    this.state.ki = this.calculate({ age, weight, height, strenght, fitness });
    this.render();
  }

  handleResetClick(event) {
    event.preventDefault();

    this.state.ki = undefined;
    this.render();
  }

  calculate({ age, weight, height, strenght, fitness }) {
    let f1 = 1, f2 = 1, f3 = 1, f4 = 1, f5 = 1;

    age = parseInt(age);
    weight = parseInt(weight);
    height = parseInt(height);
    strenght = parseInt(strenght);
    fitness = parseInt(fitness);

    if (age < 12) { f1 = 1.5; }
    else if (age < 16) { f1 = 2; }
    else if (age < 25) { f1 = 3; }
    else { f1 = 1.1; }

    if (weight < 40) { f2 = 0.7; }
    else if (weight < 60) { f2 = 1.1; }
    else if (weight < 80) { f2 = 2; }
    else if (weight < 100) { f2 = 2.5; }
    else if (weight < 140) { f2 = 1.2; }
    else { f2 = 0.3; }

    if (height < 100) { f3 = 0.8; }
    else if (height < 140) { f3 = 1; }
    else if (height < 160) { f3 = 1.5; }
    else if (height < 170) { f3 = 2; }
    else if (height < 190) { f3 = 3; }
    else { f3 = 1.2; }

    if (!strenght) { strenght = 5; }

    if (strenght < 10) { f4 = 0.5; }
    else if (strenght < 20) { f4 = 1; }
    else if (strenght < 40) { f4 = 1.3; }
    else if (strenght < 60) { f4 = 1.7; }
    else if (strenght < 120) { f4 = 2.5; }
    else if (strenght < 240) { f4 = 3.8; }
    else if (strenght < 480) { f4 = 6.2; }
    else { f4 = 8; }

    if (fitness < 1) { f5 = 1; }
    else if (fitness < 2) { f5 = 2; }
    else if (fitness < 4) { f5 = 3; }
    else if (fitness < 6) { f5 = 4; }
    else if (fitness < 8) { f5 = 8; }
    else { f5 = 10; }

    return f1 * f2 * f3 * f4 * f5;
  }

  render() {
    if (this.previousState.ki !== this.state.ki) {
      if (this.state.ki && !isNaN(this.state.ki)) {
        this.$resultKi.innerText = this.state.ki.toFixed(2).replace('.', ',');
        this.$form.setAttribute('hidden', '');
        this.$result.removeAttribute('hidden');
        this.$form.reset();
      } else {
        this.$form.removeAttribute('hidden');
        this.$result.setAttribute('hidden', '');
      }
      this.previousState.ki = this.state.ki;
    }
  }
}

module.exports = KiCalculator;

},{}],4:[function(require,module,exports){
class MainNav {
  constructor({ element }) {
    this.el = element;
    this.isScrollOnTop = true;
    this.isMenuOpen = false;

    this.$html = document.querySelector('html');
    this.$body = document.querySelector('body');
    this.$toggle = element.querySelector('[data-ref="MainNav-toggle"]');
    this.$open = element.querySelector('[data-ref="MainNav-open"]');
    this.$close = element.querySelector('[data-ref="MainNav-close"]');

    this.$toggle.addEventListener('click', (event) => this.handleToggleClick(event));
    window.addEventListener('scroll', () => this.handleScroll());
    setTimeout(() => this.handleScroll(), 100);
  }

  handleToggleClick(event) {
    event.preventDefault();

    if (!this.isMenuOpen) {
      this.$html.classList.add('-has-nav-open');
      this.$open.setAttribute('hidden', '');
      this.$close.removeAttribute('hidden');
      this.isMenuOpen = true;
    } else {
      this.$html.classList.remove('-has-nav-open');
      this.$open.removeAttribute('hidden');
      this.$close.setAttribute('hidden', '');
      this.isMenuOpen = false;
    }
  }

  handleScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (!this.isScrollOnTop && scrollTop <= 0) {
      this.$body.classList.add('-has-scroll-on-top');
      this.isScrollOnTop = true;
    } else if (this.isScrollOnTop && scrollTop > 0) {
      this.$body.classList.remove('-has-scroll-on-top');
      this.isScrollOnTop = false;
    }
  }
}

module.exports = MainNav;

},{}],5:[function(require,module,exports){
const slugFolder = (str) => String(str)
  .toLowerCase()
  .replace(/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g, 'a')
  .replace(/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g, 'e')
  .replace(/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g, 'i')
  .replace(/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g, 'o')
  .replace(/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g, 'u')
  .replace(/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g, 'c')
  .replace(/[^a-z0-9-/]+/ig, '-')
  .replace(/-+/ig, '-');

const parseFolderName = (folderName) => unescape(folderName.replace(/_/g, ' ').replace(/-([a-z0-9]{2})/ig, '%$1'));

const map = [
  { source: '/ajuda.html', location: '/' },
  { source: '/banners.html', location: '/' },
  { source: '/fale_conosco.html', location: '/' },
  { source: '/interativo/calcule_o_seu_ki.html', location: '/calcule-seu-ki.html' },
  { source: '/jogos/', location: '/jogos/' },
  { source: '/multimidia/galeria.html', special: 'galeria' },
  { source: '/multimidia/gifs_animados.html', location: '/imagens/gifs-animados/' },
  { source: '/perfil/', location: '/' },
  { source: '/personagens/goku_vs_vegeta.html', location: '/personagens/goku-vs-vegeta.html' },
  { source: '/personagens/lista_completa.html', special: 'personagens' },
  { source: '/personagens/piccolo.html', location: '/personagens/piccolo.html' },
  { source: '/personagens/trunks.html', location: '/personagens/trunks.html' },
  { source: '/personagens/vegeta.html', location: '/personagens/vegeta.html' },
  { source: '/resumos/dragon_ball.html', location: '/conteudo/dragon_ball.html' },
  { source: '/resumos/dragon_ball_gt.html', location: '/conteudo/dragon_ball_gt.html' },
  { source: '/resumos/dragon_ball_z.html', location: '/conteudo/dragon_ball_z.html' },
  { source: '/resumos/filme_a_lenda_de_shenlong.html', location: '/conteudo/filme_a_lenda_de_shenlong.html' },
  { source: '/resumos/historia_do_anime.html', location: '/conteudo/historia_do_anime.html' },
  { source: '/u/', location: '/' },
  { source: '/variados/arvore_genealogica.html', location: '/conteudo/arvore-genealogica.html' },
  { source: '/variados/biografia_akira_toriyama.html', location: '/conteudo/biografia-akira-toriyama.html' },
  { source: '/variados/censuras.html', location: '/conteudo/censuras.html' },
  { source: '/variados/cronologia.html', location: '/conteudo/cronologia.html' },
  { source: '/variados/curiosidades.html', location: '/conteudo/curiosidades.html' },
  { source: '/variados/dicionario_z.html', location: '/conteudo/dicionario-z.html' },
  { source: '/variados/dragoes.html', location: '/conteudo/dragoes.html' },
  { source: '/variados/entrevista_akira_toriyama.html', location: '/conteudo/entrevista-akira-toriyama.html' },
  { source: '/variados/esferas_do_dragao.html', location: '/conteudo/esferas-do-dragao.html' },
  { source: '/variados/falhas.html', location: '/conteudo/falhas.html' },
  { source: '/variados/filmes.html', location: '/conteudo/filmes.html' },
  { source: '/variados/kaios.html', location: '/conteudo/kaios.html' },
  { source: '/variados/lugares_e_objetos.html', location: '/conteudo/lugares-e-objetos.html' },
  { source: '/variados/niveis_sayajin.html', location: '/conteudo/niveis-saiyajin.html' },
  { source: '/variados/o_que_e_ki.html', location: '/conteudo/o-que-e-ki.html' },
  { source: '/variados/pedidos.html', location: '/conteudo/pedidos.html' },
  { source: '/variados/planetas.html', location: '/conteudo/planetas.html' },
  { source: '/variados/produtores.html', location: '/conteudo/produtores.html' },
  { source: '/variados/racas.html', location: '/conteudo/racas.html' },
  { source: '/variados/sayajins.html', location: '/conteudo/saiyajins.html' },
  { source: '/variados/tekaichi_budokais.html', location: '/conteudo/tekaichi-budokais.html' },
];

const specials = {
  'galeria': (pathname, query) => {
    let folder = '';
    if (query) {
      folder = slugFolder(parseFolderName(query.split(/&/)[0])) +'/';
    }
    return '/imagens/'+ folder;
  },

  'personagens': (pathname, query) => {
    let anchor = '';
    if (query && query.match(/l=[a-z]/)) {
      anchor = '#'+ query.match(/l=([a-z])/)[1].toUpperCase();
    }
    return '/personagens/'+ anchor;
  },
};

class PageFinder {
  constructor({ element }) {
    this.el = element;

    this.$working = element.querySelector('[data-ref="PageFinder-working"]');
    this.$success = element.querySelector('[data-ref="PageFinder-success"]');
    this.$failed = element.querySelector('[data-ref="PageFinder-failed"]');

    this.findMe();
  }

  findMe() {
    const pathname = location.pathname;
    const query = location.search.substr(1);
    const found = map.find(redirect => pathname.includes(redirect.source));

    if (!found) {
      this.$working.setAttribute('hidden', '');
      this.$failed.removeAttribute('hidden');
      return;
    }

    this.$working.setAttribute('hidden', '');
    this.$success.removeAttribute('hidden');

    let correctLocation = found.location;
    if (found.special) {
      correctLocation = specials[found.special](pathname, query);
    } else if (query) {
      correctLocation = correctLocation + '?' + query;
    }

    location.replace(correctLocation);
  }
}

module.exports = PageFinder;

},{}],6:[function(require,module,exports){
const Body = require('./Body');
const Gallery = require('./Gallery');
const KiCalculator = require('./KiCalculator');
const MainNav = require('./MainNav');
const PageFinder = require('./PageFinder');

module.exports = {
  Body,
  Gallery,
  KiCalculator,
  MainNav,
  PageFinder,
};

},{"./Body":1,"./Gallery":2,"./KiCalculator":3,"./MainNav":4,"./PageFinder":5}],7:[function(require,module,exports){
const ComponentLoader = require('./lib/component-loader');

const components = require('./components');

const loader = new ComponentLoader({ components });
loader.loadComponents(document);

},{"./components":6,"./lib/component-loader":8}],8:[function(require,module,exports){
class ComponentLoader {
  constructor({ components }) {
    this.components = components;
  }

  loadComponent(element, componentName) {
    if (!element || !element.getAttribute) {
      throw new Error('Invalid element');
    }

    if (!componentName || !this.components[componentName]) {
      throw new Error(`Missing component ${componentName}`);
    }

    if (!element._component) {
      const component = new this.components[componentName]({ element });
      element._component = component;
    }

    return element._component;
  }

  loadComponentAsync(element, componentName) {
    setTimeout(() => this.loadComponent(element, componentName));
  }

  loadComponents(element) {
    if (!element || !element.querySelectorAll) {
      throw new Error('Invalid element');
    }

    Array.prototype.forEach.call(element.querySelectorAll('[data-component]'), (element) => {
      const componentName = element.getAttribute('data-component');
      this.loadComponentAsync(element, componentName);
    });
  }
}

module.exports = ComponentLoader;

},{}]},{},[7])