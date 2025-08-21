<template>
  <div class="text-center">
    <h1>Bienvenido a la página de inicio</h1>
    <p>Aquí puedes agregar el contenido principal de la Home.</p>

    <v-card :loading="isLoading" class="mx-auto my-12" max-width="600">
      <template v-slot:progress>
        <v-progress-linear
          color="primary"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-row>
        <v-col md="6"><v-img :src="movieImage"></v-img></v-col>
        <v-col md="6" class="mt-5">
          <v-card-title> {{ currentMovie.title }} </v-card-title>
          <v-card-text>
            <v-row align="center" class="mx-0">
              <div>{{ currentMovie.overview }}</div>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row class="d-flex justify=space-around">
              <v-btn color="green" @click="thumbsUp">
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn>
              <v-btn color="red" @click="thumbsDown">
                <v-icon>mdi-thumb-down</v-icon>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../main";

export default {
  name: "HomeView",
  data: () => ({
    isLoading: false,
    movies: [],
    currentMovie: {},
    currentIndex: 0,
  }),
  created() {
    this.fetchMovie(this.userMovieApiPage);
  },
  methods: {
    async fetchMovie(page = 1) {
      const apiKey = process.env.VUE_APP_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&vote_average.gte=3&api_key=${apiKey}`;

      const res = await axios.get(url);

      if (res.data && res.data.results.length > 0) {
        this.movies = res.data.results;
        this.currentMovie = this.movies[0];
      }
    },
    async incrementCurrentIndex() {
      if (this.currentIndex === this.movieResultsLength - 1) {
        const newPage = this.userMovieApiPage + 1;
        await db
          .collection("users")
          .doc(this.authUserId)
          .update({ movieApiPage: newPage });

        this.$store.dispatch("user/setMovieApiPage", newPage);
        this.fetchMovie(newPage);
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
        this.currentMovie = this.movies[this.currentIndex];
      }
    },
    async thumbsUp() {
      let userRef = db.collection("users").doc(this.authUserId);
      let partnerRef = db.collection("users").doc(this.partnerId);

      await userRef.collection("likedMovies").add({ ...this.currentMovie });

      if (this.partnerId) {
        const partnerLikedSnapshot = await partnerRef
          .collection("likedMovies")
          .where("id", "==", this.currentMovie.id)
          .get();

        if (!partnerLikedSnapshot.empty) {
          await userRef.collection("matches").add({ ...this.currentMovie });
          await partnerRef.collection("matches").add({ ...this.currentMovie });
        }
      }
      this.incrementCurrentIndex();
    },
    async thumbsDown() {
      await this.incrementCurrentIndex();
    },
  },
  computed: {
    movieResultsLength() {
      return this.movies.length;
    },
    userMovieApiPage() {
      return this.$store.state.movieApiPage;
    },
    authUserId() {
      return this.$store.state.user.id;
    },
    partnerId() {
      return this.$store.state.user.partnerId;
    },
    movieImage() {
      return this.currentMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500/${this.currentMovie.poster_path}`
        : "";
    },
  },
};
</script>
