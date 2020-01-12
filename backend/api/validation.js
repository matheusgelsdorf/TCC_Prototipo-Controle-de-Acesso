module.exports = app => {
    function existsOrError(value, msg) {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
    }

    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }

    function equalsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    function isValidElement(element, elementFromDb, msg) {
        if (!(element && elementFromDb)) throw ('Erro interno')

        if (elementFromDb.name && !(element.name === elementFromDb.name)) throw /*'name '+m */msg
        if (elementFromDb.cpf && !(element.cpf === elementFromDb.cpf)) throw /*'cpf '+ */msg
        if (elementFromDb.rg && !(element.rg === elementFromDb.rg)) throw/*'rg '+ */msg
        if (elementFromDb.email && !(element.email === elementFromDb.email)) throw /*'email '+ */msg
        if (elementFromDb.registrationNumber && !(element.registrationNumber === elementFromDb.registrationNumber)) throw /*'Matricula '+ */msg
        if (elementFromDb.userId && !(element.userId === elementFromDb.userId)) throw /*'userId'+ */msg

    }

    function isValidHardwarePassword(password, msg) {
        if (!password || !((password.length === 4) && password.match("[0-9]+"))) {
            throw msg;
        }
    }

    function isValidTotalTicketValue(user, tickets, msg) {
        let ticketValue;
        let totalValue;
        if (tickets.totalValue < 0 || tickets.number < 0)
            throw msg

        if (user.userType === 'Aluno')
            ticketValue = 2;
        else if (user.userType === 'Servidor')
            ticketValue = 6.20

        else throw 'Tipo de usuário inválido.'

        totalValue = tickets.number * ticketValue
        if (!(totalValue === tickets.totalValue)) throw msg

    }

    function isValidLocation(deviceLocation, locations, msg) {
        let isValid = locations.filter(location => {
            if (location === deviceLocation) return true
            else return false
        });
        if (!(isValid && isValid.length > 0)) throw msg
    }

    function validateEmail(email, msg) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!re.test(email)) throw msg
    }

    function validateUserType(userType, msg) {
        if (!(userType === "Servidor" || userType === "Aluno")) throw msg
    }

    function isValidCurrentTimeInterval(startTime,endTime) {
         
        currentDate = new Date()
        let offset= -3 +(currentDate.getTimezoneOffset()/60)
        
        currentDate.setHours(currentDate.getHours()+offset);

        startDate = new Date(currentDate.getTime());

        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);

        endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);

        currentDate.setHours=currentDate.setHours;
        return startDate <= currentDate && endDate >= currentDate 
    }

    return {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        isValidElement,
        isValidTotalTicketValue,
        isValidHardwarePassword,
        isValidLocation,
        validateEmail,
        validateUserType,
        isValidCurrentTimeInterval
    }
}