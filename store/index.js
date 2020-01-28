import Vue from 'vue'
import Vuex from 'vuex'
import CreateLogger from 'vuex/dist/logger'
import * as getters from './getters'
import mutations from './mutations'
import state from './state'
import * as actions from './actions'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = () => {
  return new Vuex.Store({
    actions,
    getters,
    mutations,
    state,
    strict: debug,
    plugins: debug ? [CreateLogger()] : []
  })
}

export default store
