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
    await this.$store.dispatch('documents/load', this.$attrs.title)
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