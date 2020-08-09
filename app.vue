<template>
  <div class="wrapper" v-if="is_loaded">
    Hello!
  </div>
</template>

<script>

export default {
  components: {
  },
  async mounted() {
    console.log('load here')
    // await this.$store.dispatch('analytics/metocean_load')
    this.is_loaded = true
  },
  data() {
    return {
      is_loaded: false
    }
  },
  computed: {
    // metocean() {
    //   return this.$store.state.analytics.metocean
    // }
  }
};
</script>