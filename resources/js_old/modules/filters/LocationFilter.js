import Chooser from '../../plugins/chooser';

export default class LocationFilter {
  start = true;

  popup = {
    wrapper: null,
    button: null,
    close: null,
    HIDDEN_CLASS: 'hidden',
    hidden: true,
  }

  city = {
    storageMark: null,
    all: null,
    input: null,
    current: null,
    select: null,
    saved: null,
    options: {},
  };

  parent = null;

  open = {
    area: false,
    subway: false
  };

  buttons = {
    area: null,
    subway: null,
  };

  query = {};

  collapse = {
    area: null,
    subway: null,
  };

  activeAreas = [];

  constructor(
    parentId,
    areaButtonId,
    subwayButtonId,
    cityInputId,
    cityOptions,
    collapse,
    cityStorageMark = 'city',
    startCity = null,
  ) {
    this.queryData();

    this.parent = document.getElementById(parentId);
    this.parent.addEventListener('click', this.toggleOpen.bind(this));

    this.buttons.area = areaButtonId;
    this.buttons.subway = subwayButtonId;
    this.city.input = document.getElementById(cityInputId);

    this.collapse.area = collapse.area;
    this.collapse.subway = collapse.subway;

    this.city.options = cityOptions;
    this.city.storageMark = cityStorageMark;

    if (this.checkPath()) {
      this.popup.wrapper = document.getElementById('city_confirm_popup');
      this.popup.close = document.getElementById('city_popup_close');
      this.popup.button = document.getElementById('city_confirm_true');

      if (!this.cityCheckConfirm()) {
        this.popup.close.addEventListener('click', this.popupClose.bind(this));
        this.popup.button.addEventListener('click', this.cityConfirm.bind(this))
      }
    }

    this.initialize();
  }

  checkPath = () => {
    return window.location.pathname == '/';
  }

  initialize = async () => {
    this.city.saved = await this.getCookie();
    this.city.all = await this.getAllCities();



    this.setCityOptions(this.city.all);
    this.city.select = new Chooser(this.city.options);

    const city = this.city.all.find(item => item.id === +this.query.city);
    if (city) this.setCurrentCity(city.id);
    else {
      await this.getCurrentCity(this.city.all);
    }

    this.addAreaListeners();

    if (this.city.current && !this.cityCheckConfirm()) {
      this.popup.wrapper.classList.remove(this.popup.HIDDEN_CLASS);
    }

    this.start = false;
  }

  popupClose = () => {
    this.popup.wrapper.classList.add(this.popup.HIDDEN_CLASS);
  }

