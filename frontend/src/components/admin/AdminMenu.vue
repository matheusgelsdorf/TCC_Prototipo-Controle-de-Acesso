<template>
    <aside class="menu" v-show="loginData && (loginData.loggedAs === 'operator') && loginData.admin">  
        <hr class='hr-menu'> 
          <router-link to="/admin/usuario" class= 'admin-menu-link'> 
          <span>Usuário</span>
          </router-link>  
        
        <hr class='hr-menu'>
          <router-link to="/admin/operador" class= 'admin-menu-link'>
          <span>Operador</span>
          </router-link> 
        <hr class='hr-menu'>
          <router-link to="/admin/device" class= 'admin-menu-link'>
          <span>Dispositivo</span>
          </router-link> 
        <hr class='hr-menu'>

    </aside>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Menu",
  components: {},
  computed: mapState(["loginData"])
};
</script>

<style>
.menu {
  grid-area: menu;
  margin-right: 5px;
  background: rgba(32, 32, 32, 0.87);
  box-shadow: 4px 0px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.admin-menu-link {
  width: 100%;
  align-items: center;
  padding: 10px 5px;
  text-align: center;
  color: #fff;
}

.router-link-exact-active{
  color: #fff;
  background:rgba(35, 35, 35, 0.85);
  text-decoration: none;
}
.admin-menu-link:hover {
  color: #fff;
  background:rgb(1, 67, 143, 2);
  text-decoration: none;
}
.hr-menu {
  border: 0;
  margin: 0px;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.25),
    rgba(255, 255, 255, 0.75),
    rgba(255, 255, 255, 0.25)
  );
}
</style>
