const info = require('../config/info')
const bcrypt = require('bcrypt-nodejs')
module.exports = app => {

    const AccessList = app.mongoose.model('access-log', {
        user_cpf: {
            type: String,
            maxlength: 11,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        ticket_id: {
            type: Number,
            required: true
        }
    })



    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        let device = { ...req.body }

        if (!device) return res.status(400).send()
        if (device.deleted_at) delete device['deleted_at']
        if (device.registered_at) delete device['registered_at']


        try {
           
            if (req.method === 'PUT') {
                if (device.password || device.confirmPassword) {
                    app.api.validation.existsOrError(device.password, 'Informe a senha.')
                    app.api.validation.existsOrError(device.confirmPassword, 'Informe a confirmação de senha')
                    app.api.validation.equalsOrError(device.password, device.confirmPassword, 'Senhas não conferem.')
                }
                if (device.location) {

                    app.api.validation.existsOrError(device.location, 'Informe a localização do dispositivo.')
                    app.api.validation.isValidLocation(device.location, info.locations, 'Localização do dispositivo inválida.')

                }

            }
            if (req.method === 'POST') {

                app.api.validation.existsOrError(device.location, 'Informe a localização do dispositivo.')
                app.api.validation.existsOrError(device.macAddress, 'Informe o MAC Address do dispositivo.')
                app.api.validation.existsOrError(device.password, 'Informe a senha.')
                app.api.validation.existsOrError(device.confirmPassword, 'Informe a confirmação de senha')
                app.api.validation.equalsOrError(device.password, device.confirmPassword, 'Senhas não conferem.')
                app.api.validation.isValidLocation(device.location, info.locations, 'Localização do dispositivo inválida.')
            }
        }
        catch (msg) {
            return res.status(400).send(msg)
        }

        delete device['confirmPassword']
        device.operatorId = req.user.id
        device.password = encryptPassword(device.password)

        if (req.method === 'PUT') {
            app.db('devices')
                .where({ id: device.id })
                .whereNull('deleted_at')
                .first()
                .update(device)
                .then(_ => res.status(204).send())
                .catch(_ => res.status(500).send())
        }

        if (req.method === 'POST') {
            if (device.id) delete device['id']
            device.registered_at = new Date()
            app.db('devices').insert(device)
                .then(_ => res.status(204).send())
                .catch(_ => res.status(500).send())

        }


    }



    const useTicket = async (req, res) => {
        const device = { ...req.user } 
        const user = { ...req.body } 
        console.log("1")





        try {

            if (!(user && user.cpf && user.hardwarePassword)) return res.status(400).send()

            const userFromDb = await app.db('users')
                .where({ cpf: user.cpf })
                .whereNull('deleted_at')
                .first()
                .catch(_ => res.status(500).send())

            if (!userFromDb) return res.status(400).send()
            console.log("3 \n" + userFromDb)


            const isMatch = await bcrypt.compareSync(user.hardwarePassword, userFromDb.hardwarePassword)
            console.log("2.1")

            if (!isMatch) return res.status(400).send()
            console.log("2.2")

            const log = await AccessList.findOne({ user_cpf: user.cpf })
            console.log("2.3")


            if (log) return res.status(430).send() 

            console.log("3")

            const ticket = await app.db('tickets')
                .where({ userId: userFromDb.id })
                .whereNull('used_at')
                .first()
                .catch(_ => res.status(404).send())

            if (!ticket) return res.status(404).send()

            await app.db('tickets')
                .where({ id: ticket.id })
                .whereNull('used_at')
                .first()
                .update({ used_at: new Date(), deviceId: device.id })
                .catch(_ => res.status(500).send())
            console.log("4")
            let ticketUsed = new AccessList({
                user_cpf: user.cpf,
                date: new Date(),
                ticket_id: ticket.id
            })
            await ticketUsed.save()
            console.log("5")

            let ticketsAvaliables = await app.db('tickets').where({ userId: userFromDb.id, used_at: null }).count('id').first()
            ticketsAvaliables = ticketsAvaliables.count
            
            console.log("6")
            console.log("Tickets: "+ticketsAvaliables)
            return res.status(200).json({ tickets: ticketsAvaliables })

        }
        catch (e) {
            console.log("Veio no catch")
            console.log(e)
            res.status(500).send(e)
        }
    }

    const getLocations = (req, res) => {
        return res.json(info.locations)
    }

    const get = (req, res) => {
        app.db('devices')
            .select('macAddress', 'location', 'id')
            .whereNull('deleted_at')
            .then(devices => res.json(devices))
            .catch(() => res.status(500).send())
    }


    const remove = (req, res) => {
        const device = { ...req.body }
        app.db('devices')
            .where({ id: device.id })
            .whereNull('deleted_at')
            .first()
            .update({ deleted_at: new Date() })
            .then(() => res.status(204).send())
            .catch((e) => {
                res.status(500).send()
            }
            )

    }


    return { save, useTicket, getLocations, get, remove }
}

