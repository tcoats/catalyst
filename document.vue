<template>
  <div class="wrapper" v-if="is_loaded">
    <header>
      <a class="logo" href="/">Mind Catalyst</a>
    </header>
    <article>
      <h1>{{ title }}</h1>
      <div v-if="icon" class="icon">{{ icon }}</div>
      <div class="content" v-html="html" :class="classify(title)"></div>
    </article>
    <nav>
        <div v-for="connection in connections" :key="connection.title">
            <h2>{{ connection.title }}</h2>
            <ul>
              <li
                v-for="link in connection.links"
                :key="link"
                :class="classify(link)">
                <a :href="slugify(link)">
                  <span v-if="documents[link] && documents[link].data.icon">
                    {{ documents[link].data.icon }}
                  </span>
                  {{ link }}
                </a>
              </li>
            </ul>
        </div>
    </nav>
  </div>
  <div class="wrapper" v-else-if="is_404">
    <header>
      <a class="logo" href="/">Mind Catalyst</a>
    </header>
    <article>
      <h1>404</h1>
      <div class="content">
        <h1>Not Found</h1>
        <p>There is no document with that name.</p>
      </div>
    </article>
  </div>
</template>
<script>

import { slugify, unslugify, classify } from './lib/slug'

export default {
  components: {
  },
  async mounted() {
    await this.$store.dispatch('documents/load', this.$attrs.title)
    if (this.document == null) {
      this.is_404 = true
      return
    }
    await Promise.all(Array.from(this.document.files.values(), async title =>
      this.$store.dispatch('documents/load', title)))
    document.addEventListener('click', this.clickIntercept)
    this.is_loaded = true
  },
  async beforeDestroy() {
    document.removeEventListener('click', this.clickIntercept)
  },
  data() {
    return {
      is_loaded: false,
      is_404: false
    }
  },
  methods: {
    slugify(title) { return slugify(title) },
    classify(title) { return classify(title) },
    clickIntercept(e) {
      const target = e.target || e.srcElement
      if (target.tagName !== 'A') return
      const href = target.getAttribute('href')
      if (href == '/') {
        e.preventDefault()
        if (this.$route.path == '/') return
        return this.$router.push('/')
      }
      if (this.documents[unslugify(href)]) {
        e.preventDefault()
        if (this.$route.path == `/${href}`) return
        this.$router.push(`/${href}`)
      }
    }
  },
  computed: {
    title() {
      return this.$attrs.title },
    documents() {
      return this.$store.state.documents.documents },
    document() {
      return this.documents[this.title] },
    html() {
      return this.document.html },
    icon() {
      return this.document.data.icon },
    color() {
      return this.document.data.color },
    connections() {
      return Object.keys(this.document.data.connections).map(title =>
        ({ title, links: this.document.data.connections[title] }))
    }
  }
};
</script>