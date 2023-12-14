/**
 *
 * Элементы связаны по цепочке от элемента с default: true;
 * Элементом с multiple: true может быть только последний элемент
 * в этой цепочке, то есть не имеющий поля disable.
 *
 * options = {
 *  element: HTMLElement,       --- получаем из window.Controller (this.element)
 *  rows: boolean,              --- указывает есть ли возможность динамически добавлять новые группы полей
 *  create: {                   --- объект хранит информацию о полях в группе
 *   key: {
 *    default: true,            --- указывает является ли элемент первым(доступным всегда). может быть только один элемент с default: true.
 *    multiple: true,           --- указывает есть ли у элемента возможность множественного выбора. С возможностью выбора может быть только "последний" элемент в группе.
 *    dataID: string            --- идентификатор элемента в группе
 *    disable: string           --- указывает зависимое поле.
 *    data: array [             ---  массив элементов для выбора
 *     {
 *       relation: number       --- id связанного элемента при котором список активен (у элемента с default: true отсутствует)
 *       name: string           --- отображаемое имя
 *       id: number             --- value элемента, отображаемое при отправке формы, а так же служит для активации связанного списка
 *     }
 *    ]
 *   }
 *  }
 * }
 *
 */

class RelationBunch {
  start = true;
  container = null;
  element = null;
  options = null;
  defaultType = null;
  temp = null;
  removeButton = null;
  data = {};
  el = {};
  current = {};
  disableMap = {};
  multiples = [];

  constructor(element, container, options, start) {
    this.start = start;
    this.container = container;
    this.element = element;
    this.options = options;
    this.createNewBunch();
    this.createNewOptions();
    if (this.options.rows) {
      this.removeButton = this.element.querySelector('[data-remove]') || null;
      this.removeButton.addEventListener('click', this.removeBunch.bind(this));
    }
  }

  removeBunch() {
    this.container.removeChild(this.element);
  };

  createNewOptions() {
    Object.keys(this.current).forEach(type => {
      if (this.defaultType === type) {
        this.temp = this.data[type];
        this.setOptions(type);
      }
      if (!this.start) return;
      if (!this.disableMap[type]) return;
      this.setRenderArray(this.disableMap[type], this.current[type]);
      this.checkDisabled(this.disableMap[type]);
      this.setOptions(this.disableMap[type]);
    });
  };

  createNewBunch() {
    Object.keys(this.options.create).forEach(type => {
      this.el[type] = this.element.querySelector(`[data-id="${this.options.create[type].dataID}"]`);
      this.data[type] = this.options.create[type].data;
      if (this.options.create[type].disable) {
        this.disableMap[type] = this.options.create[type].disable;
      }
      if (this.options.create[type].multiple) {
        this.multiples.push(type);
      }
      if (this.options.create[type].default) {
        this.defaultType = type;
      }


      if (!this.el[type].dataset.current) {
        this.current[type] = null;
        return;
      }

      if (this.options.create[type].multiple) {
        this.current[type] = this.el[type].dataset.current.split(',').map(Number);
      } else {
        this.current[type] = +this.el[type].dataset.current;
      }
    });
  };

  setCurrent(event) {
    const { type } = event.target.dataset;
    const value = +event.target.value;
    if (this.multiples.includes(type)) {
      return this.setCurrentMultipe(type, value);
    }
    this.current[type] = value;
    this.setRenderArray(this.disableMap[type], value);
    this.resetOptions(type);
    this.checkDisabled(this.disableMap[type]);
    this.setOptions(this.disableMap[type]);
  };

  setCurrentMultipe(type, value) {
    this.current[type].push(value);
  };

  setRenderArray(type, id) {
    if (!id) return;
    const data = this.data[type];
    this.temp = data.find(item => item.relation === id).items;
  };

  setOptions(type) {
    this.temp && this.temp.forEach(item => this.createOptionEl(item.id, item.name, type));
    this.temp = null;
  };

  resetOptions(type) {
    if (this.multiples.includes(this.disableMap[type])) {
      this.el[this.disableMap[type]].innerHTML = '';
      this.current[this.disableMap[type]] = [];
    } else {
      this.current[this.disableMap[type]] = null;
      this.removeOptions(this.disableMap[type]);
    }
    this.el[this.disableMap[type]].setAttribute('disabled', true);
    if (this.disableMap[this.disableMap[type]]) {
      this.resetOptions(this.disableMap[type]);
    }
  };

  removeOptions(type) {
    this.current[type] = null;
    this.el[type].selectedIndex = 0;
    const elChilds = this.el[type].children;
    for (var i = elChilds.length - 1; i > 0; i--) {
      elChilds[i].removeEventListener('click', this.setCurrent);
      this.el[type].removeChild(elChilds[i]);
    }
  };

  createOptionEl(value, text, type) {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    option.setAttribute('data-type', type);
    option.textContent = text;
    option.addEventListener('click', this.setCurrent.bind(this));
    if (this.checkSelected(value, type)) {
      option.setAttribute('selected', 'selected')
    }
    this.el[type].append(option);
  };

  checkSelected(value, type) {
    if (!this.start) return;
    let check;
    if (this.multiples.includes(type)) {
      check = this.current.subways?.includes(value);
      check && (this.current.subways.push(value));
    } else {
      check = this.current[type] === value;
      check && (this.current[type] = value);
    }

    if (check) return true;
    return false;
  };

  checkDisabled(type) {
    if (!this.el[type].hasAttribute('disabled')) return;
    if (!this.temp || this.temp.length < 1) return;
    this.el[type].removeAttribute('disabled');
  };
}

// FABRIC
export default class SelectRelations {
  start = true;
  container = null;
  template = null;
  addButton = null;
  rows = [];

  constructor(options) {
    this.options = options;
    this.element = options.element;
    this.container = this.element.querySelector('[data-container]');
    this.initBunchs();
    this.start = false;
  };

  async initBunchs() {
    const rows = this.element.querySelectorAll('[data-row]');
    rows.forEach(row => {
      this.rows.push(new RelationBunch(row, this.container, this.options, this.start));
    });
    if (this.options.rows) {
      const template = this.element.querySelector('[data-template]');
      this.template = template.innerHTML;
      this.element.removeChild(template);
      this.addButton = this.element.querySelector('[data-add]') || null;
      this.addButton.addEventListener('click', this.addNewSet.bind(this));
    }
  }

  addNewSet() {
    const newSet = document.createElement('div');
    newSet.classList.add('mb-3');
    newSet.setAttribute('data-row', '');
    newSet.innerHTML = this.template;
    this.rows.push(new RelationBunch(newSet, this.container, this.options, this.start));
    this.container.append(newSet);
  };
}
