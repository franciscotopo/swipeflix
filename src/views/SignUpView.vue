<template>
  <v-container>
    <v-card class="mx-auto" style="max-width: 500px">
      <v-overlay :value="isLoading">
        <v-progress-circular color="primary" indeterminate size="64">
        </v-progress-circular>
      </v-overlay>
      <v-form ref="form" v-model="form" class="pa-4 mt-6">
        
        <v-text-field
          v-model="name"
          :rules="[rules.required]"
          filled
          label="Name"
        >
        </v-text-field>

        <v-text-field
          v-model="email"
          :rules="[rules.email]"
          filled
          label="Email"
          type="email"
        >
        </v-text-field>

        <v-text-field
          v-model="password"
          :rules="[rules.password, rules.length(6)]"
          filled
          counter="6"
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
            @click="sigUpWithUserAndPass"
            >Sign Up</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../main.js";
import { doc, setDoc } from "firebase/firestore";

export default {
  data: () => ({
    name: "",
    email: "",
    password: "",
    errorMessage: "",
    form: false,
    isLoading: false,
    showPassword: false,
    rules: {
      email: (v) => !!(v || "").match(/@/) || "Ingrese un mail correcto",
      length: (len) => (v) =>
        (v || "").length >= len || `Largo inválido, se necesitan ${len}`,
      password: (v) =>
        !!(v || "").match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
        ) ||
        "La contraseña debe contener una mayúsucula, una minúscula, un dígito y un caracter especial",
      required: (v) => !!v || "Este campo debe ser completado",
    },
  }),
  methods: {
    async sigUpWithUserAndPass() {
      this.isLoading = true;
      try {
        const auth = getAuth();
        const authRes = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        // Guardar en Firestore
        await setDoc(doc(db, "users", authRes.user.uid), {
          name: this.name,
          email: this.email,
        });

        //Guardar en Vuex
        this.$store.dispatch("user/setUserData", {
          id: authRes.user.uid,
          name: this.name,
          email: this.email,
        });

        this.$router.replace({
          name: "home",
        });
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          this.errorMessage =
            "Este correo ya está registrado. Prueba iniciando sesión";
        } else {
          this.errorMessage =
            error.message || "Ha ocurrido un error inesperado!";
        }
      }
      this.isLoading = false;
    },
  },
};
</script>
