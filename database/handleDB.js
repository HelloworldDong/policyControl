/**
 * Module dbutils
 * A database connection utility
 */
const dbconfig = require('./config.json');
let mysql = require('mysql');
let Promise = require('bluebird');

let pool = mysql.createPool(dbconfig);

module.exports = {
	/**
	 * Function read
	 * Read from the database, it's a sync function.
	 * Parameter 'sql' is the query string,
	 * Parameter 'params' is an array that contains the values in the sql string.
	 * 		For example:
	 * 		db.read("select * from user where userid = ?", ['1314520'])......
	 * 
	 * Return a Promise object
	 * If there is an error, it will reject it, or it will resolve the result.
	 */
	read: function(sql, params){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, con){
				if(err){
					con.release();
					reject(err);
				}else{
					con.query(sql,params, function(err, results, fields){
						if(err){
							con.release();
							reject(err);
						}else{
							con.release();
							resolve(results);
							console.log(fields);
						}
					});
				}
			});
		});
	},


	/**
	 * Function write
	 * Write into the database, it's an async function.
	 * Parameter 'sql' is the query string,
	 * Parameter 'params' is an array that contains the values in the sql string.
	 * Parameter 'cb' is the callback function
	 * 		For example:
	 * 		db.write("update user where userid = ? set username = ?", ['1314520', 'Ishihara Satomi'], cb(result))......
	 * 
	 * The result/error message will be passed by the callback function.
	 */
	write: function(sql, params, cb){
		pool.getConnection(function(err, con){
			if(err){
				con.release();
				cb(err);
			}else{
				con.query(sql, params, function(err, results){
					if(err){
						con.release();
						cb(err);
					}else{
						con.release();
						cb(err,results);
					}
				});
			}
		});
	}
}