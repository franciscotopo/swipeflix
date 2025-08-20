const namespaced = true;

//Guarda variables reactivas
const state = {
    id: null,
    name: null,
    email: null,
    partnerId: null,
    movieApiPage: 1
}

//Para modificar el estado "state". Recibe un payload y asigno campos al estado.
const mutations = {     
    SET_USER_DATA: (state, payload) => {
        state.id = payload.id;
        state.name = payload.name;
        state.email = payload.email;
        state.partnerId = payload.partnerId;
        state.movieApiPage = payload.movieApiPage
    },
    SET_PARTNER_ID: (state, payload) => {
        state.partnerId = payload;
    },
    SET_MOVIE_API_PAGE: (state, payload) => {
        state.movieApiPage = payload;
    },
    CLEAR_USER_DATA: (state) => {
        state.id = null;
        state.name = null;
        state.email = null;
    }
}

const actions = {
    setUserData(context, userData) {
        context.commit('SET_USER_DATA', userData);
    },
    setPartnerId(context, id) {
        context.commit("SET_PARTNER_ID", id);
    },
    setMovieApiPage(context, pageNumber) {
        context.commit("SET_MOVIE_API_PAGE", pageNumber)
    },
    logout(context) {
        context.commit('CLEAR_USER_DATA');
        localStorage.removeItem("my-app"); //Importante limpiar de la memoria del navegador, sino guarda el usuario.
    }
}

const getters = {}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
}