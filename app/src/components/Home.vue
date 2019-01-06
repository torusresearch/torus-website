<template>
  <div class="home">
    <!-- Header -->
    <header class="site-header is-sticky">
      <!-- Navbar -->
      <div class="navbar navbar-expand-lg is-transparent" id="mainnav">
        <nav class="container">

          <a class="navbar-brand" href="./">
            <img class="logo logo-dark" alt="logo" src="images/logo.png" srcset="images/logo2x.png 2x">
          </a>

          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle">
            <span class="navbar-toggler-icon">
              <span class="ti ti-align-justify"></span>
            </span>
          </button>

          <div class="collapse navbar-collapse justify-content-end" id="navbarToggle">
            <ul class="navbar-nav">
              <li class="nav-item"><a class="nav-link menu-link" href="#about">About<span class="sr-only">(current)</span></a></li>
              <li class="nav-item"><a class="nav-link menu-link" href="#contact">Contact</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <!-- End Navbar -->

      <!-- Banner/Slider -->
      <div id="header" class="banner banner-full banner-curb banner-particle d-flex align-items-center">
        <div class="container">
          <div class="banner-content">
            <div class="row align-items-center">
              <div class="col-lg-6 col-md-12">
                <div class="header-txt tab-center mobile-center">
                  <h1>Frictionless Logins <br> for Dapps</h1>
                  <p class="lead color-secondary">Get started with social logins for your dApp:</p>
                  <div class="alert alert-primary codebox">
                    <p class="mb-0">&lt;script src="https://tor.us/embed-main.min.js"&gt;&lt;/script&gt;</p>
                  </div>
                  <div class="gaps size-3x"></div>
                  <div class="gaps size-3x d-none d-md-block"></div>
                  <div class="header-support">
                    <p>Supported By</p>
                    <img src="images/binance.png" class="img-fluid">
                    <!-- <img src="images/chainrock.png" class="img-fluid ml-4"> -->
                  </div>
                </div>
              </div><!-- .col  -->
              <div class="col-lg-5 offset-lg-1 col-md-12">
                <div class="welcome-img">
                  <div class="holder">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                  </div>
                </div>
              </div><!-- .col  -->
            </div><!-- .row  -->
          </div><!-- .banner-content  -->
        </div><!-- .container  -->
      </div>
      <!-- End Banner/Slider -->
    </header>
    <!-- End Header -->

    <!-- Start Section -->
    <div class="section section-pad section-bg-alt" id="intro">
      <div class="container">
        <div class="row align-items-center justify-content-between">
          <div class="col-md-6">
            <div class="res-m-btm">
              <img src="images/graph-jasmine-b.png" alt="graph">
            </div>
          </div><!-- .col  -->
          <div class="col-md-6 order-md-first order-last">
            <div class="text-block">
              <h6 class="heading-sm-s2">Prioritizing User Experience</h6>
              <h2>Targeting Mainstream Users</h2>
              <p>Although blockchain technology and cryptocurrencies offer many advantages and opportunities, mainstream
                adoption is still relatively low. </p>
              <p>In particular, user experience for key management is still poor, and requires adoption of an entirely new set
                of tools and interfaces. Torus allows users to use their social identities (eg. Google) to derive private keys
                in a trustless manner, making it easy for new users to seamlessly use existing blockchain applications.</p>
            </div>
          </div><!-- .col  -->
        </div><!-- .row  -->
      </div><!-- .conatiner  -->
    </div>
    <!-- Start Section -->

    <!-- Start Section -->
    <div class="section section-pad section-bg" id="about">
      <div class="background-shape bs-reverse"></div>
      <div class="container">
        <div class="row text-center">
          <div class="col">
            <div class="section-head">
              <h2 class="section-title">Torus
                <span>About</span>
              </h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 res-m-bttm">
            <div class="features-box-s3">
              <div class="features-icon-s3"><img src="images/icon-a.png" alt="icon"></div>
              <h5 class="features-title-s3">Trustless Key Distribution</h5>
              <span class="features-subtitle-s3">Safe & Secure</span>
              <p>Private keys are derived from their social identities using Torus' distributed key generation protocol. Each
                node generates a piece of your private key, which are combined and held by you locally.</p>
            </div>
          </div>
          <div class="col-md-4 res-m-bttm">
            <div class="features-box-s3">
              <div class="features-icon-s3"><img src="images/icon-b.png" alt="icon"></div>
              <h5 class="features-title-s3">Seamless Integration</h5>
              <span class="features-subtitle-s3">Instant Application</span>
              <p>Developers only need to include our embedded web3 script into their website to start using Torus today,
                allowing dApps to reach a greater range of users.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="features-box-s3">
              <div class="features-icon-s3"><img src="images/icon-c.png" alt="icon"></div>
              <h5 class="features-title-s3">A Credible Ecosystem</h5>
              <span class="features-subtitle-s3">Trusted Identities</span>
              <p>By integrating existing online social identities, Torus allows users to interact with applications in a more
                meaningul and trusted manner.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End Section -->

    <!-- Start Section -->
    <div class="section section-pad section-bg-alt" id="whitepaper">
      <div id="demo" class="container" style="padding-bottom: 50px">
        <div class="row align-items-center justify-content-between">
          <div class="col-md-12">
            <div class="text-block">
              <h2>Try it out on your dapp</h2>
            </div>
          </div><!-- .col  -->
        </div><!-- .row  -->
      </div><!-- .conatiner  -->
      <div class="container">
        <div class="row align-items-center justify-content-between">
          <div class="col-md-12">
            <div class="text-block">
              <pre class="code">
                    <span class="tr"><span class="th"></span><code>// Add the following script to the top of &lt;head&gt;</code></span>
                    <span class="tr"><span class="th"></span><code>&lt;script src="https://tor.us/embed-main.min.js"&gt;&lt;/script&gt;</code></span>
                    <span class="tr"><span class="th"></span><code></code></span>
                    <span class="tr"><span class="th"></span><code>// Start using web3 in your dapp</code></span>
                    <span class="tr"><span class="th"></span><code>$ web3.eth.accounts[0]</code></span>
                    <span class="tr"><span class="th"></span><code>&gt; "0x05B53A73B...150C005e21"</code></span>
                    </pre>
            </div>
          </div><!-- .col  -->
        </div><!-- .row  -->
      </div><!-- .conatiner  -->
    </div>
    <!-- Start Section -->

    <!-- Start Section -->
    <div class="section section-pad section-bg" id="contact">
      <div class="container">
        <div class="row text-center">
          <div class="col">
            <div class="section-head">
              <h2 class="section-title">Contact Us
                <span>Contact</span>
              </h2>
              <p>Still here? Reach out to us!</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <ul class="contact-info">
              <li><em class="fab fa-linkedin" style="margin-bottom: 15px;"></em><span><a href="https://www.linkedin.com/company/toruslabs/about/">toruslabs</a></span></li>
              <li><em class="fa fa-envelope"></em><span><a href="mailto:hello@tor.us">hello@tor.us</a></span></li>
              <li><em class="fa fa-paper-plane"></em><span><a href="https://t.me/torusprotocol">@torusprotocol</a></span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- End Section -->

    <!-- Start Section -->
    <div class="section footer-scetion no-pt section-pad-sm section-bg-alt">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-12">
            <span class="copyright-text">
              Copyright &copy; 2018, Torus Labs Private Limited.
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- End Section -->

    <!-- Preloader !remove please if you do not want -->
    <div id="preloader">
      <div id="loader"></div>
      <div class="loader-section loader-top"></div>
      <div class="loader-section loader-bottom"></div>
    </div>
    <!-- Preloader End -->

  </div>
