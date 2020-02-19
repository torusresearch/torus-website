<template>
  <div class="text-gray">
    <img src="../../../../public/images/badges/submit-gray.svg" alt="Torus submit score card" />
    <v-btn class="scorecard-btn" :disabled="!enabled" depressed block>Submit Scorecard</v-btn>
    <v-flex text-center class="text">
      <div class="body-1 mt-3">Submit your scorecard to stand a chance to win 1 ETH !</div>
      <div class="caption mt-4">
        You may submit without the secret badge. Your chance increases with a secret badge. By submitting, you accept Torus’ Terms and Conditions
      </div>
    </v-flex>
  </div>
</template>

<script>
export default {
  props: ['enabled']
}
</script>

<style lang="scss" scoped>
@import 'BadgeSubmit.scss';
</style>
