const { authSecret } = require('../.env')

const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        if (new Date(payload.exp * 1000) < new Date()) {
            return done('Token Expirado.', false)
        }
        
        if (payload.loggedAs === 'operator') {
            app.db('operators')
                .where({ id: payload.id })
                .whereNull("deleted_at")
                .first()
                .then(operator => {
                    if (
                        operator &&
                        payload.email === operator.email &&
                        payload.cpf === operator.cpf &&
                        payload.name === operator.name &&
                        payload.admin === operator.admin
                    ) {

                        return done(null, { ...payload })
                    }
                    else {
                        throw ('Login Inválido. --O')
                    }

                })
                .catch(err => done(err, false))
        }

        else if (payload.loggedAs === 'user') {

            app.db('users')
                .where({ id: payload.id })
                .whereNull("deleted_at")
                .first()
                .then(user => {
                    if (
                        user &&
                        payload.email === user.email &&
                        payload.cpf === user.cpf &&
                        payload.name === user.name
                    ) {
                        return done(null, { ...payload })
                    }
                    else {
                        throw ('Login Inválido. --U')
                    }

                })
                .catch(err => done(err, false))
        }
        else if (payload.loggedAs === 'device') {
            app.db('devices')
                .where({ id: payload.id })
                .first()
                .whereNull("deleted_at")
                .then(device => {
                    if (device && (payload.macAddress === device.macAddress) && (payload.id === device.id)) {
                        return done(null, { ...payload })
                    }
                    else {
                        throw ('Login Inválido. --D')
                    }
                })
        }
        else done('Erro Interno.', false)
    })




    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}