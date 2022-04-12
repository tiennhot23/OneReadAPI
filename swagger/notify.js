

/** Lấy toàn bộ thông báo theo trang
 * @swagger
 * /notify/all:
 *  get:
 *      summary: Lấy toàn bộ thông báo theo trang
 *      tags: [Notify]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotifyResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */




/** Lấy thông tin của một thông báo và cập nhật trạng thái của nó thành đã đọc
 * @swagger
 * /notify/{endpoint}:
 *  get:
 *      summary: Lấy thông tin của một thông báo và cập nhật trạng thái của nó thành đã đọc
 *      tags: [Notify]
 *      parameters:
 *          - in: path
 *            name: endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của thông báo
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotifyResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404:
 *              description: Not Found - Không tìm thấy thông báo
 *          500:
 *              description: Lỗi thực thi request trên server
 */




/** Xóa các thông báo đã đọc
 * @swagger
 * /notify/all-read:
 *  delete:
 *      summary: Xóa các thông báo đã đọc
 *      tags: [Notify]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotifyResponse'
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          500:
 *              description: Lỗi thực thi request trên server
 */




/** Xóa một thông báo
 * @swagger
 * /notify/{endpoint}:
 *  delete:
 *      summary: Xóa một thông báo
 *      tags: [Notify]
 *      parameters:
 *          - in: path
 *            name: endpoint
 *            required: true
 *            schema:
 *              type: string
 *            description: endpoint của thông báo
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/NotifyResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          401: 
 *              description: Unauthorized - Không thể xác thực yêu cầu
 *          403: 
 *              description: Forbidden - Tài khoản không đủ quyền để thực thi yêu cầu
 *          404: 
 *              description: Not Found - Không tìm thấy thông báo
 *          500:
 *              description: Lỗi thực thi request trên server
 */




