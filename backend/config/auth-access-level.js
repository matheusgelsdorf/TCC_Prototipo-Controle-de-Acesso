module.exports = (middleware) =>{

    const admin = function(){ return (req, res, next) => {
        if (req.user.loggedAs === 'operator' && req.user.admin) {
            middleware(req, res, next)
        }
        else {
            res.status(401).send('Usuário nao tem permissäo.')
        }
    }
}


    const operator = function(){
        return (req, res, next) =>  {
        if (req.user.loggedAs === 'operator') {
            middleware(req, res, next)
        }
        else {
            res.status(401).send('Usuário nao tem permissäo.')
        }
    }}


    const user =  function(){
        return (req, res, next) => {
        if (req.user.loggedAs === 'user') {
            middleware(req, res, next)
        }
        else {
            res.status(401).send('Usuário nao tem permissäo.')
        }
    }}

    const device =  function(){
        return (req, res, next) => {
        if (req.user.loggedAs === 'device') {
            middleware(req, res, next)
        }
        else {
            res.status(401).send('Usuário nao tem permissäo.')
        }
    }}


    return { admin, user, operator,device}

}