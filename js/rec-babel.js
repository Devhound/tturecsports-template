'use strict';

$(document).ready(function () {
  /**** INITIALIZING SLIDERS ****/
  $('.rec-home__sliders .video-slider').slick({
    dots: true,
    asNavFor: '.text-slider'
  });

  $('.rec-home__sliders .text-slider').slick({
    arrows: false,
    swipe: false,
    speed: 700,
    asNavFor: '.video-slider'
  });

  /**** SHOWING REC CENTER HOURS ****/
  $('.rec-home__hero').on('click', '.rec-hours-button', function (e) {
    e.preventDefault();

    // Moves the hours in from the right
    $('.rec-hours').animate({
      'right': '0'
    }, {
      complete: function complete() {
        // Disabling scrolling of the page while hours are open
        $("body").css("overflow", "hidden");
      }
    });
  });

  $('.rec-hours').on('click', '.rec-hours__close', function (e) {
    e.preventDefault();

    // Pushes hours out to the right
    $('.rec-hours').animate({
      'right': '-100%'
    }, {
      complete: function complete() {
        // Re-enables scrolling of the page when the hours are closed
        $("body").css("overflow", "initial");
      }
    });
  });

  /**** MAKE DEPARTMENTS FULLSCREEN ON CLICK ****/
  // Variables for the position of the department that gets clicked
  var departmentTop = void 0;
  var departmentLeft = void 0;
  var departmentWidth = void 0;
  var departmentHeight = void 0;
  $('.rec-home__departments').on('click', '.rec-department a', function (e) {
    e.preventDefault();

    var departmentsTop = $('.rec-home__departments').offset().top - 84;
    var department = $(this).closest('.rec-department');
    var plus = department.find('.rec-department__plus');

    // Fading the other departments to hide strange positioning
    // $('.rec-department').not(department).animate({'opacity': 0});
    $('.rec-department').animate({ 'opacity': 0 });

    if (!department.hasClass('active')) {
      // Set the position of the department link
      departmentTop = department.position().top;
      departmentLeft = department.position().left;
      departmentWidth = department.css('width');
      departmentHeight = department.css('height');
      var departmentImageWidth = departmentWidth;
      if ($(window).width() < 1200) {
        departmentImageWidth = '50%';
      }

      // Turning the plus into a minus
      plus.toggleClass('minus');
      plus.animate({
        'bottom': '-.85rem'
      }, {
        start: function start() {
          department.children('a').css({
            'width': departmentImageWidth
          });
        },
        step: function step() {
          plus.css({ 'transform': 'rotate(0)' });
        },
        complete: function complete() {

          // Setting the department to be fixed
          department.css({
            'position': 'absolute',
            'top': departmentTop,
            'left': departmentLeft,
            'width': departmentWidth,
            'z-index': 1000
          });

          // Animating the close button up
          department.find('.rec-department__plus p').animate({
            top: '-15%',
            opacity: 1
          });

          // Animating the clicked department to fill the screen
          department.animate({
            'top': '0px',
            'left': '0px',
            'width': '100%'
          }, {
            start: function start() {
              $('html, body').animate({
                scrollTop: departmentsTop
              });
              // Toggling the active class to set its styles
              department.toggleClass('active');

              // Returning false to keep the scolling smooth
              return false;
            },
            complete: function complete() {
              department.animate({ 'opacity': 1 });
              department.children('.rec-department__details').css({ 'opacity': 1 });
            }
          });
        }
      });
    } else {

      // Turning the minus back into a plus first
      plus.animate({
        'opacity': '1'
      }, {
        start: function start() {
          // Animating the close button down
          department.find('.rec-department__plus p').animate({
            top: '40%',
            opacity: 0
          }, 100);
          plus.toggleClass('minus');
          plus.removeAttr('style');

          department.children('.rec-department__details').css({ 'opacity': 0 });
        },
        complete: function complete(now, fx) {

          // Shrinking down details div
          department.children('.rec-department__details').animate({
            'height': '1px',
            'opacity': 0
          }, {
            start: function start() {
              department.children('.rec-department__details').css('overflow', 'hidden');
            }
          });

          // Shrinking the department info and putting it back where it was
          department.animate({
            'width': departmentWidth,
            'height': departmentHeight,
            'top': departmentTop,
            'left': departmentLeft
          }, {
            start: function start() {
              department.css({ 'min-height': '0px' });
            },
            complete: function complete() {
              // Toggling the active class to set its styles
              department.toggleClass('active');
              // Removing all element styles set by the animation
              department.removeAttr('style');
              department.children('.rec-department__details').removeAttr('style');
              department.find('.rec-department__plus p').removeAttr('style');

              // Bringing all the departments back into view
              $('.rec-department').not(department).animate({ 'opacity': 1 });
            }
          });
        }
      });
    }
  });

  /**** ELEMENTS MOVE ON SCROLL ****/
  if ($(window).width() > 1200) {
    // Initial scrollTop
    var lastScrollTop = 0;

    $(window).scroll(function () {
      var currentScrollTop = $(this).scrollTop();
      var scrollDistance = lastScrollTop - currentScrollTop;
      console.log(scrollDistance);
      var flexDistance = scrollDistance;

      // Making sure flex distance isn't more than 15
      if (flexDistance > 15) {
        flexDistance = 15;
      } else if (flexDistance < -15) {
        flexDistance = -15;
      }
      // console.log(flexDistance);

      // Test if scrolling up or down
      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        $('.flex-on-scroll').css({ "transition": "all .4s ease", "-webkit-transform": "translate3d(0px, " + flexDistance * 1.25 + "px, 0px)", "transform": "translate3d(0px, " + flexDistance * 1.25 + "px, 0px)" });
      } else {
        // Scrolling up
        $('.flex-on-scroll').css({ "transition": "all .4s ease", "-webkit-transform": "translate3d(0px, " + flexDistance * 1.25 + "px, 0px)", "transform": "translate3d(0px, " + flexDistance * 1.25 + "px, 0px)" });
      }

      // Detect when the user stops scrolling and put the elements back in their positions
      clearTimeout($.data(this, 'scrollTimer'));
      $.data(this, 'scrollTimer', setTimeout(function () {
        // do something
        $('.flex-on-scroll').css({ "transition": "all 1.4s ease", "-webkit-transform": "translate3d(0px, 0px, 0px)", "transform": "translate3d(0px, 0px, 0px)" });
      }, 250));

      // Setting the last scroll position
      lastScrollTop = currentScrollTop;
    });
  }

  // Gets the current position of an element
  function getCurrentPosition(scrollTop, $element) {
    var elementOffset = $element.offset().top;

    return scrollTop - elementOffset;
  }
});