



/**
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
 *              description: Bad Request - thiếu các tham số bắt buộc book_endpoint
 *          500:
 *              description: Lỗi thực thi request trên server
 */







/**
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
 *              description: Bad Request - Thiếu các tham số bắt buộc book_endpoint, chapter_endpoint
 *          500:
 *              description: Lỗi thực thi request trên server
 */








/**
 * @swagger
 * /chapter/{book_endpoint}:
 *  post:
 *      summary: Thêm chapter, thông báo tới user đang follow sách
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
 *                              description: Tiêu đề sách
 *                          images:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  format: binary
 *                              description: Danh sách các ảnh của chapter đối với sách thuộc thể loại Comic
 *                          texts:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              description: Một mảng các đoạn text của chapter đối với sách thuộc thể loại Novel, Literature
 *                  encoding:
 *                      images:
 *                          contentType: image/png, imgage/jpeg
 *                          style: form
 *                      texts:
 *                          style: form
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/ChapterResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số bắt buộc book_endpoint, title
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
 * /chapter/{book_endpoint}{chapter_endpoint}:
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
 *              description: Bad Request - Thiếu các tham số bắt buộc book_endpoint, chapter_endpoint
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không thể tìm thấy user được yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */


