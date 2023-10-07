export default class YandexMapWorker {
  button = null;
  items = null;
  mapWrapper = null;
  shopsData = null;
  shopList = null;

  markCollection = null;

  classes = {
    show: 'active',
    hide: 'hidden',
  }

  map = false;
  mapAdd = false;

  constructor() {
    this.items = document.querySelectorAll('[data-shop-target]');
    this.mapWrapper = document.getElementById('filter-map');
    this.shopList = document.getElementById('shop-list');
    this.shopsData = Array.from(document.querySelectorAll('input[name="shop_coord"]')).map(item => {
      return {
        path: item.dataset.shopPath,
        coords: JSON.parse(item.value)
      };
    });

    const addMap = () => this.addMap(this.shopsData);
    window.onload = function() {
      addMap();
    };
  }

  addMarkCollection(collection) {
    this.markCollection = collection;
  }

  getMapCenter() {
    let sumLat = 0;
    let sumLong = 0;
    for (var i = 0; i < this.shopsData.length; i++) {
      sumLat += this.shopsData[i].coords.lat;
      sumLong += this.shopsData[i].coords.long;
    }

    return {
      lat: sumLat / this.shopsData.length,
      long: sumLong / this.shopsData.length
    };
  }

  scrollToShop(id) {
    const shopItem = document.querySelector(`[data-shop-target="${id}"]`);
    const shopListHeight = this.shopList.offsetHeight;
    const shopItemHeight = shopItem.offsetHeight;
    const marginBottom = parseFloat(window.getComputedStyle(shopItem).marginBottom);
    const offsetTop = shopItem.offsetTop - this.shopList.offsetTop;
    const scrollToPosition = offsetTop - (shopListHeight / 2) + (shopItemHeight / 2) + (marginBottom / 2);

    this.shopList.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });
  }

  addMap(shopsData) {
    if (this.mapAdd) return;
    const average = this.getMapCenter();
    const hideAllItems = this.hideAllItems.bind(this);
    const showShop = this.showShop.bind(this);
    const scroll = this.scrollToShop.bind(this);
    const shops = this.items;
    const showClass = this.classes.show;
    ymaps.ready(function() {
      var myMap = new ymaps.Map("filter-map", {
        center: [average.lat, average.long],
        zoom: 10,
        controls: ['zoomControl'],
      }, {
        searchControlProvider: 'yandex#search'
      }),

        markCollection = new ymaps.GeoObjectCollection(null, {
          iconColor: '#6c757d'
        });

      for (var i = 0, l = shopsData.length; i < l; i++) {
        const mark = new ymaps.Placemark([shopsData[i].coords['lat'], shopsData[i].coords['long']], { path: shopsData[i].path });
        mark.events.add('click', ((shop) => {
          return function() {
            hideAllItems();
            showShop(shop);
            scroll(shop.path);
            markCollection.each(function(placemark) {
              placemark.options.set('iconColor', '#6c757d');
            });
            mark.options.set('iconColor', '#3d39fc');
          };
        })(shopsData[i]));
        markCollection.add(mark);
      }

      document.querySelectorAll('[data-shop-view]').forEach(shop => shop.addEventListener('click', (e) => {
        shops.forEach(shop => {
          shop.classList.remove(showClass);
          if (e.target.dataset.shopView == shop.dataset.shopTarget) {
            shop.classList.add(showClass);
          }
        });
        markCollection.each(function(mark) {
          mark.options.set('iconColor', '#6c757d');
          if (e.target.dataset.shopView == mark.properties.get('path')) {
            e.target.classList.add(this.classes.show);
            myMap.setCenter(mark.geometry.getCoordinates());
            // myMap.setZoom(15);
            mark.options.set('iconColor', '#3d39fc');
          }
        });
      }));

      myMap.geoObjects.add(markCollection);
    });

    this.mapAdd = true;
  }

  hideMap() {
    this.mapWrapper.classList.remove(this.classes.show);
  }

  showMap() {
    this.mapWrapper.classList.add(this.classes.show);
  }

  showShop(shopData) {
    const target = document.querySelector(`[data-shop-target="${shopData.path}"]`);
    target.classList.remove(this.classes.hide);
    target.classList.add(this.classes.show);
  }

  hideAllItems() {
    this.items.forEach(shopCard => shopCard.classList.add(this.classes.hide));
    this.items.forEach(shopCard => shopCard.classList.remove(this.classes.show));
    this.showMap();
    this.map = true;
  }

  showAllItems() {
    this.items.forEach(shopCard => shopCard.classList.add(this.classes.show));
    this.items.forEach(shopCard => shopCard.classList.remove(this.classes.hide));
    this.hideMap();
    this.map = false;
  }
}


