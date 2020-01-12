const schedule = require('node-schedule')



module.exports = app => {
    const getCronTime=(time)=>{
        const currentDate= new Date()
        let offset= -3+(currentDate.getTimezoneOffset()/60)
        



        timeDate = new Date(currentDate.getTime());

        
        timeDate.setMinutes(time.split(":")[1]);
        timeDate.setSeconds(time.split(":")[2]);
        timeDate.setHours(time.split(":")[0]);
        timeDate.setHours(timeDate.getHours()-offset)

        console.log('Returning timeDate : ' + timeDate);
        
        return `${timeDate.getSeconds()} ${timeDate.getMinutes()} ${timeDate.getHours()} * * * `    
    }
    const dropTicketsUsedTable = ()=>{

        app.mongoose.connection.db.dropCollection('access-logs')
    }

    schedule.scheduleJob(`${getCronTime("14:00:00")}`, async function () { // -> padrao de tempo CRON
        console.log('Droping Access logs of 14h00')
        dropTicketsUsedTable()
    })

    schedule.scheduleJob(`${getCronTime("11:30:00")}`, async function () { 
        console.log('Droping Access logs of 11h30')
        dropTicketsUsedTable()
    })
    
    schedule.scheduleJob(`${getCronTime("17:30:00")}`, async function () { 
        console.log('Droping Access logs of 17h30')
        dropTicketsUsedTable()
    })
    
    
    schedule.scheduleJob(`${getCronTime("20:00:00")}`, async function () {
        console.log('Droping Access logs of 20h00')
   
        dropTicketsUsedTable()
    })

}