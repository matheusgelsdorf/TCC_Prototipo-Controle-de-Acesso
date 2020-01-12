<template>
  <div class="operator-admin">
    <b-form>
      <input id="operator-id" type="hidden" v-model="operator.id">
      <b-row>
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-group label="Nome:" label-for="operator-name">
            <b-form-input
              id="operator-name"
              type="text"
              v-model="operator.name"
              required
              :readonly="modify? true:false"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-group label="E-mail" label-for="operator-email">
            <b-form-input id="operator-email" type="email" v-model="operator.email" required/>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2" xl="4" lg="6">
          <b-form-group label="CPF" label-for="operator-cpf">
            <b-form-input
              id="operator-cpf"
              type="number"
              v-model="operator.cpf"
              required
              :readonly="modify? true:false"
            />
          </b-form-group>
        </b-col>

        <b-col xl="4" lg="6">
          <b-form-group label="RG" label-for="operator-rg">
            <b-form-input
              id="operator-rg"
              type="number"
              v-model="operator.rg"
              required
              :readonly="modify? true:false"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col offset-xl="2" xl="4" lg="6">
          <b-form-group label="Senha" label-for="operator-password">
            <b-form-input
              id="operator-password"
              type="password"
              v-model="operator.password"
              required
            />
          </b-form-group>
        </b-col>
        <b-col xl="4" lg="6">
          <b-form-group label="Confirmação de senha" label-for="operator-confirmPassword">
            <b-form-input
              id="operator-confirmPassword"
              type="password"
              v-model="operator.confirmPassword"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col offset-xl="2" xl="8" lg="12">
          <b-form-checkbox v-model="operator.admin" name="admin-checkbox1" switch>Admin</b-form-checkbox>
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
    <div class="operators-table">
      <b-table
        hover
        striped
        :items="operators"
        :fields="fields"
        selectable
        selected-variant="active"
        select-mode="single"
        @row-selected="loadOperator"
      ></b-table>
    </div>

    <b-modal id="modal-confirmation" hide-footer>
      <div class="d-block text-center">
        <h4>Você deseja {{modifyText}} este operador?</h4>
      </div>
      <b-container class>
        <b-row>
          <b-col offset="4" cols="6">
            <b-button variant="danger" class="mr-2" size="lg" @click="modifyOperator">Sim!</b-button>

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
  name: "AdminOperatorRegister",
  components: {},
  data: function() {
    return {
      operator: { admin: false },
      operators: [],
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "email", label: "E-mail", sortable: true },
        { key: "cpf", label: "CPF", sortable: true },
        { key: "rg", label: "RG", sortable: true },
        {
          key: "admin",
          label: "Administrador",
          sortable: true,
          formatter: value => (value ? "Sim" : "Não")
        }
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
      const url = `${baseApiUrl}/operators`;
      axios
        .post(url, this.operator)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
          this.loadOperators();
        })
        .catch(showError);
    },
    reset() {
      this.operator = { admin: false };
      this.operators = [];
      this.modify = null;
    },
    clean() {
      this.operator = { admin: false };
      this.modify = null;
    },
    loadOperators() {
      const url = `${baseApiUrl}/operators`;
      axios.get(url).then(res => {
        return (this.operators = res.data);
      });
    },
    loadOperator(operator) {
      this.operator = { ...operator[0] };
      this.modify = "update";
    },
    async modifyOperator() {
      // delete
      const url = `${baseApiUrl}/operators`;
      let data;
      if (this.modify === "remove") {
        data = {
          id: this.operator.id,
          cpf: this.operator.cpf,
          rg: this.operator.rg
        };

        await axios
          .delete(url, { data }) 
          .then(() => {
            this.reset();
            this.loadOperators();
            this.$toasted.global.defaultSuccess();
          })
          .catch(showError);
      } else if (this.modify === "update") {
        //update
        data = {
          id: this.operator.id,
          email: this.operator.email,
          password: this.operator.password,
          confirmPassword: this.operator.confirmPassword,
          admin: this.operator.admin
        };
        axios
          .put(url, data)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.reset();
            this.loadOperators();
          })
          .catch(showError);
      }
      this.$bvModal.hide("modal-confirmation");
    }
  },
  mounted() {
    this.loadOperators();
    this.reset();
  }
};
</script>
<style>
.operators-table {
  background-color: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  margin: 20px;
}
</style>