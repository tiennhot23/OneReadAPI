/**
 * @swagger
 * components:
 *  schemas:
 *      Book:
 *          type: object
 *          required: 
 *              - title
 *              - type
 *              - thumb
 *              - theme
 *          properties:
 *              endpoint:
 *                  type: string
 *                  description: Endpoint tự tạo tự động từ title của sách
 *              title:
 *                  type: string
 *                  description: Title
 *              author:
 *                  type: string
 *                  description: Author
 *              thumb:
 *                  type: string
 *                  description: Chứa link ảnh bìa của sách
 *              theme:
 *                  type: string
 *                  description: Chứa link ảnh nền của sách
 *              description:
 *                  type: string
 *                  description: Mô tả tóm tắt về sách
 *              type:
 *                  type: string
 *                  description: Loại sách gồm 3 loại chính là Comic, Novel, Literature
 *                  enum: [Comic,Novel,Literature]
 *              rating:
 *                  type: number
 *                  description: Điểm đánh giá của sách
 *                  format: float
 *                  minimum: 0
 *                  maximum: 5
 *              rate_count:
 *                  type: integer
 *                  description: Tổng số lượt đánh giá sách
 *              status:
 *                  type: integer
 *                  description: Tình trạng sách
 *                  enum: [-1 (deleted), 0 (ongoing), 1 (finished)]
 *              search_number:
 *                  type: integer
 *                  description: Số lượt tìm kiếm sách
 *              follow: 
 *                  type: integer
 *                  description: Số lượt follow của sách
 *              view:
 *                  type: integer
 *                  description: Số lượt view của sách
 *              genres:
 *                  type: array
 *                  description: Các tag thể loại của sách
 *                  items: 
 *                      $ref: '#/components/schemas/Genre'
 */





/**
 * @swagger
 * components:
 *  schemas:
 *      Chapter:
 *          type: object
 *          required:
 *              - title
 *              - images
 *          properties:
 *              chapter_endpoint:
 *                  type: string
 *                  description: Endpoint của chapter được tạo tự động từ title của chapter
 *              book_endpoint:
 *                  $ref: '#/components/schemas/Book/properties/endpoint'
 *                  type: string
 *                  description: Endpoint của sách
 *              title:
 *                  type: string
 *                  description: Tiêu đề của chapter
 *              time:
 *                  type: string
 *                  description: Thời gian chapter này được khởi tạo
 *                  format: dd-MM-yyyy hh:mm:ss
 *              images:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: Lưu mảng các chuỗi link ảnh trong trường hợp sách thuộc thể loại Comic, ngược lại lưu mảng các đoạn văn nếu sách thuộc thể loại Novel hoặc Literature
 */





/**
 * @swagger
 * components:
 *  schemas:
 *      Comment:
 *          type: object
 *          required:
 *              - book_endpoint
 *              - content
 *          properties:
 *              id:
 *                  type: integer
 *                  description: id của comment tự động tăng
 *              book_endpoint:
 *                  $ref: '#/components/schemas/Book/properties/endpoint'
 *                  type: string
 *                  description: Endpoint của sách mà người dùng comment
 *              id_root:
 *                  type: integer
 *                  description: id của comment gốc nếu đây là comment phản hồi lại comment khác, ngược lại id_root bằng chính id của comment
 *              content:
 *                  type: string
 *                  description: Nội dung comment
 *              time:
 *                  type: string
 *                  description: Thời gian comment được đăng tải
 *                  format: dd-MM-yyyy hh:mm:ss
 *              files:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: Mảng các link ảnh đính kèm với comment nếu có
 *              user:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                      avatar:
 *                          type: string
 *                      status:
 *                          type: integer
 *                      email:
 *                          type: string
 *                      role:
 *                          type: integer
 *                  description: Thông tin công khai của người comment
 *                  
 */





/**
 * @swagger
 * components:
 *  schemas:
 *      Genre:
 *          type: object
 *          required:
 *              - title
 *          properties:
 *              endpoint:
 *                  type: string
 *                  description: Endpoint tự động tạo từ tiêu đề của thể loại
 *              title:
 *                  type: string
 *                  description: Tiêu đề của thể loại
 *              description:
 *                  type: string
 *                  description: Mô tả tóm tắt của thể loại
 */



/**
 * @swagger
 * components:
 *  schemas:
 *      Notify:
 *          type: object
 *          required:
 *              - content
 *          properties:
 *              endpoint:
 *                  type: string
 *                  description: Endpoint được tạo  dựa theo thông tin của những loại thông báo khác nhau 
 *                  oneOf: 
 *                      - Thông báo user được tag vào comment có dạng: +comment+{$comment-id}
 *                      - Thông báo sách đã hoàn thành có dạng: +book+{$book-endpoint}
 *                      - Thông báo chapter mới nhất có dạng: +chapter+{$book-endpoint}+{$chapter-endpoint}
 *                      - Thông báo người dùng bị banned có dạng: +ban+{$username}
 *                      - Thông báo người dùng được ân xá có dạng: +unban+{$username}
 *              username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *                  type: string
 *                  description: Username của người nhận thông báo
 *              content:
 *                  type: string
 *                  description: Nội dung thông báo
 *              status:
 *                  type: integer
 *                  description: Trạng thái của thông báo
 *                  enum: [0 (unread), 1 (read)]
 *              time:
 *                  type: string
 *                  description: Thời gian thông báo được gửi đến
 *                  format: dd-MM-yyyy hh:mm:ss
 * 
 */




/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - username
 *              - password
 *              - email
 *          properties:
 *              username:
 *                  type: string
 *                  description: Tên tài khoản
 *              password:
 *                  type: string
 *                  description: Mật khẩu
 *              avatar:
 *                  type: string
 *                  description: Link ảnh đại diện
 *              status:
 *                  type: integer
 *                  description: Trạng thái của tài khoản
 *                  enum: [-1 (banned), 0 (not verify email), 1 (verified email)]
 *              email:
 *                  type: string
 *                  description: email
 *              role:
 *                  type: integer
 *                  description: Quyền của tài khoản (admin and normal user)
 *                  enum: [0 (user), 1 (admin)]
 */