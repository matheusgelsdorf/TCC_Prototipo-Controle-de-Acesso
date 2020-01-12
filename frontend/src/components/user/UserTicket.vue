<template>
    <div class="ticket-item">
            <div class="ticket-item-info">
                <div class = 'ticket-item-id'>
                    <img src="@/assets/ticket.png" width=60>
                    <span id='ticket-number'>
                       <b>Número: {{ticket.id}}</b> 
                    </span>
                    
                </div>
                
                <p class='mt-4 '><b>Comprado em:</b> {{ticket.bought_atFormated}}</p>
            </div>
    </div>
</template>

<script>
export default {
    name: 'UserTicket',
    props: ['ticket']
}
</script>

<style>
    .ticket-item {
        border-radius: 8px;
        margin-bottom: 20px;
        background-color: #FFF;
        padding: 20px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    }

    .ticket-item{
        display:flex;
        flex-direction: column;

    }

    .ticket-item-id span{
        padding:0px 0 0 25% ;
    } 
    

</style>
