const bcrypt = require('bcrypt-nodejs')
module.exports = app => {

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = (req, res) => {
        const operator = { ...req.body }

        if (operator.registered_at) 
            delete operator['registered_at']

        if (operator.deleted_at)
            delete operator['deleted_at']

        /* Validações */

        try {
            if (req.method === "PUT") {
                if (operator.name) delete operator['name']
                if (operator.cpf) delete operator['cpf']
                if (operator.rg) delete operator['rg']
                if (operator.email) app.api.validation.existsOrError(operator.email, "Insira um email.")
                if (operator.password || operator.confirmPassword) {
                    app.api.validation.existsOrError(operator.password, "Insira uma senha.")
                    app.api.validation.existsOrError(operator.confirmPassword, "Confirme sua senha.")
                }

                app.api.validation.validateEmail(operator.email, "Email invalido.")
                app.api.validation.equalsOrError(operator.password, operator.confirmPassword, 'Senhas nao conferem.')
            }
            else if (req.method === "POST") {
              
                app.api.validation.existsOrError(operator.name, "Insira um nome.")
                app.api.validation.existsOrError(operator.email, "Insira um email.")
                app.api.validation.existsOrError(operator.cpf, "Insira o cpf.")
                app.api.validation.existsOrError(operator.rg, "Insira o rg.")
                app.api.validation.existsOrError(operator.password, "Insira a senha.")
                app.api.validation.existsOrError(operator.confirmPassword, "Confirme a senha.")
                app.api.validation.equalsOrError(operator.password, operator.confirmPassword, 'Senhas nao conferem.')
                app.api.validation.validateEmail(operator.email, "Email invalido.")
                operator.registered_at = new Date()
            }


        }
        catch (e) {
            return res.status(500).send(e)
        }




        if (operator.password) operator.password = encryptPassword(operator.password)

        if (operator.confirmPassword) delete operator['confirmPassword']


       


        

        if (req.method === "POST") {
            if (operator.id) delete operator['id']
            app.db('operators').insert(operator)
                .then(_ => res.status(204).send())
                .catch(err => {
                
                    return res.status(500).send()
                })
        }
        else if (req.method === "PUT") {

            app.db('operators')
                .where({ id: operator.id })
                .whereNull('deleted_at')
                .first()
                .update(operator)
                .then(_ => res.status(204).send())
                .catch(err => {
                
                    return res.status(500).send()
                })
        }


    }
    const remove = (req, res) => {
        const operator = { ...req.body }
        app.db('operators')
            .where({ id: operator.id })
            .whereNull('deleted_at')
            .first()
            .update({ deleted_at: new Date() })
            .then(() => res.status(204).send())
            .catch((e) => {
            
                res.status(501).send()
            }
            )

    }

    const get = (req, res) => {
        
        app.db('operators')
            .select('id', 'name', 'cpf', 'rg', 'email', 'admin')
            .whereNull('deleted_at')
            .then(operators => res.json(operators))
            .catch(() => res.status(502).send())
    }
    return { save, get, remove }
}
