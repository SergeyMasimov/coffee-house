const slides = document.querySelectorAll('.favourites__coffee--slide');
const progressBars = document.querySelectorAll('.progress');

function startProgressBarAnimation(bar) {
  const progressBar = bar.querySelector('.progress__animation');
  progressBar.style.width = '0';
  progressBar.style.animation = 'moving 4s linear infinite';
}

function stopProgressBarAnimation(bar) {
  const progressBar = bar.querySelector('.progress__animation');
  progressBar.style.animation = 'none';
}

function switchSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.dataset.active = true;
      startProgressBarAnimation(progressBars[i]);
    } else {
      delete slide.dataset.active;
      stopProgressBarAnimation(progressBars[i]);
    }
  });
}


function pauseBarAnimationOnHover() {
  const activeSlide = document.querySelector('[data-active]');
  const currentIndex = Array.from(slides).indexOf(activeSlide);

  const progressBar = progressBars[currentIndex].querySelector('.progress__animation');
  const computedStyle = window.getComputedStyle(progressBar);
  const width = computedStyle.getPropertyValue('width');

  progressBar.style.animationPlayState = 'paused';
  progressBar.style.width = width;
}

function resumeBarAnimation() {
  const activeSlide = document.querySelector('[data-active]');
  const currentIndex = Array.from(slides).indexOf(activeSlide);

  startProgressBarAnimation(progressBars[currentIndex]);
}

slides.forEach((slide) => {
  slide.addEventListener('mouseenter', pauseBarAnimationOnHover);
  slide.addEventListener('mouseleave', resumeBarAnimation);
});

let intervalId;
let touchStartX = 0;
let touchEndX = 0;
let pauseStartTime = 0;
let pausedTime = 0;
let isPaused = false;

const onNext = () => handleImageChange(1);
const onPrev = () => handleImageChange(-1);

const startAutoSlide = () => {
  if (!isPaused) {
    clearInterval(intervalId);
    intervalId = setInterval(onNext, 4000 - pausedTime);
    pauseStartTime = Date.now();
  }
};

const stopAutoSlide = () => {
  clearInterval(intervalId);
  pausedTime = 0;
  pauseStartTime = Date.now();
};

const sliderContainer = document.querySelector('.slider__container');
const arrows = document.querySelector('.arrow');

sliderContainer.addEventListener('mouseenter', () => {
  isPaused = true;
  stopAutoSlide();
  pauseBarAnimationOnHover();
});

sliderContainer.addEventListener('mouseleave', () => {
  isPaused = false;
  resumeBarAnimation();
  startAutoSlide();
});

arrows.addEventListener('mouseenter', () => {
  isPaused = true;
  stopAutoSlide();
  pauseStartTime = Date.now();
});

arrows.addEventListener('mouseleave', () => {
  isPaused = false;
  startAutoSlide();
});

sliderContainer.addEventListener('touchstart', () => {
  isPaused = true;
  stopAutoSlide();
  pauseStartTime = Date.now();
});

sliderContainer.addEventListener('touchend', () => {
  isPaused = false;
  pausedTime += Date.now() - pauseStartTime;
  startAutoSlide();
});

function handleImageChange(offset) {
  const activeSlide = document.querySelector('[data-active]');
  const currentIndex = Array.from(slides).indexOf(activeSlide);
  let newIndex = currentIndex + offset;

  if (newIndex < 0) newIndex = slides.length - 1;
  if (newIndex >= slides.length) newIndex = 0;

  switchSlide(newIndex);
}

switchSlide(0);
startAutoSlide();

function openModal() {
  document.body.classList.add('modal-open');
}

function closeModal() {
  document.body.classList.remove('modal-open');
}

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



const menuLinks = document.querySelectorAll('.nav__menu--link'); // Получаем все ссылки меню

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


sliderContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
});

sliderContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const difference = touchStartX - touchEndX;
  const threshold = Math.abs(difference);

  if (threshold > 50) {
    if (touchStartX > touchEndX) {
      onNext(); // Свайп влево, переключение на следующий слайд
    } else {
      onPrev(); // Свайп вправо, переключение на предыдущий слайд
    }
  }
}