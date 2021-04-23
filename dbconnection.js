//DB Connection
const mysql = require("mysql2");
const fs = require('fs')

var mysqlConnection = new mysql.createConnection({
    user: "Dhikshith",
    password: process.env.DBPASSWORD,
    database: "mysql",
    host: "localhost",
});

mysqlConnection.connect(err => {
    if(!err){
        console.log('connected')
        mysqlConnection.query(`SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;`,(err, rows, fields)=>{
                if(!err){
                    if(!rows.map(e => e.table_name).includes('users')){
                    console.log('database doesn\`t have users table \n creating users table.....')
                    mysqlConnection.query(`create table users(
                        user_id serial primary key,
                        user_name varchar(32) not null,
                        user_lastname varchar(32),
                        user_email text unique not null,
                        userinfo text,
                        encry_password text not null,
                        salt text,
                        user_role ENUM('0','1') default '0',
                        purchases text ARRAY,
                        createdat timestamp not null default CURRENT_TIMESTAMP(),
                        last_login timestamp default CURRENT_TIMESTAMP()
                    );`,(err)=> console.log(err))
                    }
                    if(!rows.map(e=> e.table_name).includes('category')){
                        console.log('database doesn\'t have category table \n creating category table....')
                        mysqlConnection.query(`create table category(c_name varchar(32) not null primary key,createdat timestamp not null default CURRENT_TIMESTAMP());`,(err)=>console.log(err))
                    }
                    if(!rows.map(e=> e.table_name).includes('product')){
                        console.log('database doesn\'t have product table \n creating product table....')
                        mysqlConnection.query(`create table product(
                            product_id serial primary key,
                            p_name varchar(32) not null,
                            p_description varchar(2000) not null,
                            p_price integer not null,
                            category varchar(32) references category(c_name),
                            stock integer,
                            sold integer default 0,
                            createdat timestamp not null default CURRENT_TIMESTAMP()
                        );`,err=>console.log(err))
                        }
                        if(!rows.map(e=> e.table_name).includes('order')){
                        console.log('database doesn\'t have order table \n creating order table....')
                        
                        mysqlConnection.query(`create table order (order_id serial primary key, status ENUM('Cancelled','Delivered','Shipped','Proccessing','Placed'))`, err => console.log(err))
                        }
                    }
                    else{
                        console.log(`query failed ${err}`)
                    }
                
            })
    }else{
        console.log(`Error while connecting: ${err}`)
    }
})

module.exports = mysqlConnection;