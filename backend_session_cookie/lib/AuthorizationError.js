
module.exports = class AuthorizationError extends Error{
    constructor(message,status){
        super(message)
        this.name = this.constructor.name
        this.status = status
    }
}