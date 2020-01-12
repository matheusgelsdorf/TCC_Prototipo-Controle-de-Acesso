<template>
  <div class="sell-page">
    <b-form @submit.stop.prevent> 
      <b-row>
        <b-col></b-col>
        <b-col cols="8">
          <b-form-group 
            label-align="center"
            label="Numero de Matricula"
            label-for="user-registration-number"
          >
            <b-form-input 
              @keyup.native.enter="loadUser" 
              type="number"
              v-model= user.registrationNumber
              id="user-registration-number"
              class="text-center input-number-no-arrow"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row>
        <b-col cols="2"/>
        <b-col>
          <b-button class="ml-0" variant="primary" @click="loadUser">Carregar</b-button>
          <b-button class="ml-2" @click="resetForm" >Limpar</b-button>
        </b-col>
      </b-row>
      <hr>
    </b-form>
    <div v-if="showUserData">
      <b-form>
        <b-row>
          <b-col cols="2"/>
          <b-col>
            <b-form-group label="Nome" label-for="user-name">
              <b-form-input
                readonly
                v-model = user.name
                type="text"
                id="user-name"
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group label="CPF" label-for="user-cpf">
              <b-form-input
                readonly
                v-model = user.cpf
                type="number"
                id="user-cpf"
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col cols="2"/>
        </b-row>

        <b-row>
          <b-col cols="2"/>
          <b-col>
            <b-form-group label="RG" label-for="user-rg">
              <b-form-input
                readonly
                v-model = user.rg
                type="number"
                id="user-rg"
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group label="E-mail" label-for="user-email">
              <b-form-input
                readonly
                type="text"
                v-model = user.email
                id="user-email"
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col cols="2"/>
        </b-row>

        <b-row>
          <b-col cols="2"/>

          <b-col>
            <b-form-group label="Classe" label-for="user-class">
              <b-form-input readonly type="text" 
              id="user-class" 
              v-model = user.userType
              class="text-center" >
            </b-form-input>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group v-if="showUserCourse" label="Curso" label-for="user-course">
              <b-form-input
                readonly
                v-model = user.course
                type="text"
                id="user-course"
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col cols="2"/>
        </b-row>
      </b-form>

      <hr>
      <b-form>
        <b-row>
          <b-col cols="2"/>

          <b-col cols="4">
            <b-form-group label="Tickets" label-for="user-tickets" label-cols="2">
              <b-form-input
                @keyup.native.enter ="goToConfirmPage"
                @input.native="calculateTotalValue"
                v-model= tickets.number  
                min='0'
                type="number"
                id="user-tickets"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="2"/>

          <b-col cols="4">
              <b-form-group label="Valor Total" label-for="user-value" label-cols="2" >
              <b-form-input
                v-model= tickets.totalValueFormatted
                readonly   
                type="text"
                id="user-value" 
            
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
             <b-col cols="2"/>
            <b-col cols="4"> 
                <b-button class="ml-0" variant="primary" @click="goToConfirmPage">Ok</b-button>
            
             </b-col>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from "vuex"
import { baseApiUrl, showError } from '@/global'

export default {
  name: "SellPage",
  computed: mapState(['transferUser','ticketsStored','showUserCourseState','showUserDataState']),
  data: function() {
    return {
      tickets: {
        number:0,
        totalValue:0,
        totalValueFormatted:''
      } ,
      showUserData:false,
      showUserCourse:false,
      user: {
      }
    }
  },

  methods: {
  
    calculateTotalValue(){
      let ticketValue

      if(this.user.userType==="Aluno"){
        ticketValue=2;
      }
      else if(this.user.userType==="Servidor"){
        ticketValue=6.2;
      }
      else
        ticketValue=0;
      
      this.tickets.totalValue=this.tickets.number * ticketValue
      if(this.tickets.number<0 || this.tickets.totalValue < 0 ){
        this.tickets.totalValue = 0
        this.tickets.number=0
        this.value = Math.abs(this.value)
      }
      this.tickets.totalValueFormatted = this.tickets.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      this.$store.commit('setTickets',this.tickets)


    },
    loadUser(){
      const url = `${baseApiUrl}/users/${this.user.registrationNumber}`
      
      
      axios.get(url)
      .then(res =>{
        
        this.showUserData=true
        this.user = res.data
        this.showUserCourse= (this.user.userType==='Servidor') ? false : true
        this.$store.commit('setUser',this.user)

        const show = {userCourse:this.showUserCourse ,userData:this.showUserData}
        this.$store.commit('setShowVariables',show)
        this.tickets={}
        this.$store.commit('setTickets',{})
        this.$toasted.global.defaultSuccess()
       })
       .catch(()=>showError('Usuario nao encontrado.'))
       
       
     
    },

    resetForm(){
       const show = {userCourse:false ,userData:false}
      this.user={};
      this.$store.commit('setUser',{})
      this.$store.commit('setTickets',{})
      this.$store.commit('setShowVariables',show)
      this.tickets={}
      this.showUserData= false;
      this.showUserCourse=false;
    },
    goToConfirmPage(){
      if(this.ticketsStored.number && this.ticketsStored.number > 0){
        this.$router.push({ path: '/confirmacao-de-dados' })
      }
      else{
        showError('Numero de Tickets nao informado ou nulo.')
      }
    }
  },
  mounted(){
    this.user=this.transferUser
    this.showUserData=this.showUserDataState
    this.showUserCourse= this.showUserCourseState
    this.tickets=this.ticketsStored
  }
};
</script>

<style>

.input-number-no-arrow::-webkit-inner-spin-button,
.input-number-no-arrow::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
