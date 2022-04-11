

/**
 * @swagger
 * /user/verify-email/{username}:
 *  get:
 *      summary: Xác thực token và cập nhật trang thái tài khoản thành đã xác thực email
 *      description: Cập nhật status của user = 1
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *          - in: query
 *            name: token
 *            required: true
 *            schema: 
 *              type: string
 *            description: token dùng để xác thực email, nhân được trong mail sau khi người dùng thực hiện yêu cầu xác minh email
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - tham số token bị thiếu hoặc không khả dụng
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không thể tìm thấy user được yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */






/**
 * @swagger
 * /user/info/{username}:
 *  get:
 *      summary: Lấy thông tin gồm username, avatar, status, email của user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UserResponse'
 *          400: 
 *              description: Bad Request - Thiếu tham số username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không thể tìm thấy user được yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */






/**
 * @swagger
 * /user/book-following/{username}:
 *  get:
 *      summary: Lấy danh sách các sách mà user đang follow
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          400: 
 *              description: Bad Request - Thiếu tham số username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */





/**
 * @swagger
 * /user/comment-history/{username}:
 *  get:
 *      summary: Lịch sử comment của user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/CommentResponse'
 *          400: 
 *              description: Bad Request - Thiếu tham số username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */






/**
 * @swagger
 * /user/history/{username}:
 *  get:
 *      summary: Lịch sủ các sách đã xem của user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/HistoryReadResponse'
 *          400: 
 *              description: Bad Request - Thiếu tham số username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /user/history/{book_endpoint}{username}:
 *  get:
 *      summary: Lịch sử xem của 1 sách, chapter đọc gần đây nhất
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của sách
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/HistoryReadResponse'
 *          400: 
 *              description: Bad Request - Thiếu tham số username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /user/login:
 *  post:
 *      summary: Đăng nhập
 *      tags: [User]
 *      responses:
 *          200:
 *              description: Trả về một jsonobject gồm accessToken và dữ liệu người dùng
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/LoginResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc username, password
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /user/register:
 *  post:
 *      summary: Đăng kí tài khoản
 *      tags: [User]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *                          email:
 *                              type: string
 *      responses:
 *          200:
 *              description: Trả về một message đăng kí thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, password, email
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /user/verify-email/{username}:
 *  post:
 *      summary: Gửi mail chứa link xác thực tới email của user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã gửi link vào email của user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu tham số username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /user/follow-book/{book_endpoint}/{username}:
 *  post:
 *      summary: Follow sách
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của sách
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã gửi link vào email của user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, book_endpoint
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /user/unfollow-book/{book_endpoint}/{username}:
 *  post:
 *      summary: Unfollow sách
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của sách
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã unfollow sách thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, book_endpoint
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */






/**
 * @swagger
 * /user/ban/{username}:
 *  post:
 *      summary: Ban user và tự động thông báo tới user bị ban
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã ban user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, book_endpoint
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */






/**
 * @swagger
 * /user/unban/{username}:
 *  post:
 *      summary: Unban user và tự động thông báo tới user bị ban
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã unban user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, book_endpoint
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */








/**
 * @swagger
 * /user/{username}:
 *  patch:
 *      summary: Cập nhật thông tin user gồm email hoặc avatar
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: email
 *                          avatar:
 *                              type: string
 *                              format: binary
 *                              description: Ảnh đại diện
 *                  encoding:
 *                      avatar:
 *                          contentType: image/png, imgage/jpeg
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã ban user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UserResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /change-role/{username}:
 *  patch:
 *      summary: Cập nhật role của tài khoản
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          role:
 *                              type: integer
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã cập nhật role của user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, role
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /change-password/{username}:
 *  patch:
 *      summary: Thay đổi password
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã cập nhật password của user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, role
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */








/**
 * @swagger
 * /{username}:
 *  delete:
 *      summary: Xóa user cùng toàn bộ dữ liệu liên quan 
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã xóa user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */








/**
 * @swagger
 * /history/all/{username}:
 *  delete:
 *      summary: Xóa toàn bộ lịch sử xem của user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã xóa toàn bộ lịch sử xem của user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
 * @swagger
 * /history/single/{book_endpoint}/{username}:
 *  delete:
 *      summary: Xóa lịch sử xem một sách của user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *            description: username của user
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của sách
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Trả về một message thông báo đã xóa toàn bộ lịch sử xem một sách của user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc như username, book_endpoint
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */
