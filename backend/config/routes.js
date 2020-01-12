const accessLevel = require('./auth-access-level')


module.exports = app => {

   app.route('/signin')
      .post(app.api.auth.signin)
   app.route('/validateToken')
      .post(app.api.auth.validateToken)
   app.route('/signinDevice')
      .post(app.api.auth.signinDevice)

   // --------------------------------------------------------------------- //   



   app.route('/users')//#
      .all(app.config.passport.authenticate())            
      .post(accessLevel(app.api.users.save).admin())           //C
      .get(accessLevel(app.api.users.get).admin())              //R
      .put(accessLevel(app.api.users.save).admin())            //U
      .delete(accessLevel(app.api.users.remove).admin())    //D

   app.route('/users/tickets')
         .all(app.config.passport.authenticate())
         .get(accessLevel(app.api.tickets.getTicketsByUserId).user())

   app.route('/users/:registrationNumber') // Used by Operator//#
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.users.getUserById).operator())

   



   app.route('/tickets')  // Used by Operator       // #
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.tickets.registerTickets).operator())

    

   app.route('/operators') //#
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.operators.save).admin())       // C
      .get(accessLevel(app.api.operators.get).admin())         // R
      .put(accessLevel(app.api.operators.save).admin())        // U  
      .delete(accessLevel(app.api.operators.remove).admin())   // D

    

   app.route('/device/useTicket')
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.devices.useTicket).device())

   app.route('/device') //*
      .all(app.config.passport.authenticate())
      .post(accessLevel(app.api.devices.save).admin())           //C
      .get(accessLevel(app.api.devices.get).admin())              //R
      .put(accessLevel(app.api.devices.save).admin())            //U
      .delete(accessLevel(app.api.devices.remove).admin())       //D

   app.route('/device/getLocations')
      .all(app.config.passport.authenticate())
      .get(accessLevel(app.api.devices.getLocations).admin())

   //---------------------------------------------------------------------

}
