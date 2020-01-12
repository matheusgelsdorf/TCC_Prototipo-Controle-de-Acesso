<template>

  <div class="auth-content">
    <div class="auth-modal">
          <div class="image-position">
            <img src="@/assets/marca-ufpel.png" width="150" alt="Logo">
          </div>
          <hr>
          
          <input type="number"
           v-model="genUser.cpf" placeholder="Insira seu CPF." 
           @keyup.enter="signin">

          <input  type="password" 
          v-model="genUser.password" 
          placeholder="Insira sua senha." 
          @keyup.enter="signin">

          <div class='radio-set'>
          <b-form-radio-group  @keyup.native.enter="signin">
          <b-form-radio  v-model="loggedAs" name="loging-type" value="user">Usuário</b-form-radio>
          <b-form-radio  v-model="loggedAs" name="loging-type" value="operator">Operador</b-form-radio>
          </b-form-radio-group>
          
          </div>
          <div class="buttons-set">
            <button @click="signin" id="send-button">Entrar</button>
            <button @click="reset" id="reset-button">Limpar</button>
          </div>      
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "Auth",
  data: function() {
    return {
      genUser: {},
      loggedAs:"user"
    };
  },
  methods: {
    signin() {
      let data ={ ...this.genUser};
      if (this.loggedAs === "user"){
        data.tableId='users'
        
      }
      else if (this.loggedAs === "operator"){
        data.tableId='operators'
        
      }

      else 
      {
      this.reset()
      showError();
      return;
      }
      
      
    axios.post(`${baseApiUrl}/signin`, data)
        .then(res => {
          
          this.$store.commit("setLoginData", {...res.data})
          localStorage.setItem(userKey, JSON.stringify(res.data))
          if(res.data.loggedAs === 'operator' && !res.data.admin)
            this.$router.push({ path: "/operador" })
          else if(res.data.loggedAs === 'operator' && res.data.admin)
            this.$router.push({ path: "/admin" })
          else if (res.data.loggedAs === 'user')
            this.$router.push({ path: "/usuario" })
        })
        .catch(showError);

      
    },
    reset() {
      this.loggedAs='user'
      this.genUser = {};
      this.$store.commit("setLoginData", {});
      localStorage.setItem(userKey, null);
    }
  },
};
</script>

<style>
.auth-content {
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.auth-modal {
  background-color: #fff;
  width: 350px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 35px 35px;
}

.auth-modal input {
  border: 1px solid #bbb;
  width: 100%;
  margin-bottom: 15px;
  padding: 3px 8px;
  outline: none;
}
.auth-modal input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.buttons-set {
  flex-direction: row;
  align-self: flex-start;
}
#send-button {
  background-color: #2460ae;
  color: #fff;
  padding: 5px 15px;
  margin-right: 10px;
}

#reset-button {
  background-color: gray;
  color: #fff;
  padding: 5px 15px;
}

.auth-modal hr {
  margin-top: 20px;
  margin-bottom: 25px;
  border: 0;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(120, 120, 120, 0),
    rgba(120, 120, 120, 0.75),
    rgba(120, 120, 120, 0)
  );
}

.radio-set {
  flex-direction: row;
  align-self: flex-start;
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left:2px;
}
</style>




