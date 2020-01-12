<template>
  <div class="user-content">
    <div class="user-infos shadow bg-white rounded">
      <span>
       <h4><b>Tickets Disponíveis:</b>{{avaliableTickets}}</h4>
      </span>
    </div>
    <button class="mb-3 btn btn-md btn-outline-primary" @click="toggleTicketDetail">Ver detalhes</button>
    <b-container class="user-tickets" v-show="ticketDetail">
      <b-row>
        <b-col xl="4" md="6" sm="12" v-for="ticket in tickets" :key="ticket.id">
          <UserTicket :ticket="ticket"/>
        </b-col>
      </b-row>
      <b-row >
          <b-col></b-col>
        <b-col sm="8" class="text-center">
          <button @click="getTickets" v-show="loadMore" class="btn btn-lg btn-outline-primary">Carregar mais</button>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import { baseApiUrl, showError} from "@/global";
import UserTicket from "./UserTicket";

export default {
  name: "UserPage",
  components: { UserTicket },
  computed: mapState(["loginData"]),
  data: function() {
    return {
      tickets: [],
      avaliableTickets: 0,
      page: 1,
      loadMore: true,
      ticketDetail: false
    };
  },
  methods: {
    toggleTicketDetail() {
      this.ticketDetail = !this.ticketDetail;
    },
    async getTickets() {
      const url = `${baseApiUrl}/users/tickets?page=${this.page}`;

      await axios.get(url).then(res => {

        this.tickets = this.tickets.concat(res.data.tickets)

        this.tickets.sort((a, b) => {
          const date = {
            b: new Date(b.bought_at) / 1000,
            a: new Date(a.bought_at) / 1000
          }
          if (date.a - date.b <= -1) return -1;
          else if (date.a - date.b >= 1) return 1;
          else return a.id - b.id;
        })

        this.avaliableTickets = res.data.countTickets;

        this.page++;
        if (res.data.tickets.length === 0) this.loadMore = false;
      })
        .catch(showError)
    }
  },
  mounted() {
    this.tickets = [];
    this.page = 1;
    this.loadMore = true;
    this.getTickets();
  }
};
</script>

<style>
.user-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: right;
  margin: 100 100 100 100;
}

.user-infos {
  display: inline-block;
  justify-content: center;
  align-items:center;
  background-color: #fff;
  background-color: snow;
  margin: 20px;
  padding: 10px 20px;
}
</style>
