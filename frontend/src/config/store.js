import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        transferUser: {},
        ticketsStored: {},
        loginData: {},
        isMenuVisible: false,
        hideUserDropDownState: true,
        showUserDataState: false,
        showUserCourseState: false
    },
    mutations: {
        setUser(state, user) {
            state.transferUser = { ...user };
        },
        setTickets(state, tickets) {
            state.ticketsStored = { ...tickets }
        },
        setShowVariables(state, show) {
            state.showUserDataState = show.userData
            state.showUserCourseState = show.userCourse
        },
        setLoginData(state, data) {
            state.loginData = data
       

            if (data && (data.token)) {

                axios.defaults.headers.common['Authorization'] = `bearer ${state.loginData.token}`
            }
            else {
          
                delete axios.defaults.headers.common['Authorization']
            }
        },
        logout(state) {
            state.transferUser = {}
            state.ticketsStored = {}
            state.loginData = {}
            state.isMenuVisible = false
            state.hideUserDropDownState = true
            state.showUserDataState = false
            state.showUserCourseState = false
        }
    }
})