<template>
  <div class="text-center">
    <h1>Bienvenido a la página de inicio</h1>
    <p>¡Elige entre más de 300.000 películas de todo tipo!.</p>

  <MovieCard
    :isLoading = "isLoading"
    :movieImage = "movieImage"
    :movie = "currentMovie"
    @thumbs-Up = "thumbsUp"
    @thumbs-Down = "thumbsDown"
  />
  </div>
</template>

<script>
import MovieCard from "../components/MovieCard.vue"

import axios from "axios";
import { db } from "../main";
import { collection, doc, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

export default {

  name: "HomeView",
  
  components: { MovieCard },

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

    async fetchMovie(page=1) {

      const myApiKey = process.env.VUE_APP_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&api_key=${myApiKey}&vote_average.gte=7.7`;
      
                   

      const res = await axios.get(url);                 //Obtengo resultado 

      if (res.data && res.data.results.length > 0) {
        this.movies = res.data.results;
        this.currentMovie = this.movies[0];
      }

    },

    async incrementCurrentIndex() {
      
      console.log("entro");
      console.log(this.movieResultsLength-1);
      if (this.currentIndex === this.movieResultsLength - 1) {
        
        console.log("Paso pagina" + this.userMovieApiPage);
        const newPage = this.userMovieApiPage + 1;
        console.log(newPage);
        const userRef = doc(db, "users", this.authUserId);
        await updateDoc(userRef, { movieApiPage: newPage });

        this.$store.dispatch("user/setMovieApiPage", newPage);
        this.fetchMovie(newPage);
        this.currentIndex = 0;
      
      } else {
        this.currentIndex++;
        console.log("indice:" + this.currentIndex)
        this.currentMovie = this.movies[this.currentIndex];
      }
    },

    async thumbsUp() {
      
      let userRef = doc(db, "users", this.authUserId);
      
      await addDoc(collection(userRef, "likedMovies"), { ...this.currentMovie });
      
      if (this.partnerId) {
        
        let partnerRef = doc(db, "users", this.partnerId);

        const partnerLikedQuery = query(collection(partnerRef, "likedMovies"), where("id", "==", this.currentMovie.id));
        const partnerLikedSnapshot = await getDocs(partnerLikedQuery);

        if (!partnerLikedSnapshot.empty) {
          await addDoc(collection(userRef, "matches"), { ...this.currentMovie });
          await addDoc(collection(partnerRef, "matches"), { ...this.currentMovie });
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
      return this.$store.state.user.movieApiPage;
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
