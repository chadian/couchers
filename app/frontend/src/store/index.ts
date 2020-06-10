import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export enum AuthenticationState {
  Authenticated = 0,
  None = 1
}

export default new Vuex.Store({
  state: {
    error: null,
    auth: AuthenticationState.None,
    authToken: null as null | string
  },
  mutations: {
    auth (state, {authState, authToken}) {
      state.auth = authState
      state.authToken = authToken
    },
    deauth (state) {
      state.auth = AuthenticationState.None
      state.authToken = null
    },
    error (state, errorMessage) {
      console.error(errorMessage)
      state.error = errorMessage
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    authenticated: state => state.auth == AuthenticationState.Authenticated
  }
})