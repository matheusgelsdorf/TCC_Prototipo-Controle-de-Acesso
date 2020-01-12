<template>
  <div id="app" :class ="{'show-menu':loginData && (loginData.loggedAs === 'operator') && loginData.admin}">
    
    <Header title="RU UFPEL" :hideUserDropdown="loginData.loggedAs ? true : false"/>
    <AdminMenu />
    <Content v-if='!validatingToken'/>
  </div>
</template>

<script>
import Header from "./components/template/Header";
import Content from "./components/template/Content";
import AdminMenu from "./components/admin/AdminMenu"
import axios from "axios";
import { mapState } from "vuex";
import { baseApiUrl, userKey, showError } from "@/global";


export default {
  name: "App",
  components: { Header, Content, AdminMenu },
  computed: mapState(["loginData","isMenuVisible"]),
  data: function() {
    return {
      validatingToken: true
    };
  },
  methods: {
    async validateToken() {
     

      const json = localStorage.getItem(userKey);
      const genUserData = JSON.parse(json);

      this.$store.commit("setLoginData", {});


      if (!genUserData) {
        this.validatingToken = false;
        this.$router.push({ name: "auth" });
        return;
      }
       
      const res = await axios.post(`${baseApiUrl}/validateToken`, genUserData);

      if (res.data) {
        this.$store.commit("setLoginData", { ...genUserData });


        if (genUserData.loggedAs === "operator" && genUserData.admin) {
          this.$router.push({ path: "/admin" });
        } else if (genUserData.loggedAs === "operator" && !genUserData.admin) {
          this.$router.push({ path: "/operador" });
        } else if (genUserData.loggedAs === "user") {
          this.$router.push({ path: "/usuario" });
        } else {
          showError("Erro interno . Tipo de validação de usuario inválida.");
        }
      } else {
        localStorage.removeItem(userKey);
        this.$router.push({ name: "auth" });
      }

      this.validatingToken = false;
    }
  },
  created() {
    this.validateToken();
  }
};
</script>

<style>
* {
  font-family: "Lato", sans-serif;
}
body {
  margin: 0;
}

#app {
  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header "
    "content";
}

#app.show-menu {
  grid-template-rows: 60px 1fr;
  grid-template-columns:200px 1fr;
		grid-template-areas:
			"header header"
			"menu content";
			
	}
</style>