<template>
  <v-app>
    <!-- Barra de navegación -->
    <v-app-bar
      color="black"
      dark
      elevate-on-scroll
      height="90"
    >
      <!-- Logo -->
      <v-img
        src="@/assets/logopeliculas.png"
        contain
        max-width="100"
        class="mr-3 ml-7"
      />

      <v-spacer></v-spacer>

      <!-- Links de navegación -->
      <v-btn variant="text" to="/">Inicio</v-btn>
      <v-btn variant="text" to="/about">Acerca</v-btn>
      <v-btn variant="text" href="https://vuetifyjs.com" target="_blank">Docs</v-btn>
    </v-app-bar>

    <!-- Contenido de las vistas -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
