<template>
  <div class="device-admin">
    <b-form>
      <b-row>
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-group label="Endereço MAC:" label-for="device-macAddress" >
            <b-form-input id="device-macAddress" type="text" v-model="device.macAddress" required maxlength="12" :readonly="modify? true:false"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col offset-xl="2" xl="4" lg="6">
          <b-form-group label="Senha" label-for="device-password">
            <b-form-input
              id="device-password"
              type="password"
              v-model="device.password"
              required
            />
          </b-form-group>
        </b-col>
        <b-col xl="4" lg="6">
          <b-form-group label="Confirmação de senha" label-for="device-confirmPassword">
            <b-form-input
              id="device-confirmPassword"
              type="password"
              v-model="device.confirmPassword"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-select v-model="device.location" :options="locations"></b-form-select>
           
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
    <div class="devices-table">
      <b-table
        hover
        striped
        :items="devices"
        :fields="fields"
        selectable
        selected-variant="active"
        select-mode="single"
        @row-selected="loadDevice"
      ></b-table>
    </div>

    <b-modal id="modal-confirmation" hide-footer>
      <div class="d-block text-center">
        <h4>Você deseja {{modifyText}} este dispositivo?</h4>
      </div>
      <b-container class>
        <b-row>
          <b-col offset="4" cols="6">
            <b-button variant="danger" class="mr-2" size="lg" @click="modifyDevice">Sim!</b-button>

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
  name: "AdmindeviceRegister",
  components: {},
  data: function() {
    return {
      device: {location:null},
      locations:[],
      devices: [],
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "macAddress", 
         label: "Endereço MAC", 
         sortable: true,
         formatter: (value)=> [].map.call(value,(valueElement,index,array)=>{
          if(index % 2 === 1) return `${valueElement}${((array.length-1)===index)?'':':'}`
          return `${valueElement}`
          }).join('')
         },
        { key: "location", label: "Localização", sortable: true },
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
      const url = `${baseApiUrl}/device`;
 
      axios.post(url, this.device)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
          this.loadDevices()
        })
        .catch(showError);
    },
   reset() {
      this.device = {};
      this.devices = [];
      this.modify = null;
    },
    loadDevices() {
      const url = `${baseApiUrl}/device`;
  
      axios.get(url).then(res => {
      
        return (this.devices = res.data);
      });
    },
    loadDevice(device) {
      this.device = { ...device[0] };
      this.modify = "update";
    },
     updateLocations(){
        const url = `${baseApiUrl}/device/getLocations`
        axios.get(url).then(res=>{
            const locationsArray = res.data
            this.locations = locationsArray.map((location)=>{
                return {value:location,text:location}
                })

            this.locations.unshift({value:null, text:"Escolha a localização do dispositivo."})
            this.device.location=null;
            
        })
    },
    clean(){
      this.device={}
      this.modify=null
    },
    async modifyDevice() {
      // delete
      const url = `${baseApiUrl}/device`;
      let data;
      if (this.modify === "remove") {
        data = {
          id: this.device.id,
          macAddress: this.device.macAddress,
        };

        await axios
          .delete(url, { data }) 
          .then(() => {
            this.reset();
            this.loadDevices();
            this.$toasted.global.defaultSuccess();
          })
          .catch(showError);
      } else if (this.modify === "update") {
        //update
        data = {
          id: this.device.id,
          password: this.device.password,
          confirmPassword: this.device.confirmPassword,
          location: this.device.location
        };
        axios
          .put(url, data)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.reset();
            this.loadDevices();
          })
          .catch(showError);
      }
      this.$bvModal.hide("modal-confirmation");
    }
  },
  mounted() {
    this.reset();
    this.loadDevices()
    this.updateLocations()
  }
};
</script>
<style>
.devices-table {
  background-color: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  margin: 20px;
}
</style>