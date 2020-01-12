<template>
    <header class="header">
       
       <div class="title" >
        
        <img src="@/assets/dinner.png" width="30"/>
        
        
        <h1 class="mt-3">
            {{ title }}
        </h1>
     
        </div>
       
        
        <UserDropdown v-if="hideUserDropdown" />
    </header>
</template>

<script>

import UserDropdown from './UserDropdown'
export default {
    name: "Header",
    components: { UserDropdown },
    props: {
        title: String,
        hideUserDropdown: Boolean
    },
}
</script>

<style>
    .header{
        grid-area: header;
        background:rgb(1,67,143);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title{
        display:flex;
        color:#fff;
        flex-wrap:wrap;
        flex-grow:1;
        text-align: left;
        margin-left: 25px;
    }

    .title h1{
           font-size: 1.5rem;
           font-weight:100;
    }

    .title img{
        margin: 17px 10px 15px 10px
    }
</style>
