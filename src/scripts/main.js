const ComponentLoader = require('./lib/component-loader');

const components = require('./components');

const loader = new ComponentLoader({ components });
loader.loadComponents(document);
