import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import SellPage from '../components/operator/SellPage'
import ConfirmPage from '../components/operator/ConfirmPage'
import Auth from '@/components/auth/Auth'
import UserPage from '@/components/user/UserPage'
import AdminUser from '@/components/admin/AdminUser'
import AdminOperator from '@/components/admin/AdminOperator'
import AdminDevice from '@/components/admin/AdminDevice'
import {baseApiUrl,userKey } from "@/global"

Vue.use(VueRouter)

const routes = [
    {
        name:'sellPage',
        path:'/operador',
        component: SellPage,
        meta: { requiresOperator: true }
    },
    {
        name:'confirmPage',
        path:'/confirmacao-de-dados',
        component: ConfirmPage,
        meta: { requiresOperator: true }
    },
    {
        name:'auth',
        path:'/auth',
        component: Auth
    },
    {
        name:'user',
        path:'/usuario',
        component: UserPage,
        meta: {requiresUser:true}
    },
    {
        name:'adminUserRegistration',
        path:'/admin/usuario',
        component:AdminUser
    },
    {
        name:'adminOperatorRegistration',
        path:'/admin/operador',
        component:AdminOperator
    },
    {
        name:'adminDeviceRegistration',
        path:'/admin/device',
        component:AdminDevice
    }

]
const router = new VueRouter(
    {
        mode: 'history',
        routes
    }

)

router.beforeEach(async(to, from, next) => {
    const loginDataJson = localStorage.getItem(userKey) 
    const loginData = JSON.parse(loginDataJson)
    const isValidToken = await axios.post(`${baseApiUrl}/validateToken`, loginData)
    let path


    if(to.matched.some(record => record.meta.requiresUser)) {
  
        isValidToken && loginData && (loginData.loggedAs ==='user') ? next() : next({ path: '/' })
       
    }


    else if (to.matched.some(record => record.meta.requiresOperator)){
    
        isValidToken && loginData && (loginData.loggedAs ==='operator') && !loginData.admin ? next() : next({ path: '/' })
    } 


    else if (to.matched.some(record => record.meta.requiresAdmin)) {
    
        isValidToken && loginData && (loginData.loggedAs ==='operator') && loginData.admin ? next() : next({ path: '/' })
    }

    else if(to.path == '/') {
        if(isValidToken && loginData){
           
            path = (loginData.loggedAs ==='operator') ? '/operador' : '/usuario'
            if(loginData.loggedAs ==='operator' && loginData.admin)
                path='/admin'
            next({path:path})
        }
        else{
            next({path:'/auth'})
        }

    }
    else next()
})

export default router