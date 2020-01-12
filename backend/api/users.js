const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

  
    const save = (req, res) => {
        const user = { ...req.body }
        if (user.userType === 'Servidor' && user.course) delete user['course']

        if (user.registered_at) delete user['registered_at']

        if (user.deleted_at) delete user['deleted_at']

        /* Validações */

        try {
            if(req.method === "PUT")
            {   
                //email
                if(user.email) app.api.validation.existsOrError(user.email, "Insira um email válido.")
                app.api.validation.validateEmail(user.email, "Email inválido.")
                //curso
                if(user.userType) app.api.validation.validateUserType(user.userType, "Tipo de usuário invalido.")
                if(user.userType==="Aluno") app.api.validation.existsOrError(user.course, "Insira o curso válido.")
                //senha
                if(user.password || user.confirPassword){
                    
                    app.api.validation.existsOrError(user.password, "Insira uma senha válida.")
                    app.api.validation.existsOrError(user.confirmPassword, "Confirme a senha.")
                    app.api.validation.equalsOrError(user.password, user.confirmPassword, 'Senhas nao conferem.')
                } 

                //senha de 4 digitos
                if(user.hardwarePassword || user.confirmHardwarePassword){
                    app.api.validation.existsOrError(user.hardwarePassword, "Insira a senha de 4 digitos válida.")
                    app.api.validation.existsOrError(user.confirmHardwarePassword, "Confirme a senha de 4 digitos.")
                    app.api.validation.isValidHardwarePassword(user.hardwarePassword, 'Password inválido: deve ser de 4 dígitos e conter somente números.')
                    app.api.validation.equalsOrError(user.hardwarePassword, user.confirmHardwarePassword, 'Senhas de 4 digitos nao conferem.')
                }


            }
            else if (req.method === "POST") {
                app.api.validation.existsOrError(user.name, "Insira um nome.")
                app.api.validation.existsOrError(user.email, "Insira um email.")
                app.api.validation.existsOrError(user.userType, "Insira um tipo de usuário")
                app.api.validation.validateUserType(user.userType, "Tipo de usuário invalido")
                app.api.validation.validateEmail(user.email, "Email inválido.")
                app.api.validation.existsOrError(user.registrationNumber, `Insira o ${(user.userType==='Aluno')? "número de matricula":"número SIAPE"}.`)

                if (user.userType === 'Aluno')  app.api.validation.existsOrError(user.course, "Insira o curso")
                app.api.validation.existsOrError(user.cpf, "Insira o cpf.")
                app.api.validation.existsOrError(user.rg, "Insira o rg.")
                app.api.validation.existsOrError(user.password, "Insira a senha.")
                app.api.validation.existsOrError(user.confirmPassword, "Confirme a senha.")
                app.api.validation.equalsOrError(user.password, user.confirmPassword, 'Senhas nao conferem.')
                app.api.validation.existsOrError(user.hardwarePassword, "Insira a senha de 4 digitos.")
                app.api.validation.existsOrError(user.confirmHardwarePassword, "Confirme a senha de 4 digitos.")
                app.api.validation.isValidHardwarePassword(user.hardwarePassword, 'Password invalido: deve ser de 4 dígitos e conter somente números.')
                app.api.validation.equalsOrError(user.hardwarePassword, user.confirmHardwarePassword, 'Senhas de 4 digitos nao conferem.')

            }
        }
        catch (e) {
            return res.status(510).send(e)
        }
        /* ---------------- */



        if(user.password) user.password = encryptPassword(user.password) 
        if(user.hardwarePassword) user.hardwarePassword = encryptPassword(user.hardwarePassword) 
        delete user['confirmPassword']
        delete user['confirmHardwarePassword']
     
        
        if (req.method === "PUT") {
            app.db('users')
            .where({ id: user.id })
            .whereNull('deleted_at')
            .first()
            .update(user)
                .then(users => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send("Nao foi possível atualizar usuário."))
        }
        else if(req.method ==="POST") {

            if(user.id) delete user['id']

            user.operatorId = req.user.id
            user.registered_at = new Date()
            app.db('users').insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Nao foi possível cadastrar usuário."))
        }
        else res.status(404).send("Requisição inválida.")

    }

    const getUserById = (req, res) => {

        const registrationNumber = req.params.registrationNumber

        app.db('users')
            .where({ registrationNumber })
            .whereNull('deleted_at')
            .first()
            .then(users => {
                let user = {}
                user.name = users.name
                user.email = users.email
                user.cpf = users.cpf
                user.registrationNumber = users.registrationNumber
                user.course = users.course
                user.id = users.id
                user.userType = users.userType
                user.rg = users.rg
                return res.json(user)
            })
            .catch(err => res.status(500).send())

    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'cpf', 'rg', 'email', 'userType','course','registrationNumber')
            .whereNull('deleted_at')
            .then(users => res.json(users))
            .catch(() => res.status(502).send())
    }

    const remove = (req, res) => {
        const user= {...req.body}
        app.db('users')
        .where({id:user.id})
        .whereNull('deleted_at')
        .first()
        .update({deleted_at:new Date()})
            .then(()=>res.status(204).send())
            .catch((e)=>{
                res.status(501).send()}
                )
    }

    return { getUserById, save, get, remove }
}

