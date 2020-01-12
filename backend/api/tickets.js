const { authSecret } = require('../.env')

const jwt = require('jwt-simple')
const dateFormat = require('dateformat')
module.exports = app => {

    const registerTickets = async (req, res) => {
        let user = { ...req.body.user }
        let tickets = { ...req.body.tickets }
        let userFromDb

        tickets.number = parseInt(tickets.number, 10)


        userFromDb = await app.db('users')
            .select()
            .where({ registrationNumber: user.registrationNumber })
            .whereNull('deleted_at')
            .first()
            .catch(err => res.status(500).send('Número de matrícula inválido.'))
        user.id = userFromDb.id
        user.operatorId = req.user.id
        try {
            app.api.validation.isValidElement(user, userFromDb, 'Usuario informado inválido.')
            app.api.validation.isValidTotalTicketValue(user, tickets, 'Valor total informado inválido.')
        }
        catch (msg) {
            return res.status(500).send(msg)
        }


        tickets.elements = [...Array(tickets.number)].map(_ => {
            return {
                bought_at: new Date(),
                used_at: null,
                operatorId: req.user.id,
                userId: user.id
            }
        })



        app.db('tickets').insert(tickets.elements)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

    }

    const limit = 15

    const getTicketsByUserId = async (req, res, next) => {
        const page = req.query.page || 1


        token = { ...req.user }

        const resultTickets = await app.db('tickets').where({ userId: token.id, used_at: null }).count('id').first()
        const countTickets = parseInt(resultTickets.count)

        app.db('tickets')
            .where({ userId: token.id, used_at: null })
            .select('id', 'bought_at', 'used_at')
            .limit(limit).offset(page * limit - limit)
            .then(tickets => {
                tickets.forEach(ticket => {

                    ticket.bought_atFormated = dateFormat(ticket.bought_at, "dd/mm/yyyy - HH:MM:ss")

                });
                tickets.sort((a, b) => {
                    if (((a.bought_at / 1000) - (b.bought_at / 1000)) <= -1)
                        return -1
                    else if (((a.bought_at / 1000) - (b.bought_at / 1000)) >= 1)
                        return 1
                    else return a.id - b.id
                })
                return res.json({ tickets, countTickets, limit })
            })
            .catch(err => res.status(500).send())
    }

    return { registerTickets, getTicketsByUserId }
}