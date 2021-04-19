<template>
  <v-carousel
    :cycle="!$vuetify.breakpoint.xsOnly"
    height="650"
    :interval="showSpringFestival && currentCarousel === 0 ? 10000 : 7000"
    :show-arrows="false"
    :hide-delimiters="$vuetify.breakpoint.xsOnly"
    @change="onChange"
  >
    <v-carousel-item v-for="slide in slides" :key="slide.title" reverse-transition="fade-transition" transition="fade-transition">
      <v-layout align-center fill-height px-10>
        <v-flex class="text-center">
          <img class="mb-6 slide-image" :src="require(`../../../assets/images/${slide.image}`)" alt="Login Carousel" />
          <div class="text-h6 text-sm-h5 font-weight-medium mb-3 text_2--text px-2">{{ t(slide.title) }}</div>
          <div class="text-caption text-sm-body-1 text_2--text">{{ t(slide.subtitle1) }}</div>
          <div v-if="slide.subtitle2" class="text-caption text-sm-body-1 text_2--text">{{ t(slide.subtitle2) }}</div>
          <v-btn
            class="learn-more-btn mt-6"
            :class="{ isDark: $vuetify.theme.dark, isMobile: $vuetify.breakpoint.xsOnly }"
            href="https://tor.us"
            target="_blank"
            rel="noreferrer noopener"
          >
            {{ t('login.visitOurWebsite') }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  props: {
    showSpringFestival: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    slides() {
      const slides = [
        {
          image: `login-bg-${this.$vuetify.theme.dark ? 'dark-' : ''}1.svg`,
          title: 'login.slide1Title',
          subtitle1: 'login.slide1Subtitle1',
          subtitle2: 'login.slide1Subtitle2',
        },
        {
          image: `login-bg-${this.$vuetify.theme.dark ? 'dark-' : ''}2.svg`,
          title: 'login.slide2Title',
          subtitle1: 'login.slide2Subtitle1',
          subtitle2: 'login.slide2Subtitle2',
        },
        {
          image: `login-bg-${this.$vuetify.theme.dark ? 'dark-' : ''}3.svg`,
          title: 'login.slide3Title',
          subtitle1: 'login.slide3Subtitle1',
          subtitle2: 'login.slide3Subtitle2',
        },
      ]
      if (this.showSpringFestival)
        slides.unshift({
          image: `login-bg-${this.$vuetify.theme.dark ? 'dark-' : ''}binance-1.svg`,
          title: 'login.slideBinance1Title',
          subtitle1: 'login.slideBinance1Subtitle1',
        })

      return slides
    },
  },
  methods: {
    onChange(current) {
      this.$emit('change', current)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginSlide.scss';
</style>
