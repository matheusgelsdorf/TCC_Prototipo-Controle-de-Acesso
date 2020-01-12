<template>
  <div class="confirm-page">
    <b-container>
      <b-row>
        <b-col>
          <h1 class='page-title'>Confirmação de dados:</h1>
          <hr>
        </b-col>
      </b-row>
      <b-row>
        <b-col offset="3" cols="6" class="color-test shadow p-3 mb-5 bg-white rounded">
          <p>
            <b>Nome:</b>
            {{user.name}}
          </p>
          <p>
            <b>CPF:</b>
            {{user.cpf}}
          </p>
          <p>
            <b>RG:</b>
            {{user.rg}}
          </p>
          <p>
            <b>Numero de Matrícula:</b>
            {{user.registrationNumber}}
          </p>
          <p>
            <b>Email:</b>
            {{user.email}}
          </p>
          <p>
            <b>Classe:</b>
            {{user.userType}}
          </p>
          <p v-if="(user.userType ==='Aluno')">
            <b>Curso:</b>
            {{user.course}}
          </p>
          <p>
            <b>Tickets:</b>
            {{tickets.number}}
          </p>
          <hr>
          
          <p>
            <b>Valor Total:</b>
            {{tickets.totalValueFormatted}}
          </p>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col offset="5" cols="6">
          <b-button variant="primary" @click="sendConfirmation" >Confirmar</b-button>
          <b-button class="ml-2" @click="goToOperatorPage">Voltar</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

import axios from 'axios'
import { mapState } from "vuex"
import { baseApiUrl, showError,operatorUrl } from '@/global'

export default {
  name: "ConfirmPage",
  data: function() {
    return {
      tickets:{},
      user: {
      }
    };
  },
  computed: mapState(['transferUser','ticketsStored','showUserCourseState','showUserDataState'])
  ,
  methods: {
    loadConfirmation(){
      this.user=this.transferUser
      this.tickets=this.ticketsStored
    },
    reset(){
       const show = {userCourse:false ,userData:false}
      this.user={};
      this.$store.commit('setUser',{})
      this.$store.commit('setTickets',{})
      this.$store.commit('setShowVariables',show)
      this.tickets={}
     
    },
    sendConfirmation(){
      const url= `${baseApiUrl}/tickets`
      let data={}
      data.user= {...this.user}
      data.tickets= {...this.tickets}
      axios.post(url,data)
      .then(()=>{
          this.$toasted.global.defaultSuccess()
          this.reset()
          this.goToOperatorPage()
        })
      .catch(showError)

    },
    goToOperatorPage(){
      this.$router.push({ path: operatorUrl })
    }
  }
  ,
  mounted() {
        this.loadConfirmation()
    }
}


</script>

<style>
.color-test {
  background-color: snow;
  box-shadow: 12px;
}

.page-title {
  font-size: 1.8rem;
}
</style>
