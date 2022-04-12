/**  
 *  @swagger
 * components:
 *  response:
 *      BookResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              page:
 *                  type: integer
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          endpoint:
 *                              type: string
 *                          title:
 *                              type: string
 *                          author:
 *                              type: string
 *                          thumb:
 *                              type: string
 *                          theme:
 *                              type: string
 *                          description:
 *                              type: string
 *                          type:
 *                              type: string
 *                          rating:
 *                              type: number
 *                          rate_count:
 *                              type: integer
 *                          status:
 *                              type: integer
 *                          search_number:
 *                              type: integer
 */


/**  
 * @swagger
 * components:
 *  response:
 *      DetailBookResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          endpoint:
 *                              type: string
 *                          title:
 *                              type: string
 *                          author:
 *                              type: string
 *                          thumb:
 *                              type: string
 *                          theme:
 *                              type: string
 *                          description:
 *                              type: string
 *                          type:
 *                              type: string
 *                          rating:
 *                              type: number
 *                          rate_count:
 *                              type: integer
 *                          status:
 *                              type: integer
 *                          search_number:
 *                              type: integer
 *                          follow:
 *                              type: integer
 *                          view:
 *                              type: integer
 *                          genres:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Genre'
 */

/**  
 * @swagger
 * components:
 *  response:
 *      UserResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          avatar:
 *                              type: string
 *                          status:
 *                              type: integer
 *                          email:
 *                              type: string
 *                          role:
 *                              type: integer
 */


/**  
 * @swagger
 * components:
 *  response:
 *      CommentResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          id_root:
 *                              type: integer
 *                          book_endpoint:
 *                              type: string
 *                          content:
 *                              type: string
 *                          files:
 *                              type: array
 *                              items: 
 *                                  type: string
 *                          time:
 *                              type: string
 *                              format: dd-MM-yyyy hh:mm:ss
 *                          user:
 *                              type: object
 *                              properties:
 *                                  username: 
 *                                      type: string
 *                                  avatar:
 *                                      type: string
 *                                  status:
 *                                      type: integer
 *                                  email:
 *                                      type: string
 *                                  role: 
 *                                      type: integer
 */


/**  
 * @swagger
 * components:
 *  response:
 *      DetailCommentResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          id_root:
 *                              type: integer
 *                          book_endpoint:
 *                              type: string
 *                          content:
 *                              type: string
 *                          files:
 *                              type: array
 *                              items: 
 *                                  type: string
 *                          time:
 *                              type: string
 *                              format: dd-MM-yyyy hh:mm:ss
 *                          reply:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                      id_root:
 *                                          type: integer
 *                                      book_endpoint:
 *                                          type: string
 *                                      content:
 *                                          type: string
 *                                      files:
 *                                          type: array
 *                                          items: 
 *                                              type: string
 *                                      time:
 *                                          type: string
 *                                          format: dd-MM-yyyy hh:mm:ss
 *                                      user:
 *                                          type: object
 *                                          properties:
 *                                              username: 
 *                                                  type: string
 *                                              avatar:
 *                                                  type: string
 *                                              status:
 *                                                  type: integer
 *                                              email:
 *                                                  type: string
 *                                              role: 
 *                                                  type: integer
 *                          user:
 *                              type: object
 *                              properties:
 *                                  username: 
 *                                      type: string
 *                                  avatar:
 *                                      type: string 
 *                                  status:
 *                                      type: integer
 *                                  email:
 *                                      type: string
 *                                  role: 
 *                                      type: integer   
 */


