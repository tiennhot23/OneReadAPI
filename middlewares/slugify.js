const slugify = require('slugify')

const slug = {}

slug.get_endpoint = (req, res, next) => {
    var title = req.body.title
    if (title) {
        try{
            req.body.endpoint = slugify(title, { lower: true, strict: true })
        }catch(e){
            next(e)
            return
        }
    }

    next()
}

module.exports = slug