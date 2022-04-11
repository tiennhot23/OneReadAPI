

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
 *              description: Bad Request - thiếu các tham số bắt buộc book_endpoint
 *          500:
 *              description: Lỗi thực thi request trên server
 */
