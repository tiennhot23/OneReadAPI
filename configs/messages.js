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
    report: {
        missing_endpoint: 'Thiếu endpoint',
        missing_type: 'Thiếu loại report',
        missing_reason: 'Thiếu lí do',
        missing_status: 'Thiếu status',
        not_found: 'Không tìm thấy report',
        report_pk: 'Report này đã tồn tại',
        type_constraint: 'Loại report chỉ có thể là "A": report account hoặc "C": report comment',
        status_constraint: 'Trạng thái của report là 0: chưa xử lí hoặc 1: đã xử lí'
    },
    notify: {
        missing_endpoint: 'Thiếu endpoint',
        missing_username: 'Thiếu username',
        missing_content: 'Thiếu nội dung',
        missing_status: 'Thiếu status',
        not_found: 'Không tìm thấy thông báo',
        notify_pk: 'Thông báo này đã tồn tại',
        username_fk: 'User này không tồn tại',
        status_constraint: 'Trạng thái của thông báo là 0: chưa xem hoặc 1: đã xem'
    },
    file:{
        not_exist: 'File không tồn tại',
        choose_file: 'Vui lòng chọn file'
    },
    user:{
        not_found: 'User không tồn tại',
        missing_username: 'Thiếu username',
        missing_password: 'Thiếu password',
        missing_avatar: 'Thiếu avatar',
        missing_email: 'Thiếu email',
        missing_status: 'Thiếu status',
        missing_role: 'Thiếu role',
        incorrect_account: 'Username và password không trùng khớp',
        email_exist: 'Email đã được sử dụng',
        email_veified: 'Email đã được xác minh',
        can_not_follow_book: 'Không thể follow sách',
        can_not_unfollow_book: 'Không thể unfollow sách',
        account_pk: 'Username đã được sử dụng',
        status_constraint: 'Trạng thái của user là -1: banned, 1: default',
        role_constraint: 'Quyền của user là 0: user hoặc 1: admin'
    },
    auth:{
        unauthorized: 'Cần tài khoản để có thể thực hiện chức năng này',
        forbidden: 'Tài khoản không được phép thực hiện chức năng này',
        verify_email: 'Vui lòng vào email vừa đăng kí để xác minh',
        token_expired: 'Token này đã hết hạn sử dụng',
        token_invalid: 'Token không khả dụng'
    },
    encypt:{
        password_required: 'Yêu cầu password'
    }
}