  cityConfirm = () => {
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `LOCATION_CONFIRM=1; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
    this.popupClose();

  }
  cityCheckConfirm = () => {
    const cookies = document.cookie.split('; ');
    const confirm = cookies.find(cookie => cookie.startsWith('LOCATION_CONFIRM='));
    if (confirm && confirm.split('=')[1] == '1') return true;
    return false;
  }

  getCookie = async () => {
    const cookies = document.cookie.split('; ');
    const city = cookies.find(cookie => cookie.startsWith('LOCATION='));
    if (city) return city.split('=')[1];
  }

  setCookie = (value) => {
    document.cookie = `LOCATION=${value}; path=/; SameSite=Strict`;
  }

  getBody = async (url) => {
    let resp = await fetch(url);
    resp = await resp.text();
    return resp;
  }

  addFilter = async (url) => {
    const body = await this.getBody(url);
    if (body) {
      this.parent.innerHTML = '';
      this.parent.innerHTML = body;
      return true;
    }
    return false;
  }

  // addLocationFilters = async (city) => {
  //   const areas = await this.addFilter(`/api/location/${city}${window.location.search}`);
  //   if (areas) {
  //     if (this.start) this.start = false;
  //     else this.resetAreasAndSubways();
  //     this.showFilter();
  //     this.addAreaListeners();
  //   }
  // }

  showFilter = () => {
    for (let key in this.collapse) {
      if (this.open[key]) {
        document.getElementById(this.collapse[key]).classList.add('show');
        document.getElementById(this.buttons[key]).setAttribute('aria-expanded', true);
      }
    }
  }

  // getStartId = async () => {
  //   let resp = await fetch('/api/data/location_start');
  //   resp = await resp.text();
  //   return resp;

  // }

  getCurrentCity = async (all) => {
    if (!this.checkPath()) return;

    if (this.city.saved) {
      return this.setCurrentCity(this.city.saved);
    }

    // const start = () => this.getStartId();
    // const setCookie = (id) => this.setCookie(id);
    // const setCity = (id) => this.setCurrentCity(id);

    // await ymaps.ready(async function () {
    //   await ymaps.geolocation.get({}).then(async function (result) {
    //     const userLocation = result.geoObjects.get(0).geometry.getCoordinates();
    //     await ymaps.geocode(userLocation, {
    //       kind: 'locality'
    //     }).then(async function (res) {
    //       const city = res.geoObjects.get(0).getLocalities()[0];
    //       const check = all.find(item => item.name == city);
    //       if (check) {
    //         // setCity(city.id);
    //         window.location.href = `/?city=${city.id}`;
    //       }
    //       else {
    //         const sartId = await start();
    //         const city = all.find(city => city.id == sartId);
    //         if (city) {
    //           setCookie(city.id);
    //           // setCity(city.id);
    //           window.location.href = `/?city=${city.id}`;
    //         }
    //       }
    //     });
    //   });
    // });
  }

  setCurrentCity(current) {
    this.city.select.select(current, true);
  }

  onSelectCity = (id) => {
    // localStorage.setItem(this.city.storageMark, id);
    // // this.addLocationFilters(id);
    // this.activeAreas = [];
    this.city.current = id;
    this.city.input.value = id;
    if (!this.start && this.checkPath()) {
      this.cityConfirm();
      window.location.href = `/?city=${id}`;
    }
  }

  setCityOptions = (cities) => {
    cities.forEach(city => {
      this.city.options.data.push({
        value: city.name,
        index: city.id,
        attr: {
          'val': city.id
        },
      });
    });
    this.city.options.onSelect = (item) => {
      this.onSelectCity(item.index);
    }
  }

  getCityLink = (value) => {
    return `<a href="/?city=${value}">`;
  }

  hideSubways = (e) => {
    this.getSubwayItems().forEach(item => {
      if (this.activeAreas.length == 0) {
        return item.parentElement.classList.remove('hidden');
      }
      if (!this.activeAreas.includes(item.dataset.area_target)) {
        item.parentElement.classList.add('hidden');
        item.checked = false;
      } else {
        item.parentElement.classList.remove('hidden');
      }
    });
  }

  resetAreasAndSubways = () => {
    this.getSubwayItems().forEach(item => item.checked = false);
    this.getAreaItems().forEach(item => item.checked = false);
  }

  changeAreas = (e) => {
    if (e.target.checked) {
      if (!this.activeAreas.includes(e.target.id)) this.activeAreas.push(e.target.id);
    } else if (this.activeAreas.includes(e.target.id)) {
      this.activeAreas.splice(this.activeAreas.indexOf(e.target.id), 1);
    }
    this.hideSubways(e);
  }

  addAreaListeners = () => {
    this.getAreaItems().forEach(item => {
      item.addEventListener('click', this.changeAreas.bind(this));
      if (item.checked) this.activeAreas.push(item.id);
      this.hideSubways();
    });
  }

  getSubwayItems = () => {
    return document.querySelectorAll('[id^="subway_"]');
  };

  getAreaItems = () => {
    return document.querySelectorAll('[id^="area_"]');
  };

  toggleOpen = (e) => {
    for (const key in this.buttons) {
      if (e.target.id !== this.buttons[key]) continue;
      this.open[key] = !this.open[key];
    }
  };

  getAllCities = async () => {
    let resp = await fetch(`/api/data/cities`,);
    resp = await resp.json();
    return resp;
  }

  queryData = () => {
    let params = (new URL(document.location)).searchParams;
    const iterator = params.entries();
    let param = iterator.next();
    do {
      if (param && param.value) {
        this.query[param.value[0]] = param.value[1];
        param = iterator.next();
      }
    } while (!param.done)
  }
}