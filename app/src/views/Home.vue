<template>
  <HomeComponent/>
</template>

<script>
// @ is an alias to /src
import HomeComponent from '../components/HomeComponent.vue'

export default {
  name: 'home',
  components: {
    HomeComponent
  },
  mounted() {
    /* global particlesJS $:true */

    var windowRef = $(window)
    var bodyRef = $('body')
    var navbarRef = $('.navbar')

    // Touch Class
    if (!('ontouchstart' in document.documentElement)) {
      bodyRef.addClass('no-touch')
    }
    // Get Window Width
    function winwidth() {
      return windowRef.width()
    }
    var wwCurrent = winwidth()
    windowRef.on('resize', function() {
      wwCurrent = winwidth()
    })

    // Sticky
    var isSticky = $('.is-sticky')
    if (isSticky.length > 0) {
      var $navm = $('#mainnav').offset()
      windowRef.scroll(function() {
        var $scroll = windowRef.scrollTop()
        if (windowRef.width() > 991 || isSticky.hasClass('mobile-sticky')) {
          if ($scroll > $navm.top) {
            if (!isSticky.hasClass('has-fixed')) {
              isSticky.addClass('has-fixed')
            }
          } else {
            if (isSticky.hasClass('has-fixed')) {
              isSticky.removeClass('has-fixed')
            }
          }
        } else {
          if (isSticky.hasClass('has-fixed')) {
            isSticky.removeClass('has-fixed')
          }
        }
      })
    }

    // OnePage Scrolling
    $('a.menu-link[href*="#"]:not([href="#"])').on('click', function() {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        var toHash = $(this.hash)
        var toHashN = this.hash.slice(1) ? $('[name=' + this.hash.slice(1) + ']') : false
        var nbar = wwCurrent >= 992 ? navbarRef.height() - 1 : 0

        toHash = toHash.length ? toHash : toHashN
        if (toHash.length) {
          $('html, body').animate(
            {
              scrollTop: toHash.offset().top - nbar
            },
            1000,
            'easeInOutExpo'
          )
          return false
        }
      }
    })

    // Active page menu when click
    var CurURL = window.location.href
    var urlSplit = CurURL.split('#')
    var navLink = $('.nav li a')
    if (navLink.length > 0) {
      navLink.each(function() {
        if (CurURL === this.href && urlSplit[1] !== '') {
          $(this)
            .closest('li')
            .addClass('active')
            .parent()
            .closest('li')
            .addClass('active')
        }
      })
    }

    // Bootstrap Dropdown
    var dropdownMenu = $('.dropdown')
    var dropdownToggle = $('.dropdown-toggle')
    if (dropdownMenu.length > 0) {
      dropdownMenu.on('mouseover', function() {
        if (windowRef.width() > 991) {
          $(this)
            .children('.dropdown-menu')
            .stop()
            .fadeIn(400)
          $(this).addClass('open')
        }
      })
      dropdownMenu.on('mouseleave', function() {
        if (windowRef.width() > 991) {
          $(this)
            .children('.dropdown-menu')
            .stop()
            .fadeOut(400)
          $(this).removeClass('open')
        }
      })
      dropdownToggle.on('click', function() {
        if (windowRef.width() < 991) {
          $(this)
            .parent()
            .children('.dropdown-menu')
            .fadeToggle(400)
          $(this)
            .parent()
            .toggleClass('open')
          return false
        }
      })
    }

    windowRef.on('resize', function() {
      $('.navbar-collapse').removeClass('in')
      dropdownMenu
        .parent()
        .children('.dropdown-menu')
        .fadeOut('400')
    })

    // remove ani
    var $navtoggler = $('.navbar-toggler')
    var $trannav = $('.is-transparent')
    if ($navtoggler.length > 0) {
      $navtoggler.on('click', function() {
        $('.remove-animation').removeClass('animated')
        if (!$trannav.hasClass('active')) {
          $trannav.addClass('active')
        } else {
          $trannav.removeClass('active')
        }
      })
    }

    // Select
    var $selectbox = $('select')
    if ($selectbox.length > 0) {
      $selectbox.select2()
    }

    // Nav collapse
    $('.menu-link').on('click', function() {
      $('.navbar-collapse').collapse('hide')
      $trannav.removeClass('active')
    })
    $(document).on('mouseup', function(e) {
      if (!$trannav.is(e.target) && $trannav.has(e.target).length === 0) {
        $('.navbar-collapse').collapse('hide')
        $trannav.removeClass('active')
      }
    })

    // Carousel Time Line
    var timelineCarousel = $('.timeline-carousel')
    if (timelineCarousel.length > 0) {
      var cRtl = !!bodyRef.hasClass('is-rtl')
      timelineCarousel.addClass('owl-carousel').owlCarousel({
        navText: ['<i class=\'ti ti-angle-left\'></i>', '<i class=\'ti ti-angle-right\'></i>'],
        items: 6,
        nav: true,
        margin: 30,
        rtl: cRtl,
        responsive: {
          0: {
            items: 1
          },
          400: {
            items: 2,
            center: false
          },
          599: {
            items: 3
          },
          1024: {
            items: 5
          },
          1170: {
            items: 6
          }
        }
      })
    }

    // Carousel Roadmap
    var roadmapCarousel = $('.roadmap-carousel')
    if (roadmapCarousel.length > 0) {
      var cRtlR = !!bodyRef.hasClass('is-rtl')
      roadmapCarousel.addClass('owl-carousel').owlCarousel({
        items: 6,
        nav: false,
        dost: true,
        margin: 30,
        rtl: cRtlR,
        responsive: {
          0: {
            items: 1
          },
          400: {
            items: 2,
            center: false
          },
          599: {
            items: 3
          },
          1024: {
            items: 4
          },
          1170: {
            items: 5
          }
        }
      })
    }

    // Carousel Roadmap
    var roadmapCarouselWithnav = $('.roadmap-carousel-withnav')
    if (roadmapCarouselWithnav.length > 0) {
      var cRtlRn = !!bodyRef.hasClass('is-rtl')
      roadmapCarouselWithnav.addClass('owl-carousel').owlCarousel({
        // eslint-disable-next-line prettier/prettier
        navText: ['<i class=\'ti ti-angle-left\'></i>', '<i class=\'ti ti-angle-right\'></i>'],
        items: 5,
        nav: true,
        dost: false,
        margin: 30,
        rtl: cRtlRn,
        responsive: {
          0: {
            items: 1
          },
          400: {
            items: 2,
            center: false
          },
          599: {
            items: 3
          },
          1024: {
            items: 4
          },
          1170: {
            items: 5
          }
        }
      })
    }

    // Carousel Prblm Sltn
    var prblmsltnList = $('.prblmsltn-list')
    if (prblmsltnList.length > 0) {
      var cRtlPl = !!bodyRef.hasClass('is-rtl')
      prblmsltnList.addClass('owl-carousel').owlCarousel({
        // eslint-disable-next-line prettier/prettier
        navText: ['<i class=\'fas fa-arrow-left\'></i>', '<i class=\'fas fa-arrow-right\'></i>'],
        items: 1,
        margin: 30,
        nav: true,
        dost: false,
        autoplay: true,
        loop: true,
        animateOut: 'fadeOut',
        autoHeight: true,
        rtl: cRtlPl
      })
    }

    // Carousel
    var hasCarousel = $('.has-carousel')
    if (hasCarousel.length > 0) {
      var cRtlC = !!bodyRef.hasClass('is-rtl')
      hasCarousel.each(function() {
        var $self = $(this)
        var cItem = $self.data('items') ? $self.data('items') : 4
        var cItemT = cItem >= 3 ? 2 : cItem
        var cItemM = cItemT >= 2 ? 1 : cItemT
        var cDelay = $self.data('delay') ? $self.data('delay') : 6000
        var cAuto = !!$self.data('auto')
        var cLoop = !!$self.data('loop')
        var cDots = !!$self.data('dots')
        var cNavs = !!$self.data('navs')
        var cCtr = !!$self.data('center')
        var cMgn = $self.data('margin') ? $self.data('margin') : 30
        $self.addClass('owl-carousel').owlCarousel({
          navText: ['<i class=\'fa fa-angle-left\'></i>', '<i class=\'fa fa-angle-right\'></i>'],
          items: cItem,
          loop: cLoop,
          nav: cNavs,
          dots: cDots,
          margin: cMgn,
          center: cCtr,
          autoplay: cAuto,
          autoplayTimeout: cDelay,
          autoplaySpeed: 300,
          rtl: cRtlC,
          responsive: {
            0: { items: 1 },
            480: { items: cItemM },
            768: { items: cItemT },
            1170: { items: cItem }
          }
        })
      })
    }

    // Count Down
    var countToken = $('.token-countdown')
    if (countToken.length > 0) {
      countToken.each(function() {
        var $self = $(this)
        var datetime = $self.attr('data-date')
        $self.countdown(datetime).on('update.countdown', function(event) {
          $(this).html(
            event.strftime(
              '' +
                '<div class="col"><span class="countdown-time countdown-time-first">%D</span><span class="countdown-text">D<span>ays</span></span></div>' +
                '<div class="col"><span class="countdown-time">%H</span><span class="countdown-text">H<span>ours</span></span></div>' +
                '<div class="col"><span class="countdown-time">%M</span><span class="countdown-text">M<span>inutes<span></span></div>' +
                '<div class="col"><span class="countdown-time countdown-time-last">%S</span><span class="countdown-text">S<span>econds</span></span></div>'
            )
          )
        })
      })
    }

    var countS2 = $('.countdown-s2')
    if (countS2.length > 0) {
      countS2.each(function() {
        var $self = $(this)
        var datetime = $self.attr('data-date')
        $self.countdown(datetime).on('update.countdown', function(event) {
          $(this).html(
            event.strftime(
              '' +
                '<div class="countdown-s2-item"><span class="countdown-s2-time countdown-time-first">%D</span><span class="countdown-s2-text">Days</span></div>' +
                '<div class="countdown-s2-item"><span class="countdown-s2-time">%H</span><span class="countdown-s2-text">Hours</span></div>' +
                '<div class="countdown-s2-item"><span class="countdown-s2-time">%M</span><span class="countdown-s2-text">Min</span></div>' +
                '<div class="countdown-s2-item"><span class="countdown-s2-time countdown-time-last">%S</span><span class="countdown-s2-text">Sec</span></div>'
            )
          )
        })
      })
    }

    // POPUP - Content
    var contentPopup = $('.content-popup')
    if (contentPopup.length > 0) {
      contentPopup.magnificPopup({
        type: 'inline',
        preloader: true,
        removalDelay: 400,
        mainClass: 'mfp-fade bg-team-exp'
      })
    }

    // POPUP - Video
    var videoPlay = $('.video-play')
    if (videoPlay.length > 0) {
      videoPlay.magnificPopup({
        type: 'iframe',
        removalDelay: 160,
        preloader: true,
        fixedContentPos: false,
        callbacks: {
          beforeOpen: function() {
            this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim')
            this.st.mainClass = this.st.el.attr('data-effect')
          }
        }
      })
    }

    // ImageBG
    var $imageBG = $('.imagebg')
    if ($imageBG.length > 0) {
      $imageBG.each(function() {
        var $this = $(this)

        var $that = $this.parent()

        var overlay = $this.data('overlay')

        var image = $this.children('img').attr('src')
        var olaytyp = typeof overlay !== 'undefined' && overlay !== '' ? overlay.split('-') : false

        // If image found
        if (typeof image !== 'undefined' && image !== '') {
          if (!$that.hasClass('has-bg-image')) {
            $that.addClass('has-bg-image')
          }
          if (olaytyp !== '' && olaytyp[0] === 'dark') {
            if (!$that.hasClass('light')) {
              $that.addClass('light')
            }
          }
          $this.css('background-image', 'url("' + image + '")').addClass('bg-image-loaded')
        }
      })
    }
    // Mask Class add
    var $maskOV = $('[class*="mask-ov"]')
    if ($maskOV.length > 0) {
      $maskOV.each(function() {
        var $this = $(this)
        var $that = $this.parent()
        if (!$that.hasClass('has-maskbg')) {
          $that.addClass('has-maskbg')
        }
      })
    }
    // Ajax Form Submission
    var contactForm = $('#contact-form')
    var subscribeForm = $('#subscribe-form')
    if (contactForm.length > 0 || subscribeForm.length > 0) {
      if (!$().validate || !$().ajaxSubmit) {
        console.log('contactForm: jQuery Form or Form Validate not Defined.')
        return true
      }
      // ContactForm
      if (contactForm.length > 0) {
        var selectRec = contactForm.find('select.required')

        var qfResults = contactForm.find('.form-results')
        contactForm.validate({
          invalidHandler: function() {
            qfResults.slideUp(400)
          },
          submitHandler: function(form) {
            qfResults.slideUp(400)
            $(form).ajaxSubmit({
              target: qfResults,
              dataType: 'json',
              success: function(data) {
                var type = data.result === 'error' ? 'alert-danger' : 'alert-success'
                qfResults
                  .removeClass('alert-danger alert-success')
                  .addClass('alert ' + type)
                  .html(data.message)
                  .slideDown(400)
                if (data.result !== 'error') {
                  $(form)
                    .clearForm()
                    .find('.input-field')
                    .removeClass('input-focused')
                }
              }
            })
          }
        })
        selectRec.on('change', function() {
          $(this).valid()
        })
      }
      // SubscribeForm
      if (subscribeForm.length > 0) {
        var sfResults = subscribeForm.find('.subscribe-results')
        subscribeForm.validate({
          invalidHandler: function() {
            sfResults.slideUp(400)
          },
          submitHandler: function(form) {
            sfResults.slideUp(400)
            $(form).ajaxSubmit({
              target: sfResults,
              dataType: 'json',
              success: function(data) {
                var type = data.result === 'error' ? 'alert-danger' : 'alert-success'
                sfResults
                  .removeClass('alert-danger alert-success')
                  .addClass('alert ' + type)
                  .html(data.message)
                  .slideDown(400)
                if (data.result !== 'error') {
                  $(form).clearForm()
                }
              }
            })
          }
        })
      }
    }

    // Input Animation
    var $inputline = $('.input-line')
    if ($inputline.length > 0) {
      $inputline.each(function() {
        var $this = $(this)
        var $thisval = $(this).val()
        if ($thisval.length > 0) {
          $this.parent().addClass('input-focused')
        }
        $this.on('focus', function() {
          $this.parent().addClass('input-focused')
        })
        $this.on('blur', function() {
          $this.parent().removeClass('input-focused')
          var $afterblur = $(this).val()
          if ($afterblur.length > 0) {
            $this.parent().addClass('input-focused')
          }
        })
      })
    }

    // On Scroll Animation
    var $aniKey = $('.animated')
    if ($().waypoint && $aniKey.length > 0) {
      windowRef.on('load', function() {
        $aniKey.each(function() {
          var aniWay = $(this)
          var typ = aniWay.data('animate')
          var dur = aniWay.data('duration')
          var dly = aniWay.data('delay')
          aniWay.waypoint(
            function() {
              aniWay.addClass('animated ' + typ).css('visibility', 'visible')
              if (dur) {
                aniWay.css('animation-duration', dur + 's')
              }
              if (dly) {
                aniWay.css('animation-delay', dly + 's')
              }
            },
            { offset: '93%' }
          )
        })
      })
    }

    // Preloader
    var $preload = $('#preloader')
    var $loader = $('#loader')
    if ($preload.length > 0) {
      windowRef.on('load', function() {
        $loader.fadeOut(300)
        bodyRef.addClass('loaded')
        $preload.delay(700).fadeOut(300)
      })
    }

    /* @v1.2.0 */
    // Process Slider
    var sliderP = '.slider-pane'
    var sliderN = '.slider-nav,.slider-dot'
    if ($(sliderP).length > 0) {
      var cRtlS = !!bodyRef.hasClass('is-rtl')
      $(sliderP)
        .addClass('owl-carousel')
        .owlCarousel({
          items: 1,
          nav: false,
          dotsContainer: sliderN,
          margin: 30,
          loop: true,
          autoplayTimeout: 3000,
          rtl: cRtlS,
          autoplay: true,
          animateOut: 'fadeOut',
          autoplayHoverPause: true
        })
    }

    // accordian
    var $card = $('.card')
    if ($card.length > 0) {
      $card.each(function() {
        var $cha = $('.card-header a')
        $cha.on('click', function() {
          var $this = $(this)
          $this
            .parent()
            .parent()
            .parent()
            .parent()
            .find($card)
            .removeClass('active')
          $this
            .parent()
            .parent()
            .parent()
            .addClass('active')
        })
      })
    }

    // particlesJS
    var particlesJs = $('#particles-js')
    var particlesColor = '#2b56f5'
    var particlesColorAlt = '#00c0fa'
    if (bodyRef.hasClass('io-zinnia')) {
      particlesColor = '#fff'
      particlesColorAlt = '#fff'
    }
    if (particlesJs.length > 0) {
      particlesJS(
        'particles-js',
        // Update your personal code.
        {
          particles: {
            number: {
              value: 30,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: particlesColorAlt
            },
            shape: {
              type: 'circle',
              opacity: 0.2,
              stroke: {
                width: 0,
                color: particlesColor
              },
              polygon: {
                nb_sides: 5
              },
              image: {
                src: 'img/github.svg',
                width: 100,
                height: 100
              }
            },
            opacity: {
              value: 0.3,
              random: false,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.12,
                sync: false
              }
            },
            size: {
              value: 6,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.08,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: particlesColor,
              opacity: 0.5,
              width: 1.3
            },
            move: {
              enable: true,
              speed: 6,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'repulse'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
              },
              repulse: {
                distance: 200,
                duration: 0.4
              },
              push: {
                particles_nb: 4
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
        }
        // Stop here.
      )
    }
  }
}
</script>
