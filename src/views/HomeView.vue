<template>
  <div class="text-center">
    <h1>Bienvenido a la página de inicio</h1>
    <p>Aquí puedes agregar el contenido principal de la Home.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  data: () => ({
    isLoading: false,
    movies: [],
    currentMovie: {},
    currentIndex: 0,
  }),
  methods: {
    async fetchMovie(page) {
      
      const apiKey = process.env.VUE_APP_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/discover/movie?movie?api_key=${apiKey}&include_adult=true&include_video=true&page=${page}&sort_by=popularity.desc&vote_average.gte=3`

      const res = await axios.get(url);

      if (res.data && res.data.results.length > 0) {
        this.movies = res.data.results;
      }
    },
  },
  computed: {
    movieResultsLength() {
      return this.movies.length
    },
    userMovieApiPage() {
      return this.$store.state.movieApiPage;
    },
    authUserId() {
      return this.$store.state.user.id;
    },
    partnerId(){
      return this.$store.state.user.partnerId;
    },
    movieImage(){
      return this.currentMovie.poster_path ? `https://image.tmdb.org/t/p/w500/${this.currentMovie.poster_path}` : "" ;
    }
  }
};
</script>
