<template id="bottomSheet-template">
  <div class="bottomsheet">
    <div class="glass" :class="{ open: show }" @click="close"></div>
    <div class="bottomsheet-body" :class="{ open: show }">
      <div class="bottomsheet-header text-xs-center">
        <v-btn fab flat color="white" @click="close">
          <v-icon color="grey">expand_more</v-icon>
        </v-btn>
      </div>
      <div class="bottomsheet-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'bottomSheet',
  props: ['show', 'onClose'],
  methods: {
    close() {
      this.onClose()
    }
  },
  ready: function() {
    document.addEventListener('keydown', e => {
      if (this.show && e.keyCode === 27) {
        this.onClose()
      }
    })
  }
}
</script>

<style lang="scss">
.bottomsheet {
  .glass {
    z-index: 99;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: hsla(0, 0%, 0%, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    &.open {
      pointer-events: initial;
      opacity: 1;
    }
  }

  .bottomsheet-body {
    position: fixed;
    bottom: 75px;
    left: 0;
    right: 0;
    opacity: 0;
    background: #fff;
    transform: translateY(100%);
    z-index: 100;
    transition: opacity 0.3s ease, transform 0.3s ease;

    display: flex;
    flex-direction: column;
    height: 60%;
    overflow: inherit;
    padding: 0 0 1rem 1rem;

    &.open {
      opacity: 1;
      transform: translateY(0);
    }

    .bottomsheet-header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      flex: 0 0 1rem;
      padding: 0 2rem 0.5rem 1rem;
    }

    .bottomsheet-content {
      flex: 1;
      overflow: auto;
      padding-right: 1rem;
    }
  }
}
</style>
