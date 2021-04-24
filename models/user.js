var mysqlConnection = require('../dbconnection')



class User {
    constructor(body){
       this.user_name  = body.user_name
        this.last_name  = body.last_name
      this.userinfo   = body.userinfo
      this.user_email  =  body.user_email
       this.encry_password = body.encry_password
    }
    save(next){
        mysqlConnection.query(`insert into users(
            'user_name','last_name','user_email','encry_password'
        ) values ?`,[this.user_name,this.last_name,this.user_email,this.encry_password])
        next()
    }
}

module.exports = User