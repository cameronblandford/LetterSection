<template>
  <section class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="display-4 text-center m-4">MovieSolver</h1>
        <p class="lead text-center">Use letterboxd to find a movie you all want to see!</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <form @submit.prevent="search()">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="First username"
            v-model="firstUsername"
          >
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Second username"
            v-model="secondUsername"
          >
          <input
            type="submit"
            class="btn btn-outline-secondary form-control form-control-lg"
            value="Get results"
          >
        </form>
      </div>
      <div class="col-md-9">
        <h1 v-if="results.length > 0">Results</h1>
        <div class="container">
          <ul>
            <li v-for="r in results" :key="r">{{r.name}} ({{r.releaseYear}})</li>
          </ul>
          <div v-if="loading">
            <h1 class="display-4 text-center m-4">loading...</h1>
            <p class="lead text-center">(this can take up to 30 seconds)</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import axios from 'axios'
export default {
  components: {
    Logo
  },
  data() {
    return {
      firstUsername: '',
      secondUsername: '',
      results: [],
      loading: false
    }
  },
  computed: {
    usernames() {
      return [this.firstUsername, this.secondUsername].filter(x => x).join(',')
    }
  },
  methods: {
    async search() {
      this.loading = true
      let results = await axios.get(`/api/check?q=${this.usernames}`)
      this.loading = false
      this.results = results.data
    }
  }
}
</script>

<style>
input {
  margin-top: 10px;
}
</style>
