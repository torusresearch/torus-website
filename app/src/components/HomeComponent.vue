<template>
  <div class="home">
    <!-- Header -->
    <header class="site-header is-sticky">
      <!-- Navbar -->
      <div class="navbar navbar-expand-lg is-transparent" id="mainnav">
        <nav class="container">
          <a class="navbar-brand" href="./">
            <img class="logo logo-dark" alt="logo" src="images/logo.png" srcset="images/logo2x.png 2x" />
          </a>

          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle">
            <span class="navbar-toggler-icon">
              <span class="ti ti-align-justify"></span>
            </span>
          </button>

          <div class="collapse navbar-collapse justify-content-end" id="navbarToggle">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link menu-link" href="#about">
                  About
                  <span class="sr-only">(current)</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link menu-link" href="#contact">Contact</a>
              </li>
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
              <div class="col-lg-12 col-md-12">
                <div class="header-txt tab-center mobile-center">
                  <h1>Frictionless Logins <br />for Dapps</h1>
                  <p class="lead color-secondary">Get started with social logins for your dApp:</p>
                  <div class="alert alert-primary codebox">
                    <p class="mb-0">
                      &lt;script src="https://tor.us/embed.min.js" integrity="sha384-dGr6wqRePhPLjm2H13o1vw0FyuG17flwcAqtKu/rhueQVEu8yWxEclutPuLI219O"
                      crossorigin="anonymous"&gt;&lt;/script&gt;
                    </p>
                  </div>
                  <div class="gaps size-3x"></div>
                  <div class="gaps size-3x d-none d-md-block"></div>
                  <div class="header-support">
                    <p>Supported By</p>
                    <img src="images/binance.png" class="img-fluid" />
                    <!-- <img src="images/chainrock.png" class="img-fluid ml-4"> -->
                  </div>
                </div>
              </div>
              <!-- .col  -->
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
              </div>
              <!-- .col  -->
            </div>
            <!-- .row  -->
          </div>
          <!-- .banner-content  -->
        </div>
        <!-- .container  -->
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
              <img src="images/graph-jasmine-b.png" alt="graph" />
            </div>
          </div>
          <!-- .col  -->
          <div class="col-md-6 order-md-first order-last">
            <div class="text-block">
              <h6 class="heading-sm-s2">Prioritizing User Experience</h6>
              <h2>Targeting Mainstream Users</h2>
              <p>
                Although blockchain technology and cryptocurrencies offer many advantages and opportunities, mainstream adoption is still relatively
                low.
              </p>
              <p>
                In particular, user experience for key management is still poor, and requires adoption of an entirely new set of tools and interfaces.
                Torus allows users to use their social identities (eg. Google) to derive private keys in a trustless manner, making it easy for new
                users to seamlessly use existing blockchain applications.
              </p>
            </div>
          </div>
          <!-- .col  -->
        </div>
        <!-- .row  -->
      </div>
      <!-- .conatiner  -->
    </div>
    <!-- Start Section -->
    <!-- Start Section -->
    <div class="section section-pad section-bg" id="about">
      <div class="background-shape bs-reverse"></div>
      <div class="container">
        <div class="row text-center">
          <div class="col">
            <div class="section-head">
              <h2 class="section-title">
                Torus
                <span>About</span>
              </h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 res-m-bttm">
            <div class="features-box-s3">
              <div class="features-icon-s3">
                <img src="images/icon-a.png" alt="icon" />
              </div>
              <h5 class="features-title-s3">Trustless Key Distribution</h5>
              <span class="features-subtitle-s3">Safe & Secure</span>
              <p>
                Private keys are derived from their social identities using Torus' distributed key generation protocol. Each node generates a piece of
                your private key, which are combined and held by you locally.
              </p>
            </div>
          </div>
          <div class="col-md-4 res-m-bttm">
            <div class="features-box-s3">
              <div class="features-icon-s3">
                <img src="images/icon-b.png" alt="icon" />
              </div>
              <h5 class="features-title-s3">Seamless Integration</h5>
              <span class="features-subtitle-s3">Instant Application</span>
              <p>
                Developers only need to include our embedded web3 script into their website to start using Torus today, allowing dApps to reach a
                greater range of users.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="features-box-s3">
              <div class="features-icon-s3">
                <img src="images/icon-c.png" alt="icon" />
              </div>
              <h5 class="features-title-s3">A Credible Ecosystem</h5>
              <span class="features-subtitle-s3">Trusted Identities</span>
              <p>
                By integrating existing online social identities, Torus allows users to interact with applications in a more meaningul and trusted
                manner.
              </p>
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
          </div>
          <!-- .col  -->
        </div>
        <!-- .row  -->
      </div>
      <!-- .conatiner  -->
      <div class="container">
        <div class="row align-items-center justify-content-between">
          <div class="col-md-12">
            <div class="text-block">
              <pre class="code">
                    <span class="tr"><span class="th"></span><code>// Add the following script to the top of &lt;head&gt;</code></span>
                    <span class="tr"><span class="th"></span><code>&lt;script src="https://tor.us/embed.min.js" 
                      integrity="sha384-dGr6wqRePhPLjm2H13o1vw0FyuG17flwcAqtKu/rhueQVEu8yWxEclutPuLI219O" 
                      crossorigin="anonymous"&gt;&lt;/script&gt;</code></span>
                    <span class="tr"><span class="th"></span><code></code></span>
                    <span class="tr"><span class="th"></span><code>// Start using web3 in your dapp</code></span>
                    <span class="tr"><span class="th"></span><code>$ web3.eth.accounts[0]</code></span>
                    <span class="tr"><span class="th"></span><code>&gt; "0x05B53A73B...150C005e21"</code></span>
                    </pre>
            </div>
          </div>
          <!-- .col  -->
        </div>
        <!-- .row  -->
      </div>
      <!-- .conatiner  -->
    </div>
    <!-- Start Section -->
    <!-- Start Section -->
    <div class="section section-pad section-bg" id="contact">
      <div class="container">
        <div class="row text-center">
          <div class="col">
            <div class="section-head">
              <h2 class="section-title">
                Contact Us
                <span>Contact</span>
              </h2>
              <p>Still here? Reach out to us!</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <ul class="contact-info">
              <li>
                <em class="fab fa-linkedin" style="margin-bottom: 15px;"></em>
                <span>
                  <a href="https://www.linkedin.com/company/toruslabs/about/">toruslabs</a>
                </span>
              </li>
              <li>
                <em class="fa fa-envelope"></em>
                <span>
                  <a href="mailto:hello@tor.us">hello@tor.us</a>
                </span>
              </li>
              <li>
                <em class="fa fa-paper-plane"></em>
                <span>
                  <a href="https://t.me/torusprotocol">@torusprotocol</a>
                </span>
              </li>
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
            <span class="copyright-text">Copyright &copy; 2018, Torus Labs Private Limited.</span>
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