</template>

<script>
export default {
  mounted () {
    /* global particlesJS $:true */

    var windowRef = $(window); var bodyRef = $('body'); var navbarRef = $('.navbar')

    // Touch Class
    if (!('ontouchstart' in document.documentElement)) {
      bodyRef.addClass('no-touch')
    }
    // Get Window Width
    function winwidth () {
      return windowRef.width()
    }
    var wwCurrent = winwidth()
    windowRef.on('resize', function () {
      wwCurrent = winwidth()
    })

    // Sticky
    var isSticky = $('.is-sticky')
    if (isSticky.length > 0) {
      var $navm = $('#mainnav').offset()
      windowRef.scroll(function () {
        var $scroll = windowRef.scrollTop()
        if (windowRef.width() > 991 || isSticky.hasClass('mobile-sticky')) {
          if ($scroll > $navm.top) {
            if (!isSticky.hasClass('has-fixed')) { isSticky.addClass('has-fixed') }
          } else {
            if (isSticky.hasClass('has-fixed')) { isSticky.removeClass('has-fixed') }
          }
        } else {
          if (isSticky.hasClass('has-fixed')) { isSticky.removeClass('has-fixed') }
        }
      })
    }

    // OnePage Scrolling
    $('a.menu-link[href*="#"]:not([href="#"])').on('click', function () {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        var toHash = $(this.hash); var toHashN = (this.hash.slice(1)) ? $('[name=' + this.hash.slice(1) + ']') : false; var nbar = (wwCurrent >= 992) ? navbarRef.height() - 1 : 0

        toHash = toHash.length ? toHash : toHashN
        if (toHash.length) {
          $('html, body').animate({
            scrollTop: (toHash.offset().top - nbar)
          }, 1000, 'easeInOutExpo')
          return false
        }
      }
    })

    // Active page menu when click
    var CurURL = window.location.href; var urlSplit = CurURL.split('#')
    var navLink = $('.nav li a')
    if (navLink.length > 0) {
      navLink.each(function () {
        if (CurURL === (this.href) && (urlSplit[1] !== '')) {
          $(this).closest('li').addClass('active').parent().closest('li').addClass('active')
        }
      })
    }

    // Bootstrap Dropdown
    var dropdownMenu = $('.dropdown'); var dropdownToggle = $('.dropdown-toggle')
    if (dropdownMenu.length > 0) {
      dropdownMenu.on('mouseover', function () {
        if (windowRef.width() > 991) {
          $(this).children('.dropdown-menu').stop().fadeIn(400)
          $(this).addClass('open')
        }
      })
      dropdownMenu.on('mouseleave', function () {
        if (windowRef.width() > 991) {
          $(this).children('.dropdown-menu').stop().fadeOut(400)
          $(this).removeClass('open')
        }
      })
      dropdownToggle.on('click', function () {
        if (windowRef.width() < 991) {
          $(this).parent().children('.dropdown-menu').fadeToggle(400)
          $(this).parent().toggleClass('open')
          return false
        }
      })
    }

    windowRef.on('resize', function () {
      $('.navbar-collapse').removeClass('in')
      dropdownMenu.parent().children('.dropdown-menu').fadeOut('400')
    })

    // remove ani
    var $navtoggler = $('.navbar-toggler'); var $trannav = $('.is-transparent')
    if ($navtoggler.length > 0) {
      $navtoggler.on('click', function () {
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
    $('.menu-link').on('click', function () {
      $('.navbar-collapse').collapse('hide')
      $trannav.removeClass('active')
    })
    $(document).on('mouseup', function (e) {
      if (!$trannav.is(e.target) && $trannav.has(e.target).length === 0) {
        $('.navbar-collapse').collapse('hide')
        $trannav.removeClass('active')
      }
    })

    // Carousel Time Line
    var timelineCarousel = $('.timeline-carousel')
    if (timelineCarousel.length > 0) {
      var cRtl = !!(bodyRef.hasClass('is-rtl'))
      timelineCarousel.addClass('owl-carousel').owlCarousel({
        navText: ["<i class='ti ti-angle-left'></i>", "<i class='ti ti-angle-right'></i>"],
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
      var cRtlR = !!(bodyRef.hasClass('is-rtl'))
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
      var cRtlRn = !!(bodyRef.hasClass('is-rtl'))
      roadmapCarouselWithnav.addClass('owl-carousel').owlCarousel({
        navText: ["<i class='ti ti-angle-left'></i>", "<i class='ti ti-angle-right'></i>"],
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
      var cRtlPl = !!(bodyRef.hasClass('is-rtl'))
      prblmsltnList.addClass('owl-carousel').owlCarousel({
        navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"],
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
      var cRtlC = !!(bodyRef.hasClass('is-rtl'))
      hasCarousel.each(function () {
        var $self = $(this)
        var cItem = ($self.data('items')) ? $self.data('items') : 4
        var cItemT = (cItem >= 3) ? 2 : cItem
        var cItemM = (cItemT >= 2) ? 1 : cItemT
        var cDelay = ($self.data('delay')) ? $self.data('delay') : 6000
        var cAuto = !!($self.data('auto'))
        var cLoop = !!($self.data('loop'))
        var cDots = !!($self.data('dots'))
        var cNavs = !!($self.data('navs'))
        var cCtr = !!($self.data('center'))
        var cMgn = ($self.data('margin')) ? $self.data('margin') : 30
        $self.addClass('owl-carousel').owlCarousel({
          navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
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
          responsive: { 0: { items: 1 }, 480: { items: cItemM }, 768: { items: cItemT }, 1170: { items: cItem } }
        })
      })
    }

    // Count Down
    var countToken = $('.token-countdown')
    if (countToken.length > 0) {
      countToken.each(function () {
        var $self = $(this); var datetime = $self.attr('data-date')
        $self.countdown(datetime).on('update.countdown', function (event) {
          $(this).html(event.strftime('' + '<div class="col"><span class="countdown-time countdown-time-first">%D</span><span class="countdown-text">D<span>ays</span></span></div>' + '<div class="col"><span class="countdown-time">%H</span><span class="countdown-text">H<span>ours</span></span></div>' + '<div class="col"><span class="countdown-time">%M</span><span class="countdown-text">M<span>inutes<span></span></div>' + '<div class="col"><span class="countdown-time countdown-time-last">%S</span><span class="countdown-text">S<span>econds</span></span></div>'))
        })
      })
    }

    var countS2 = $('.countdown-s2')
    if (countS2.length > 0) {
      countS2.each(function () {
        var $self = $(this); var datetime = $self.attr('data-date')
        $self.countdown(datetime).on('update.countdown', function (event) {
          $(this).html(event.strftime('' + '<div class="countdown-s2-item"><span class="countdown-s2-time countdown-time-first">%D</span><span class="countdown-s2-text">Days</span></div>' + '<div class="countdown-s2-item"><span class="countdown-s2-time">%H</span><span class="countdown-s2-text">Hours</span></div>' + '<div class="countdown-s2-item"><span class="countdown-s2-time">%M</span><span class="countdown-s2-text">Min</span></div>' + '<div class="countdown-s2-item"><span class="countdown-s2-time countdown-time-last">%S</span><span class="countdown-s2-text">Sec</span></div>'))
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
          beforeOpen: function () {
            this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim')
            this.st.mainClass = this.st.el.attr('data-effect')
          }
        }
      })
    }

    // ImageBG
    var $imageBG = $('.imagebg')
    if ($imageBG.length > 0) {
      $imageBG.each(function () {
        var $this = $(this)

        var $that = $this.parent()

        var overlay = $this.data('overlay')

        var image = $this.children('img').attr('src')
        var olaytyp = (typeof overlay !== 'undefined' && overlay !== '') ? overlay.split('-') : false

        // If image found
        if (typeof image !== 'undefined' && image !== '') {
          if (!$that.hasClass('has-bg-image')) {
            $that.addClass('has-bg-image')
          }
          if (olaytyp !== '' && (olaytyp[0] === 'dark')) {
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
      $maskOV.each(function () {
        var $this = $(this); var $that = $this.parent()
        if (!$that.hasClass('has-maskbg')) {
          $that.addClass('has-maskbg')
        }
      })
    }
    // Ajax Form Submission
    var contactForm = $('#contact-form'); var subscribeForm = $('#subscribe-form')
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
          invalidHandler: function () { qfResults.slideUp(400) },
          submitHandler: function (form) {
            qfResults.slideUp(400)
            $(form).ajaxSubmit({
              target: qfResults,
              dataType: 'json',
              success: function (data) {
                var type = (data.result === 'error') ? 'alert-danger' : 'alert-success'
                qfResults.removeClass('alert-danger alert-success').addClass('alert ' + type).html(data.message).slideDown(400)
                if (data.result !== 'error') { $(form).clearForm().find('.input-field').removeClass('input-focused') }
              }
            })
          }
        })
        selectRec.on('change', function () { $(this).valid() })
      }
      // SubscribeForm
      if (subscribeForm.length > 0) {
        var sfResults = subscribeForm.find('.subscribe-results')
        subscribeForm.validate({
          invalidHandler: function () { sfResults.slideUp(400) },
          submitHandler: function (form) {
            sfResults.slideUp(400)
            $(form).ajaxSubmit({
              target: sfResults,
              dataType: 'json',
              success: function (data) {
                var type = (data.result === 'error') ? 'alert-danger' : 'alert-success'
                sfResults.removeClass('alert-danger alert-success').addClass('alert ' + type).html(data.message).slideDown(400)
                if (data.result !== 'error') { $(form).clearForm() }
              }
            })
          }
        })
      }
    }

    // Input Animation
    var $inputline = $('.input-line')
    if ($inputline.length > 0) {
      $inputline.each(function () {
        var $this = $(this)
        var $thisval = $(this).val()
        if ($thisval.length > 0) {
          $this.parent().addClass('input-focused')
        }
        $this.on('focus', function () {
          $this.parent().addClass('input-focused')
        })
        $this.on('blur', function () {
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
      windowRef.on('load', function () {
        $aniKey.each(function () {
          var aniWay = $(this); var typ = aniWay.data('animate'); var dur = aniWay.data('duration'); var dly = aniWay.data('delay')
          aniWay.waypoint(function () {
            aniWay.addClass('animated ' + typ).css('visibility', 'visible')
            if (dur) {
              aniWay.css('animation-duration', dur + 's')
            }
            if (dly) {
              aniWay.css('animation-delay', dly + 's')
            }
          }, { offset: '93%' })
        })
      })
    }

    // Preloader
    var $preload = $('#preloader'); var $loader = $('#loader')
    console.log('PRELOADER IS', $preload, $loader)
    if ($preload.length > 0) {
      windowRef.on('load', function () {
        $loader.fadeOut(300)
        bodyRef.addClass('loaded')
        $preload.delay(700).fadeOut(300)
      })
    }

    /* @v1.2.0 */
    // Process Slider
    var sliderP = '.slider-pane'; var sliderN = '.slider-nav,.slider-dot'
    if ($(sliderP).length > 0) {
      var cRtlS = !!(bodyRef.hasClass('is-rtl'))
      $(sliderP).addClass('owl-carousel').owlCarousel({
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
      $card.each(function () {
        var $cha = $('.card-header a')
        $cha.on('click', function () {
          var $this = $(this)
          $this.parent().parent().parent().parent().find($card).removeClass('active')
          $this.parent().parent().parent().addClass('active')
        })
      })
    }

    // particlesJS
    var particlesJs = $('#particles-js'); var particlesColor = '#2b56f5'; var particlesColorAlt = '#00c0fa'
    if (bodyRef.hasClass('io-zinnia')) { particlesColor = '#fff'; particlesColorAlt = '#fff' }
    if (particlesJs.length > 0) {
      particlesJS('particles-js',
        // Update your personal code.
        {
          'particles': {
            'number': {
              'value': 30,
              'density': {
                'enable': true,
                'value_area': 800
              }
            },
            'color': {
              'value': particlesColorAlt
            },
            'shape': {
              'type': 'circle',
              'opacity': 0.20,
              'stroke': {
                'width': 0,
                'color': particlesColor
              },
              'polygon': {
                'nb_sides': 5
              },
              'image': {
                'src': 'img/github.svg',
                'width': 100,
                'height': 100
              }
            },
            'opacity': {
              'value': 0.30,
              'random': false,
              'anim': {
                'enable': false,
                'speed': 1,
                'opacity_min': 0.12,
                'sync': false
              }
            },
            'size': {
              'value': 6,
              'random': true,
              'anim': {
                'enable': false,
                'speed': 40,
                'size_min': 0.08,
                'sync': false
              }
            },
            'line_linked': {
              'enable': true,
              'distance': 150,
              'color': particlesColor,
              'opacity': 0.50,
              'width': 1.3
            },
            'move': {
              'enable': true,
              'speed': 6,
              'direction': 'none',
              'random': false,
              'straight': false,
              'out_mode': 'out',
              'bounce': false,
              'attract': {
                'enable': false,
                'rotateX': 600,
                'rotateY': 1200
              }
            }
          },
          'interactivity': {
            'detect_on': 'canvas',
            'events': {
              'onhover': {
                'enable': true,
                'mode': 'repulse'
              },
              'onclick': {
                'enable': true,
                'mode': 'push'
              },
              'resize': true
            },
            'modes': {
              'grab': {
                'distance': 400,
                'line_linked': {
                  'opacity': 1
                }
              },
              'bubble': {
                'distance': 400,
                'size': 40,
                'duration': 2,
                'opacity': 8,
                'speed': 3
              },
              'repulse': {
                'distance': 200,
                'duration': 0.4
              },
              'push': {
                'particles_nb': 4
              },
              'remove': {
                'particles_nb': 2
              }
            }
          },
          'retina_detect': true
        }
        // Stop here.
      )
    }
  }
}
</script>
