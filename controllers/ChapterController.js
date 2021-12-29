const conn = require('../connection')

const db = {}

db.get = (book_endpoint, chapter_endpoint) => {
    return new Promise((resolve, reject) => {
        let query = `select * from "Chapter", (select images from "ChapterDetail" where chapter_endpoint = $2 and book_endpoint = $1) as images where chapter_endpoint = $2 and book_endpoint = $1`

        var params = [book_endpoint, chapter_endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.list = (book_endpoint) => {
    return new Promise((resolve, reject) => {
        let params = [book_endpoint]
        let query = 'select * from "Chapter" where book_endpoint = $1 order by time desc'

        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.add = (chapter) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Chapter" (chapter_endpoint, book_endpoint, title) values ($1, $2, $3) returning *' 
        var params = [chapter.chapter_endpoint, chapter.book_endpoint, chapter.title]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.add_chapter_detail = (chapter) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "ChapterDetail" (chapter_endpoint, book_endpoint, images) values ($1, $2, $3) returning images' 
        var params = [chapter.chapter_endpoint, chapter.book_endpoint, chapter.images]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.update = (chapter, chapter_endpoint) => {
    return new Promise((resolve, reject) => {
        let params = [chapter.title, chapter.chapter_endpoint, chapter_endpoint, chapter.book_endpoint]
        let query = 'update "Chapter" set title = $1, chapter_endpoint = $2 where chapter_endpoint = $3 and book_endpoint = $4 returning *'

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.update_chapter_images = (chapter) => {
    return new Promise((resolve, reject) => {
        let params = [chapter.images, chapter.chapter_endpoint, chapter.book_endpoint]
        let query = 'update "ChapterDetail" set images = $1 where chapter_endpoint = $2 and book_endpoint = $3 returning images'

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.delete = (book_endpoint, chapter_endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Chapter" where book_endpoint = $1 and chapter_endpoint = $2 returning *'

        var params = [book_endpoint, chapter_endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

module.exports = db;