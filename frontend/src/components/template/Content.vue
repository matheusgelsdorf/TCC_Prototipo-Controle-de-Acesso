<template>
    <div class="content">
     <router-view></router-view>
    </div>
</template>

<script>

import SellPage from "../operator/SellPage"
import ConfirmPage from "../operator/ConfirmPage"
export default {
     name: "Content",
     components: {SellPage, ConfirmPage}
}
</script>

<style>
    .content{
        grid-area:content;
        background-color: #efefef;
        padding:20px;
    }
</style>
