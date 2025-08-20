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
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=true&page=${page}&sort_by=popularity.desc&vote_average.gte=3`
      );

      if (res.data && res.data.results.length > 0) {
        this.movies = res.data.results;
      }
    },
  },
};
</script>
