<template>
  <v-container>

    <h1 class="text-center my-4"> </h1>

    <v-card class="mx-auto" style="max-width: 500px">
      <v-overlay :value="isLoading">
        <v-progress-circular color="primary" indeterminate size="64">
        </v-progress-circular>
      </v-overlay>
      <v-form ref="form" v-model="form" class="pa-4 mt-6">
        <v-text-field
          v-model="email"
          :rules="[rules.required]"
          filled
          label="Email"
          type="email"
        >
        </v-text-field>

        <v-text-field
          v-model="password"
          :rules="[rules.required]"
          filled
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          style="min-height: 96px"
        >
        </v-text-field>

        <v-alert v-if="errorMessage" border="top" color="red" class="nl-5 mr-5">
          {{ errorMessage }};
        </v-alert>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text @click="$refs.form.reset()">Clear</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!form"
            color="primary"
            :loading="isLoading"
            depressed
            @click="signInWithUserAndPass"
            >Sign In</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../main.js";
import { doc, getDoc } from "firebase/firestore";

export default {
  data: () => ({
    email: "",
    password: "",
    errorMessage: "",
    form: false,
    isLoading: false,
    showPassword: false,
    rules: {
      required: (v) => !!v || "Este campo debe ser completado",
    },
  }),
  methods: {
    async signInWithUserAndPass() {
      this.isLoading = true;
      try {
        const auth = getAuth();
        const authRes = await signInWithEmailAndPassword(auth, this.email, this.password);

        const userDoc = await getDoc(doc(db, "users", authRes.user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.$store.dispatch("user/setUserData", {
            id: authRes.user.uid,
            name: userData.name,
            email: userData.email,
          });
        }

        this.$router.push({ name: "home" });

      } catch (error) {
        if (error.code === "auth/invalid-credential") {
          this.errorMessage = "Usuario o contraseña incorrecta";
        } else {
          this.errorMessage = error.message || "Ha ocurrido un error inesperado!"
        }
      }
      this.isLoading = false;
    },
  },
};
</script>
