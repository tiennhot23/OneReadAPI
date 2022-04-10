const conn = require('../connection')

const chapter = {}

chapter.get_detail = (book_endpoint, chapter_endpoint) => {
    return new Promise((resolve, reject) => {
        let query = `select *, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Chapter" where chapter_endpoint = $2 and book_endpoint = $1`

        var params = [book_endpoint, chapter_endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

chapter.get_all = (book_endpoint) => {
    return new Promise((resolve, reject) => {
        let params = [book_endpoint]
        let query = `select chapter_endpoint, book_endpoint, title, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Chapter" where book_endpoint = $1 order by time desc`

        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

chapter.add = (chapter) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Chapter" (chapter_endpoint, book_endpoint, title, images) values ($1, $2, $3, $4) returning *' 
        var params = [chapter.chapter_endpoint, chapter.book_endpoint, chapter.title, chapter.images]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

chapter.update = (chapter, chapter_endpoint) => {
    return new Promise((resolve, reject) => {
        let params = [chapter.title, chapter.chapter_endpoint, chapter.images, chapter_endpoint, chapter.book_endpoint]
        let query = 'update "Chapter" set title = $1, chapter_endpoint = $2, images = $3 where chapter_endpoint = $4 and book_endpoint = $5 returning *'

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

chapter.delete = (book_endpoint, chapter_endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Chapter" where book_endpoint = $1 and chapter_endpoint = $2 returning *'

        var params = [book_endpoint, chapter_endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

module.exports = chapter
