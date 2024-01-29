
const menuList = document.querySelectorAll('.menu__list');
const menuListItem = document.querySelectorAll('.menu__list--item');
const loadMoreBtn = document.getElementById('load-more');
const windowWidth = window.innerWidth;
const menuTea = document.querySelector('.menu__list.tea');
const menuLoad = document.querySelector('.menu__list.load__more');

window.addEventListener('resize', function () {
  const windowWidth = window.innerWidth;

  if (windowWidth === 768 || windowWidth === 380) {
    location.reload();
  }
});

loadMoreBtn.addEventListener('click', function () {
  const activeMenuList = document.querySelector('.menu__list.active');
  const visibleItems = activeMenuList.querySelectorAll('.menu__list--item:not(.hidden)');

  for (let i = 0; i < visibleItems.length; i++) {
    if (i >= 4) {
      visibleItems[i].classList.remove('hidden');
    }
  }

  const hiddenItems = activeMenuList.querySelectorAll('.menu__list--item.hidden');
  if (hiddenItems.length > 0) {
    loadMoreBtn.classList.remove('load__more');
  } else {
    loadMoreBtn.classList.add('load__more');
  }
});

loadMoreBtn.addEventListener('click', function () {

  menuList.forEach(function (item) {
    item.classList.toggle('load__more');
  });



  console.log('hi');
});

const categoryButtons = document.querySelectorAll('.category__button');


categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    loadMoreBtn.classList.add('load__more');

    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    menuList.forEach(list => {
      list.classList.remove('active');
      if (list.classList.contains(category)) {
        list.classList.add('active');
      }
    });
  });
});

categoryButtons.forEach((button, index) => {
  button.addEventListener('click', () => {

    categoryButtons.forEach(btn => btn.classList.remove('active'));

    menuList.forEach(list => list.classList.remove('active'));

    button.classList.add('active');

    menuList[index].classList.add('active');


    if (windowWidth <= 768) {
      if (button.textContent.trim() === 'Tea') {
        loadMoreBtn.classList.add('load__more');
        menuList[index].style.marginBottom = '100px';
      }
     else {
      menuList.forEach(list => {
        list.classList.remove('load__more');
      });
      loadMoreBtn.classList.remove('load__more');
    }
    }
  });
});

menuList[0].classList.add('active');

function handleModal(modal) {
  const sizeItems = modal.querySelectorAll('.size__item');
  const additivesItems = modal.querySelectorAll('.additives__item');
  const totalPriceElement = modal.querySelector('.total__price');
  const totalButton = modal.querySelector('.total__button');
  
  let additivesPrice = 0.00;
  const additivePrice = 0.50;

  const sizePrices = {
    'S': 0.00,
    'M': 0.50,
    'L': 1.00
  };

  let totalPrice = parseFloat(modal.dataset.totalPrice); // Получить тотал прайс из атрибута data-total-price

  sizeItems.forEach(item => {
    item.addEventListener('click', () => {
      sizeItems.forEach(item => {
        item.classList.remove('active');
      });

      item.classList.add('active');

      const size = item.querySelector('.size__letter').textContent;

      totalPrice = parseFloat(modal.dataset.totalPrice) + sizePrices[size] + additivesPrice; // Обновляем общую стоимость в соответствии с размером
      totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    });
  });

  additivesItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');

      if (item.classList.contains('active')) {
        additivesPrice += additivePrice;
      } else {
        additivesPrice -= additivePrice;
      }

      sizeItems.forEach(sizeItem => {
        if (sizeItem.classList.contains('active')) {
          const size = sizeItem.querySelector('.size__letter').textContent;
          totalPrice = parseFloat(modal.dataset.totalPrice) + sizePrices[size] + additivesPrice; // Обновляем общую стоимость при изменении добавок
        }
      });

      totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    });
  });

  totalButton.addEventListener('click', () => {
    modal.classList.remove('modal--visible');
    modalOverlay.classList.remove('modal__overlay--visible');
    closeModal()
  });
}

const modals = document.querySelectorAll('.modal');


modals.forEach(modal => {
  handleModal(modal);
});

const modalOverlay = document.querySelector('.modal__overlay');

function openModal() {
  document.body.classList.add('modal-open');
}

function closeModal() {
  document.body.classList.remove('modal-open');
}


menuListItem.forEach((el) => {
  el.addEventListener('click', (e) => {
    let path = e.currentTarget.getAttribute('data-path');

    modals.forEach((el) => {
      el.classList.remove('modal--visible');
    });

    document.querySelector(`[data-target="${path}"]`).classList.toggle('modal--visible');
    modalOverlay.classList.toggle('modal__overlay--visible');

    openModal();
  });
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('modal__overlay--visible');
    modals.forEach((el) => {
      el.classList.remove('modal--visible');
    });
    closeModal();
  }
});


const menuButton = document.getElementById('menuButton');
const navMenuList = document.querySelector('.nav__menu--list');


menuButton.addEventListener('click', function() {
  this.classList.toggle('active');
  if (document.body.classList.contains('modal-open')) {
    closeModal();
  } else {
    openModal();
  }
});


menuButton.addEventListener('click', function() {
  navMenuList.classList.toggle('active');
});



const menuLinks = document.querySelectorAll('.nav__menu--link');

menuLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();

    const href = this.getAttribute('href');
    
    if (href && href !== '#') {
      menuButton.classList.remove('active');
      closeModal();
      
      const menuItems = document.querySelectorAll('.nav__menu--item');
      menuItems.forEach(item => {
        item.classList.remove('active');
      });
      
      this.closest('.nav__menu--item').classList.add('active');
      
      const navMenuList = document.querySelector('.nav__menu--list');
      navMenuList.classList.remove('active');
      
      window.location.href = href;
    } else if (href === '#') {
      const targetId = this.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});