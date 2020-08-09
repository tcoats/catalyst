<template>
  <div class="wrapper" v-if="is_loaded">
    <header>
      <a class="logo" href="/">Mind Catalyst</a>
    </header>
    <article>
      <h1>{{ title }}</h1>
      <div v-if="icon" class="icon">{{ icon }}</div>
      <div class="content" v-html="html" :style="{ 'border-left-color': color }"></div>
    </article>
    <nav>
        <div v-for="connection in connections" :key="connection.title">
            <h2>{{ connection.title }}</h2>
            <ul>
              <li
                v-for="link in connection.links"
                :key="link"
                :style="{
                  'border-left-color': documents[link]
                    ? documents[link].data.color
                    : null
                }">
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
</template>
<script>

import { slugify } from './lib/slug'

export default {
  components: {
  },
  async mounted() {
    await this.$store.dispatch('documents/load', this.$attrs.title)
    await Promise.all(Array.from(this.document.files.values(), async title =>
      this.$store.dispatch('documents/load', title)))
    this.is_loaded = true
  },
  data() {
    return {
      is_loaded: false
    }
  },
  methods: {
    slugify(title) {
      return slugify(title)
    }
  },
  computed: {
    title() {
      return this.$attrs.title
    },
    documents() {
      return this.$store.state.documents.documents
    },
    document() {
      return this.documents[this.title]
    },
    html() {
      return this.document.html
    },
    icon() {
      return this.document.data.icon
    },
    color() {
      return this.document.data.color
    },
    connections() {
      return Object.keys(this.document.data.connections).map(title =>
        ({ title, links: this.document.data.connections[title] }))
    }
  }
};
</script>