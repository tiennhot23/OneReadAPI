



/** Lấy danh sách các chapter của sách
 * @swagger
 * /chapter/all/{book_endpoint}:
 *  get:
 *      summary: Lấy danh sách các chapter của sách
 *      tags: [Chapter]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của sách
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ChapterResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          404:
 *              description: Not Found - Không tìm thấy sách
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/** Trả về chi tiết của chương sách
 * @swagger
 * /chapter/detail/{book_endpoint}/{chapter_endpoint}:
 *  get:
 *      summary: chi tiết sách
 *      description: Trả về chi tiết của chương sách và tự động cập nhật lịch sử xem của người dùng nếu đã đăng nhập
 *      tags: [Chapter]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của sách
 *          - in: path
 *            name: chapter_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của chương sách
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailChapterResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          404:
 *              description: Not Found - Không tìm thấy sách hoặc chapter yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */








/** Thêm chapter cho sách thể loại comic, thông báo tới user đang follow sách
 * @swagger
 * /chapter/comic/{book_endpoint}:
 *  post:
 *      summary: Thêm chapter cho sách thể loại comic, thông báo tới user đang follow sách
 *      tags: [Chapter]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của sách
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - title
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: Tiêu đề chapter
 *                          images:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  format: binary
 *                              description: Danh sách các ảnh của chapter đối với sách thuộc thể loại Comic
 *                  encoding:
 *                      images:
 *                          contentType: image/png, imgage/jpeg
 *                          style: form
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ChapterResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không tìm thấy sách
 *          500:
 *              description: Lỗi thực thi request trên server
 */








/** Thêm chapter cho sách thể loại novel, thông báo tới user đang follow sách
 * @swagger
 * /chapter/novel/{book_endpoint}:
 *  post:
 *      summary: Thêm chapter cho sách thể loại novel, thông báo tới user đang follow sách
 *      tags: [Chapter]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của sách
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - title
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: Tiêu đề chapter
 *                          images:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              description: Một mảng các đoạn text của chapter đối với sách thuộc thể loại Novel, Literature
 *                  encoding:
 *                      images:
 *                          style: form
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ChapterResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không tìm thấy sách
 *          500:
 *              description: Lỗi thực thi request trên server
 */








/** Xóa chapter
 * @swagger
 * /chapter/{book_endpoint}/{chapter_endpoint}:
 *  delete:
 *      summary: Xóa chapter
 *      tags: [Chapter]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của sách
 *          - in: path
 *            name: chapter_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của chương sách
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailChapterResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không tìm thấy sách hoặc chapter
 *          500:
 *              description: Lỗi thực thi request trên server
 */


