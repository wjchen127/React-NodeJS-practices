
module.exports = class ValidationError extends Error{
    constructor(message,status){
        super(message)
        this.name = this.constructor.name
        this.status = status
    }
}
