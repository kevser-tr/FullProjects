var track = document.querySelector(".carousel_track");
var slides = Array.from(track.children);
var nextButton = document.querySelector(".carousel_button--right");
var prevButton = document.querySelector(".carousel_button--left");
var carouselNav = document.querySelector(".carousel_nav");
var nav = Array.from(carouselNav.children);

var slideWidth = slides[0].getBoundingClientRect().width;

//arrange the slides next to each other

/* slides[0].style.left = slideWidth*0 + 'px';
slides[1].style.left = slideWidth*1 + 'px';
slides[2].style.left = slideWidth*2 + 'px';
 */

var setSlidePosition = function (slide, index) {
  slide.style.left = slideWidth * index + "px";
};

slides.forEach(setSlidePosition);

var updateNav = function (currentNav, targetNav) {
  currentNav.classList.remove("current-slide");
  targetNav.classList.add("current-slide");
};

var moveToSlide = function (track, currentSlide, targetSlide) {
  track.style.transform = "translateX(-" + targetSlide.style.left + ")";

  currentSlide.classList.remove("current-slide");
  targetSlide.classList.add("current-slide");
};

var hideShowArrows = function (slides, prevButton, nextButton, targetIndex) {
  if (targetIndex === 0) {
    prevButton.classList.add("is-hidden");
    nextButton.classList.remove("is-hidden");
  } else if (targetIndex === slides.length - 1) {
    prevButton.classList.remove("is-hidden");
    nextButton.classList.add("is-hidden");
  } else {
    prevButton.classList.remove("is-hidden");
    nextButton.classList.remove("is-hidden");
  }
};

//when I click left, move slides to the left
prevButton.addEventListener("click", function () {
  var currentSlide = track.querySelector(".current-slide");
  var prevSlide = currentSlide.previousElementSibling;
  var currentNav = carouselNav.querySelector(".current-slide");
  var prevNav = currentNav.previousElementSibling;
  var prevIndex = slides.findIndex(function (slide) {
    return slide === prevSlide;
  });

  moveToSlide(track, currentSlide, prevSlide);
  updateNav(currentNav, prevNav);
  hideShowArrows(slides, prevButton, nextButton, prevIndex);
});

//when I click right, move slides to the right
nextButton.addEventListener("click", function () {
  var currentSlide = track.querySelector(".current-slide");
  var nextSlide = currentSlide.nextElementSibling;
  var currentNav = carouselNav.querySelector(".current-slide");
  var nextNav = currentNav.nextElementSibling;
  var nextIndex = slides.findIndex(function (slide) {
    return slide === nextSlide;
  });

  moveToSlide(track, currentSlide, nextSlide);
  updateNav(currentNav, nextNav);
  hideShowArrows(slides, prevButton, nextButton, nextIndex);
});

//when I click the nav indicators move to that slide

carouselNav.addEventListener("click", function (e) {
  //what indicator was clicked on
  var targetNav = e.target.closest("button");
  if (!targetNav) return;
  var currentSlide = track.querySelector(".current-slide");
  var currentNav = carouselNav.querySelector(".current-slide");
  //returns the number of the item in the array of nav
  var targetIndex = nav.findIndex(function (item) {
    return item === targetNav;
  });
  var targetSlide = slides[targetIndex];

  moveToSlide(track, currentSlide, targetSlide);

  //to move the color of the nav when on that slide
  updateNav(currentNav, targetNav); //see line 23
  hideShowArrows(slides, prevButton, nextButton, targetIndex);
});
