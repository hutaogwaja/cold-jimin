import mysql from 'mysql2/promise';
import config from '../config.json' with { type: "json" };

export const pool = mysql.createPool({
    host: config.dataBase.host,
    user: config.dataBase.user,
    password: config.dataBase.password,
    database: config.dataBase.name,
    port: config.dataBase.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


export async function checkAdmin(id) {
    const [rows] = await pool.query(`
    SELECT 
        user_admin AS userAdmin 
    FROM Users
    WHERE 1=1
    AND bot_type = ?
    AND user_id = ?
    `, [config.botType, id]);
    
    if (rows[0].userAdmin === 1) {
        return true;
    }
    return false; 
}
export async function getUserInfo(id) {
    const [rows] = await pool.query(`
    SELECT 
        user_id AS userId
    ,	bot_type AS botType
    ,	user_name AS userName
    ,	user_tag AS userTag
    ,	DATE_FORMAT(user_sign_date, '%Y-%m-%d') AS userSignDate
    ,	user_likeability AS userLikeability
    ,	user_admin AS userAdmin 
    AND bot_type = ?
    AND user_id = ?
    `, [config.botType, id]);
    
    if (rows.length > 0) {
        return rows;
    }
    return false; 
}