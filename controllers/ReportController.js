const conn = require('../connection')

const db = {}

db.get = (endpoint, type) => {
    return new Promise((resolve, reject) => {
        let query = 'update "Report" set status = 1 where endpoint = $1 and type = $2 returning *'

        var params = [endpoint, type]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.list = () => {
    return new Promise((resolve, reject) => {
        let query = `select *, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Report" order by status`

        conn.query(query, (err, res) => {
            if(err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.add = (report) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Report" (endpoint, type, reason) values ($1, $2, $3) returning *'

        var params = [report.endpoint, report.type, report.reason]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.update_status = (report) => {
    return new Promise((resolve, reject) => {
        let params = [report.status, report.endpoint, report.type]
        let query = 'update "Report" set status = $1 where endpoint = $2 and type = $3 returning *'

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.add_exist = (report) => {
    return new Promise((resolve, reject) => {
        let params = [report.reason, report.endpoint, report.type]
        let query = `update "Report" set status = 0, num = num + 1,
                            time = localtimestamp at time zone 'GMT+7', 
                            reason = reason || E'\n' || $1
                    where endpoint = $2 and type = $3 returning *`

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.delete = (endpoint, type) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Report" where endpoint = $1 and type = $2 returning *'

        var params = [endpoint, type]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.deleteRead = () => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Report" where status = 1 returning *'

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

module.exports = db;