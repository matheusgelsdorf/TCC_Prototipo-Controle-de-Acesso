<template>
  <div class="user-admin">
    <b-form>
      <input id="user-id" type="hidden" v-model="user.id">

      <b-row>
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-group label="Nome:" label-for="user-name">
            <b-form-input id="user-name" type="text" v-model="user.name" required :readonly="modify? true:false"/>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-group label="E-mail" label-for="user-email">
            <b-form-input id="user-email" type="email" v-model="user.email" required/>
          </b-form-group>
        </b-col>
      </b-row>
      
      <b-row>
        <b-col offset-xl="2" xl="4" lg="6">
          <b-form-group label="Numero de Matricula" label-for="user-registrationNumber" >
            <b-form-input
              id="user-registrationNumber"
              type="number"
              v-model="user.registrationNumber"
              required
              :readonly="modify? true:false"
            />
          </b-form-group>
        </b-col>

        <b-col xl="4" lg="6">
          <b-form-group label="Curso" label-for="user-course" >
            <b-form-input
              id="user-course"
              type="text"
              :readonly="user.userType === 'Servidor' || modify? true:false"
              v-model="user.course"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2" xl="4" lg="6">
          <b-form-group label="CPF" label-for="user-cpf">
            <b-form-input id="user-cpf" type="number" v-model="user.cpf" required :readonly="modify? true:false"/>
          </b-form-group>
        </b-col>

        <b-col xl="4" lg="6">
          <b-form-group label="RG" label-for="user-rg">
            <b-form-input id="user-rg" type="number" v-model="user.rg" required :readonly="modify? true:false"/>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2" xl="4" lg="6">
          <b-form-group label="Senha" label-for="user-password">
            <b-form-input id="user-password" type="password" v-model="user.password" required/>
          </b-form-group>
        </b-col>
        <b-col xl="4" lg="6">
          <b-form-group label="Confirmação de senha" label-for="user-confirmPassword">
            <b-form-input
              id="user-confirmPassword"
              type="password"
              v-model="user.confirmPassword"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2" xl="4" lg="6">
          <b-form-group label="Senha de 4 dígitos." label-for="user-hardwarePassword">
            <b-form-input
              id="user-hardwarePassword"
              type="password"
              pattern="[0-9]"
              inputmode="numeric"
              maxlength="4"
              v-model="user.hardwarePassword"
              required
            />
          </b-form-group>
        </b-col>
        <b-col xl="4" lg="6">
          <b-form-group
            label="Confirmação de senha de 4 dígitos"
            label-for="user-confirmHardwarePassword"
          >
            <b-form-input
              id="user-confirmHardwarePassword"
              maxlength="4"
              type="password"
              pattern="[0-9]"
              inputmode="numeric"
              v-model="user.confirmHardwarePassword"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-radio-group size="md" :disabled="modify? true:false" >
            <b-form-radio
              v-model="user.userType"
              name="loging-type"
              value="Aluno"
              @input="resetCourse"
            >Aluno</b-form-radio>
            <b-form-radio v-model="user.userType" name="loging-type" value="Servidor" >Servidor</b-form-radio>
          </b-form-radio-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2">
          <b-button v-if="(!modify)" variant="primary" @click="save">Registrar</b-button>

          <b-button
            v-if="(modify)"
            v-b-modal.modal-confirmation
            variant="warning"
            class="ml-2"
            @click="modify='update'"
          >Editar</b-button>

          <b-button
            v-if="(modify)"
            v-b-modal.modal-confirmation
            variant="danger"
            class="ml-2"
            @click="modify='remove'"
          >Excluir</b-button>
          <b-button class="ml-2" @click="clean">{{modify? "Voltar":"Limpar"}}</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr>

    <div class="users-table">
      <b-table
        hover
        striped
        :items="users"
        :fields="fields"
        selectable  
        selected-variant="active"
        select-mode="single"
        @row-selected="loadUser"
      ></b-table>
    </div>

    <b-modal id="modal-confirmation" hide-footer>
      <div class="d-block text-center">
        <h4>Você deseja {{modifyText}} este usuário?</h4>
      </div>
      <b-container class>
        <b-row>
          <b-col offset="4" cols="6">
            <b-button variant="danger" class="mr-2" size="lg" @click="modifyUser">Sim!</b-button>

            <b-button size="lg" @click="$bvModal.hide('modal-confirmation')">Não</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>

import { baseApiUrl, showError } from "@/global";
import axios from "axios";

export default {
  name: "AdminUserRegister",
  components: {},
 data: function() {
    return {
      user: { admin: false },
      users: [],
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "email", label: "E-mail", sortable: true },
        { key: "cpf", label: "CPF", sortable: true },
        { key: "rg", label: "RG", sortable: true },
        { key: "registrationNumber", label: "Registro", sortable: true },
        {
          key: "userType",
          label: "Tipo",
          sortable: true
        },
        { key: "course", 
        label: "Curso", 
        sortable: true,
        formatter: (value,key,item) => (item.userType === "Aluno")? value : "--"}
      ],
      modify: null
    };
  },
  computed: {
    modifyText: function() {
      if (this.modify === "update") return "atualizar";
      if (this.modify === "remove") return "EXCLUIR";
      if (this.modify) return "&&&&&&&&&&";
    }
  },
  methods: {
     save() {
      const url = `${baseApiUrl}/users`;
      axios.post(url, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadUsers()
          this.clean();
        })
        .catch(showError);
    },
    reset() {
      this.user = {}
      this.users=[]
      this.modify=null
    },
    clean(){
      this.user = {}
      this.modify=null
    },
   loadUsers() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
    
        return (this.users = res.data);
      });
    },
    loadUser(user) {
      this.user = { ...user[0] };
      this.modify = "update";
    }
    ,
    resetCourse() {
      if (this.user.userType === "Servidor") {
        this.user.course = "";
      }
    },
    async modifyUser(){
         // delete
      const url = `${baseApiUrl}/users`;
      let data;
      if (this.modify === "remove") {
        data = {
          id: this.user.id,
          cpf: this.user.cpf,
          rg: this.user.rg
        };

        await axios
          .delete(url, { data }) 
          .then(() => {
            this.reset();
            this.loadUsers();
            this.$toasted.global.defaultSuccess();
          })
          .catch(showError);
      } else if (this.modify === "update") {
        //update
        data = {
          id: this.user.id,
          email: this.user.email,
          password: this.user.password,
          confirmPassword: this.user.confirmPassword,
          hardwarePassword: this.user.hardwarePassword,
          confirmHardwarePassword: this.user.confirmHardwarePassword
        };
        axios
          .put(url, data)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.reset();
            this.loadUsers();
          })
          .catch(showError);
      }
      this.$bvModal.hide("modal-confirmation");
    },
    remove(){

    }
  },
  mounted() {
    this.reset();
    this.loadUsers();
  }
};
</script>
<style>
.users-table {
  background-color: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  margin: 20px;
}
</style>