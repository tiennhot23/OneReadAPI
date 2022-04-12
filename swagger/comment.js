

/**
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
 *      responses:
 *          200:
 *              description: Request thành công
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/response/CommentResponse'
 *          400: 
 *              description: Bad Request - Thiếu các tham số đầu vào bắt buộc, hoặc dữ liệu không đúng với ràng buộc
 *          500:
 *              description: Lỗi thực thi request trên server
 */
