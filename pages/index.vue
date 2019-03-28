<template>
  <section class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="display-4 text-center m-4">LetterSection</h1>
        <p class="lead text-center">
          Use
          <a href="http://letterboxd.com">letterboxd</a> to find a movie that everyone's excited about.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-md-6 mb-4">
        <form @submit.prevent="search()">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Username"
            v-model="firstUsername"
          >
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Username"
            v-model="secondUsername"
          >
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Username"
            v-model="thirdUsername"
          >
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Username"
            v-model="fourthUsername"
          >
          <button
            v-if="loading"
            disabled
            class="btn btn-outline-secondary form-control form-control-lg"
          >
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button>
          <p v-if="loading" class="text-muted text-center">
            <small>This can take up to 10s per user</small>
          </p>
          <input
            v-else
            type="submit"
            class="btn btn-outline-secondary form-control form-control-lg"
            value="Get results"
          >
        </form>
      </div>
      <div class="col-md-6 col-lg-8" v-if="results.length > 0">
        <h1 class="ml-3">Results</h1>
        <hr style="max-width: 400px;">
        <div class="container results">
          <!-- <div class="row">
            <div class="col-xl-12 row-eq-height my-3" v-for="r in results" :key="r.id">
              <div class="card">
                <div class="card-body">
                  <h3 class="card-title">
                    <a :href="r.links[0].url" target="_blank">{{r.name}}</a>
                  </h3>
                </div>
              </div>
            </div>
          </div>-->
          <div v-for="r in results" :key="r.id">
            <p class="lead">
              <a :href="r.links[0].url" target="_blank">{{r.name}}</a>
            </p>
          </div>
          <div v-if="loading"></div>
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
      thirdUsername: '',
      fourthUsername: '',
      results: [],
      loading: false
    }
  },
  computed: {
    usernames() {
      return [
        this.firstUsername,
        this.secondUsername,
        this.thirdUsername,
        this.fourthUsername
      ]
        .filter(x => x)
        .join(',')
    }
  },
  methods: {
    async search() {
      this.loading = true
      this.results = []
      let results = await axios.get(`/api/check?q=${this.usernames}`)
      console.log(results.data)
      this.loading = false
      this.results = results.data
    }
  }
}
</script>

<style>
input,
button {
  margin-top: 10px;
}
.results a {
  color: inherit;
  display: inline-block;
  width: 100%;
}

li {
  list-style-type: none;
}
.results > p.lead {
  width: 100%;
}
</style>
