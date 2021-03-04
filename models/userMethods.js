const encryptionManager = require('../libs/encryptionManager')


function schemaMethods(Schema){
    Schema.pre('save', function(next){
        const user = this
        if(user.isModified('password')){
            const hash = encryptionManager.getHashed(user.password)
            user.password = hash
        }
        next()
    })
}

module.exports = schemaMethods