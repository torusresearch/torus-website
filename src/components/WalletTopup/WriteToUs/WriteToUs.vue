<template>
  <div class="mt-4 py-4 px-1 text-gray caption">
    <div>
      {{ t('walletTopUp.otherMode') }}
      <a href="mailto:hello@tor.us?Subject=Add%20Payment%20Method" target="_blank" rel="noreferrer noopener" :style="{ textDecoration: 'none' }">
        {{ t('walletTopUp.writeToUs') }}
      </a>
    </div>
  </div>
</template>

<script>
export default {}
</script>
