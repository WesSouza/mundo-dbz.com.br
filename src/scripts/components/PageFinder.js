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
  { source: '/variados/niveis_sayajin.html', location: '/conteudo/niveis-sayajin.html' },
  { source: '/variados/o_que_e_ki.html', location: '/conteudo/o-que-e-ki.html' },
  { source: '/variados/pedidos.html', location: '/conteudo/pedidos.html' },
  { source: '/variados/planetas.html', location: '/conteudo/planetas.html' },
  { source: '/variados/produtores.html', location: '/conteudo/produtores.html' },
  { source: '/variados/racas.html', location: '/conteudo/racas.html' },
  { source: '/variados/sayajins.html', location: '/conteudo/sayajins.html' },
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
