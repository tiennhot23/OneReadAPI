module.exports = {
    book:{
        missing_title: 'Thiếu title',
        missing_endpoint: 'Thiếu endpoint',
        missing_type: 'Thiếu thể loại',
        missing_genre: 'Thêm ít nhất một thể loại cho sách',
        not_found: 'Sách này không tồn tại',
        exist: 'Sách này đã tồn tại',
        book_pk: 'Tên sách bị trùng',
        type_constraint: 'Sách chỉ gồm các loại "Comic", "Novel" hoặc "Literature"',
        status_constraint: 'Tình trạng của sách: -1 - đã xoá, 0 - đang tiến hành, 1 - đã hoàn thành'
    },
    genre:{
        missing_title: 'Thiếu title',
        missing_endpoint: 'Thiếu endpoint',
        not_found: 'Thể loại này không tồn tại',
        exist: 'Thể loại này đã tồn tại',
        genre_pk: 'Tên thể loại bị trùng'
    },
    file:{
        not_exist: 'File not exist',
        choose_file: 'BAD REQUEST: please choose files'
    },
    user:{
        not_found: 'User not found',
        not_empty: 'BAD REQUEST: please fill required fields',
        incorrect_account: 'ERROR: username and password not correct',
        can_not_follow_user: 'Can not follow current user',
        can_not_unfollow_user: 'Can not unfollow current user',
    },
    auth:{
        unauthorized: 'UNAUTHORIZED: You need login to do this action',
        forbidden: 'FORBIDDEN: You need permission to do this action'
    },
    encypt:{
        password_required: 'Password required'
    }
}