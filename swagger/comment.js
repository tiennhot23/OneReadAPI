

/** Lấy danh sách các comment gốc của sách theo trang
 * @swagger
 * /comment/{book_endpoint}:
 *  get:
 *      summary: Lấy danh sách các comment gốc của sách theo trang
 *      tags: [Comment]
 *      parameters:
 *          - in: path
 *            name: book_endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: Endpoint của sách
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: số trang
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/CommentResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          404:
 *              description: Not Found - Không tìm thấy sách
 *          500:
 *              description: Lỗi thực thi request trên server
 */




/** Comment gốc và danh sách các reply của comment theo từng trang
 * @swagger
 * /comment/detail/{id}:
 *  get:
 *      summary: Comment gốc và danh sách các reply của comment theo từng trang
 *      tags: [Comment]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: id của comment gốc
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: số trang
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/DetailCommentResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          404:
 *              description: Not Found - Không tìm thấy comment gốc
 *          500:
 *              description: Lỗi thực thi request trên server
 */




/** Thêm comment, tự động thông báo đến user được tag trong comment
 * @swagger
 * /comment/{book_endpoint}:
 *  post:
 *      summary: Thêm comment, tự động thông báo đến user được tag trong comment
 *      tags: [Comment]
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
 *                          - content
 *                      properties:
 *                          content:
 *                              type: string
 *                              description: Nội dung bình luận
 *                          file:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  format: binary
 *                              description: Các file ảnh đính kèm nếu có
 *                  encoding:
 *                      file:
 *                          style: form
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/CommentResponse'
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






/** Xóa hoàn toàn comment và các replies
 * @swagger
 * /comment/{id}:
 *  delete:
 *      summary: Xóa hoàn toàn comment và các replies
 *      tags: [Comment]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: id của comment gốc
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
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không tìm thấy comment
 *          500:
 *              description: Lỗi thực thi request trên server
 */




