<template>
  <div>
    <v-overlay :value="isLoading">
      <v-progress-circular color="primary" indeterminate size="64">
      </v-progress-circular>
    </v-overlay>

    <v-container>
      <v-card>
        <v-container>
          <h2 class="text-center my-4">Cine para dos</h2>
          <p class="text-center my-4">
            Encontrá tu pareja de película con su email
          </p>

          <v-row justify="center" align="center">
            <v-col cols="12" md="6">
              <v-form ref="form" v-model="form" class="d-flex justify-center">
                <v-text-field
                  v-model="email"
                  :rules="[rules.email]"
                  filled
                  label="Email"
                  type="email"
                ></v-text-field>

                <v-btn
                  @click="searchUserByEmail"
                  :disabled="!form"
                  large
                  color="primary"
                  class="ml-2"
                >
                  Buscar
                </v-btn>
              </v-form>
            </v-col>
          </v-row>

          <v-row v-if="foundUser">
            <v-col class="d-inline-flex">
              <v-card>
                <v-card-text>
                  <div>
                    {{ foundUser.email }}
                  </div>
                  <p class="display-1 text-primary">
                    {{ foundUser.name }}
                  </p>
                  <div class="text-primary">
                    ¡Para invitar a este usuario a ver una película, clickea
                    abajo!
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    @click="addUserAsPartner(foundUser.id)"
                  >
                    Invitar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="message">
            <v-col>
              <h3>
                {{ message }}
              </h3>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-snackbar
        v-model="showToast"
        :timeout="3000"
        absolute
        bottom
        right
        :color="toastColor"
      >{{ toastMessage }}</v-snackbar>
    </v-container>
  </div>
</template>

<script>
import { db } from "../main.js";
import { collection, query, where, doc, updateDoc, getDocs } from "firebase/firestore";

export default {
  data: () => ({
    form: false,
    isLoading: false,
    showToast: false,
    toastColor: "",
    toastMessage: "",
    email: "",
    foundUser: null,
    message: "",
    rules: {
      email: (v) => !!(v || "").match(/@/) || "Ingrese un mail correcto.",
    },
  }),
  methods: {
    async searchUserByEmail() {
      this.isLoading = true;
      this.message = "";
      this.foundUser = null;

      const q = query(
        collection(db, "users"),
        where("email", "==", this.email.toLowerCase())
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userId = snapshot.docs[0].id;
        const userData = snapshot.docs[0].data();

        this.foundUser = {
          id: userId,
          ...userData,
        };
      } else {
        this.message = "No se encontró usuario con ese email.";
      }
      this.isLoading = false;
    },
    async addUserAsPartner(id) {
        try {
            const authUserId = this.$store.state.user.id;
            
            await updateDoc(doc(db, "users", authUserId), {
                partnerId: id        
            });
            
            this.$store.dispatch('user/setPartnerId', id);

            console.log("bien")
            this.toastColor = 'success';
            this.toastMessage = '¡Se agregó el usuario correctamente!';
            this.showToast = true;
        } catch (error) {
            console.log("Error al invitar:");
            this.toastColor = 'red';
            this.toastMessage = 'Error invitando al usuario. Intenta de nuevo.';
            this.showToast = true;
        }
    },
  },
};
</script>
