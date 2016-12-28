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
