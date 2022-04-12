/** Lấy toàn bộ sách theo từng trang
 * @swagger
 * /book/all:
 *  get:
 *      summary: Lấy toàn bộ sách theo từng trang
 *      tags: [Book]
 *      parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: số trang
 *          - in: query
 *            name: filter
 *            description: các điều kiện lọc bao gồm (title, author, type, status, genres[] được đặt trong một json object
 *            example: {"title":"one", "genres":["action","shounen"]} 
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          title:
 *                              type: string
 *                          author:
 *                              type: string
 *                          type:
 *                              type: string
 *                          status:
 *                              type: integer 
 *                          genres:
 *                              type: array
 *                              items:
 *                                  type: string
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */




/** Top 10 sách gợi ý cho người dùng dựa trên các thể loại của sách mà người dùng follow
 * @swagger
 * /book/suggest-book:
 *  get:
 *      summary: Top 10 sách gợi ý cho người dùng dựa trên các thể loại của sách mà người dùng follow
 *      tags: [Book]
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
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BadRequestResponse'
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UnauthorizedResponse'
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ForbiddenResponse'
 *          404: 
 *              description: Not Found - Không tìm thấy tài khoản người dùng
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */


/** Top 10 tìm kiếm
 * @swagger
 * /book/top-search:
 *  get:
 *      summary: Top 10 tìm kiếm
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Top 10 rating
 * @swagger
 * /book/top-rating:
 *  get:
 *      summary: Top 10 rating
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Top 10 sách xem nhiều nhất ngày hôm nay
 * @swagger
 * /book/top-view-day:
 *  get:
 *      summary: Top 10 sách xem nhiều nhất ngày hôm nay
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Top 10 sách được xem nhiều nhất trong tháng này
 * @swagger
 * /book/top-view-month:
 *  get:
 *      summary: Top 10 sách được xem nhiều nhất trong tháng này
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Top 10 sách được xem nhiều nhất trong năm
 * @swagger
 * /book/top-view-year:
 *  get:
 *      summary: Top 10 sách được xem nhiều nhất trong năm
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Top 10 sách có lượt follow nhiều nhất
 * @swagger
 * /book/top-follow:
 *  get:
 *      summary: Top 10 sách có lượt follow nhiều nhất
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Danh sách các user đang follow sách
 * @swagger
 * /book/follower/{book_endpoint}:
 *  get:
 *      summary: Danh sách các user đang follow sách
 *      tags: [Book]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của sách
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UserResponse'
 *          404:
 *              description: Không tìm thấy sách yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Top 10 sách vừa được cập nhật chapter mới nhất
 * @swagger
 * /book/last-update:
 *  get:
 *      summary: Top 10 sách vừa được cập nhật chapter mới nhất
 *      tags: [Book]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Top 10 sách tương tự với sách hiện tại
 * @swagger
 * /book/relate-book/{book_endpoint}:
 *  get:
 *      summary: Top 10 sách tương tự với sách hiện tại được lọc dựa sự trùng khớp nhiều nhất về thể loại của sách hiện tại
 *      tags: [Book]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của sách hiện tại
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BookResponse'
 *          404:
 *              description: Không tìm thấy sách yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Chi tiết sách
 * @swagger
 * /book/detail/{book_endpoint}:
 *  get:
 *      summary: Chi tiết sách
 *      tags: [Book]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của sách hiện tại
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailBookResponse'
 *          404:
 *              description: Not Found - Sách không tồn tại
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Thêm sách
 * @swagger
 * /book:
 *  post:
 *      summary: Thêm sách
 *      tags: [Book]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - title
 *                          - type
 *                          - thumb
 *                          - theme
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: Tiêu đề sách
 *                          thumb:
 *                              type: string
 *                              format: binary
 *                              description: Ảnh bìa sách
 *                          theme:
 *                              type: string
 *                              format: binary
 *                              description: Ảnh nền sách
 *                          author:
 *                              type: string
 *                              description: Tên tác giả
 *                          description:
 *                              type: string
 *                              description: Mô tả sách
 *                          type:
 *                              enum: [Comic, Novel, Literature]
 *                              description: Thể loại chính của sách
 *                          genres:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              description: Danh sách các endpoint thể loại (genre) của sách
 *                  encoding:
 *                      thumb:
 *                          contentType: image/png, imgage/jpeg
 *                      theme:
 *                          contentType: image/png, imgage/jpeg
 *                      genres:
 *                          style: form
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailBookResponse'
 *          400:
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BadRequestResponse'
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UnauthorizedResponse'
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ForbiddenResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Cập nhật thông tin sách
 * @swagger
 * /book/{book_endpoint}:
 *  patch:
 *      summary: Cập nhật thông tin sách
 *      tags: [Book]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema: 
 *              type: string
 *            description: endpoint của sách
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: Tiêu đề sách
 *                          thumb:
 *                              type: string
 *                              format: binary
 *                              description: Ảnh bìa sách
 *                          theme:
 *                              type: string
 *                              format: binary
 *                              description: Ảnh nền sách
 *                          author:
 *                              type: string
 *                              description: Tên tác giả
 *                          description:
 *                              type: string
 *                              description: Mô tả sách
 *                          type:
 *                              enum: [Comic, Novel, Literature]
 *                              description: Thể loại chính của sách
 *                          genres:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              description: Danh sách các endpoint thể loại (genre) của sách
 *                  encoding:
 *                      thumb:
 *                          contentType: image/png, imgage/jpeg
 *                      theme:
 *                          contentType: image/png, imgage/jpeg
 *                      genres:
 *                          style: form
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailBookResponse'
 *          400:
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BadRequestResponse'
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UnauthorizedResponse'
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ForbiddenResponse'
 *          404:
 *              description: Not Found - Không thể tìm thấy sách yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Cập nhật trang thái sách đã hoàn thành
 * @swagger
 * /book/finish/{book_endpoint}:
 *  patch:
 *      summary: Cập nhật trang thái sách đã hoàn thành, tự động thông báo tới các user đang follow sách
 *      tags: [Book]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema: 
 *              type: string
 *            description: endpoint của sách
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailBookResponse'
 *          400:
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BadRequestResponse'
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UnauthorizedResponse'
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ForbiddenResponse'
 *          404:
 *              description: Not Found - Không thể tìm thấy sách yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Đánh giá sách
 * @swagger
 * /book/rate/{book_endpoint}:
 *  patch:
 *      summary: Đánh giá sách
 *      tags: [Book]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema: 
 *              type: string
 *            description: endpoint của sách
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          rating:
 *                              type: number
 *                              format: float
 *                              description: Điểm đánh giá của user (0 <= rating <= 5)
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailBookResponse'
 *          400:
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/BadRequestResponse'
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UnauthorizedResponse'
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ForbiddenResponse'
 *          404:
 *              description: Not Found - Không thể tìm thấy sách yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */



/** Xóa sách
 * @swagger
 * /book/{book_endpoint}:
 *  delete:
 *      summary: Xóa sách
 *      description: Cập nhật trạng thái sách = -1
 *      tags: [Book]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema: 
 *              type: string
 *            description: endpoint của sách
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/MessageResponse'
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/UnauthorizedResponse'
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ForbiddenResponse'
 *          404:
 *              description: Not Found - Không thể tìm thấy sách yêu cầu
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotFoundResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ServerErrorResponse'
 */