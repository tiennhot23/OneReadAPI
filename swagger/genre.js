

/** Lấy toàn bộ tag thể loại
 * @swagger
 * /genre/all:
 *  get:
 *      summary: Lấy toàn bộ tag thể loại
 *      tags: [Genre]
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/GenreResponse'
 *          500:
 *              description: Lỗi thực thi request trên server
 */





/** Thêm genre
 * @swagger
 * /genre:
 *  post:
 *      summary: Thêm genre
 *      tags: [Genre]
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
 *                              description: Tên thể loại
 *                          description:
 *                              type: string
 *                              description: Mô tả tóm tắt thể loại
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/GenreResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */


/** Sửa thông tin genre
 * @swagger
 * /genre/{endpoint}:
 *  patch:
 *      summary: Sửa thông tin genre
 *      tags: [Genre]
 *      parameters:
 *          - in: path
 *            name: endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của thể loại
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: Tên thể loại
 *                          description:
 *                              type: string
 *                              description: Mô tả tóm tắt thể loại
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/GenreResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404:
 *              description: Not Found - Không tìm thấy thể loại
 *          500:
 *              description: Lỗi thực thi request trên server
 */




/** Xóa hoàn toàn thể loại
 * @swagger
 * /genre/{endpoint}:
 *  delete:
 *      summary: Xóa hoàn toàn thể loại
 *      tags: [Genre]
 *      parameters:
 *          - in: path
 *            name: endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của thể loại
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/GenreResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không tìm thấy thể loại
 *          500:
 *              description: Lỗi thực thi request trên server
 */