/**  
 * @swagger
 * components:
 *  response:
 *      HistoryReadResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          book:
 *                              type: object
 *                              properties:
 *                                  endpoint:
 *                                      type: string
 *                                  title:
 *                                      type: string
 *                                  author:
 *                                      type: string
 *                                  thumb:
 *                                      type: string
 *                                  theme:
 *                                      type: string
 *                                  description:
 *                                      type: string
 *                                  type:
 *                                      type: string
 *                                  rating:
 *                                      type: number
 *                                  rate_count:
 *                                      type: integer
 *                                  status:
 *                                      type: integer
 *                                  search_number:
 *                                      type: integer
 *                          chapter:
 *                              type: object
 *                              properties:
 *                                  chapter_endpoint:
 *                                      type: string
 *                                  book_endpoint:
 *                                      type: string
 *                                  title:
 *                                      type: string
 *                                  time:
 *                                      type: string
 *                          time:
 *                              type: string
 */



/**  
 * @swagger
 * components:
 *  response:
 *      ChapterResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          chapter_endpoint:
 *                              type: string
 *                          book_endpoint:
 *                              type: string
 *                          title:
 *                              type: string
 *                          time:
 *                              type: string
 */



/**  
 * @swagger
 * components:
 *  response:
 *      DetailChapterResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          chapter_endpoint:
 *                              type: string
 *                          book_endpoint:
 *                              type: string
 *                          title:
 *                              type: string
 *                          time:
 *                              type: string
 *                          images:
 *                              type: array
 *                              items:
 *                                  type: string
 */


/**  
 * @swagger
 * components:
 *  response:
 *      LoginResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                              accessToken:
 *                                  type: string
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      username: 
 *                                          type: string
 *                                      avatar:
 *                                          type: string
 *                                      status:
 *                                          type: integer
 *                                      email:
 *                                          type: string
 *                                      role:
 *                                          type: integer
 */


/**  
 * @swagger
 * components:
 *  response:
 *      GenreResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                              endpoint:
 *                                  type: string
 *                              title:
 *                                  type: string
 *                              description:
 *                                  type: string
 */



/**  
 * @swagger
 * components:
 *  response:
 *      NotifyResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                              endpoint:
 *                                  type: string
 *                              username:
 *                                  type: string
 *                              content:
 *                                  type: string
 *                              status:
 *                                  type: integer
 *                              time:
 *                                  type: string
 */


/**  
 * @swagger
 * components:
 *  response:
 *      MessageResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: success
 *              code:
 *                  type: integer
 *                  default: 200
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  default: null
 *      NotFoundResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: fail
 *              code:
 *                  type: integer
 *                  default: 404
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  default: null
 *      BadRequestResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: fail
 *              code:
 *                  type: integer
 *                  default: 400
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  default: null
 *      ForbiddenResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: fail
 *              code:
 *                  type: integer
 *                  default: 403
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  default: null
 *      UnauthorizedResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: fail
 *              code:
 *                  type: integer
 *                  default: 401
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  default: null
 *      ServerErrorResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  default: fail
 *              code:
 *                  type: integer
 *                  default: 500
 *              message:
 *                  type: string
 *              data:
 *                  type: array
 *                  default: null
 */

/**   
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  schemas:
 *      ApiResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  enum: [success, fail]
 *              code:
 *                  type: integer
 *                  description: code request
 *              message:
 *                  type: string
 *                  description: message
 *              page:
 *                  type: integer
 *                  description: current page number in pagination
 *              data:
 *                  type: array
 *                  items:
 *                      oneOf: 
 *                          - $ref: '#/components/schemas/Book'
 *                          - $ref: '#/components/schemas/Chapter'
 *                          - $ref: '#/components/schemas/Comment'
 *                          - $ref: '#/components/schemas/Genre'
 *                          - $ref: '#/components/schemas/Notify'
 *                          - $ref: '#/components/schemas/User'
 *      
*/

/**
 * @swagger
 * tags:
 *      name: Book
 */
/**
 * @swagger
 * tags:
 *      name: Chapter
 */
/**
 * @swagger
 * tags:
 *      name: Comment
 */
/**
 * @swagger
 * tags:
 *      name: Genre
 */
/**
 * @swagger
 * tags:
 *      name: Notify
 */
/**
 * @swagger
 * tags:
 *      name: User
 */
