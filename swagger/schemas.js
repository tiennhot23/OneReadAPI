/**
 * @swagger
 * components:
 *  schemas:
 *      Book:
 *          type: object
 *          required: 
 *              - title
 *              - type
 *              - thumb
 *              - theme
 *          properties:
 *              endpoint:
 *                  type: string
 *                  description: The auto generated endpoint for book
 *              title:
 *                  type: string
 *                  description: Title
 *              author:
 *                  type: string
 *                  description: Author
 *                  default: unkown
 *              thumb:
 *                  type: string
 *                  description: Thumb
 *                      <img alt="Example" width=200 height=200 src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg" />
 *              theme:
 *                  type: string
 *                  description: Theme
 *              description:
 *                  type: string
 *                  description: Description
 *                  default: Không có mô tả nào
 *              type:
 *                  type: string
 *                  description: Book type
 *                  enum: [Comic,Novel,Literature]
 *              rating:
 *                  type: number
 *                  description: Rating of book
 *                  format: float
 *                  minimum: 0
 *                  maximum: 5
 *              rate_count:
 *                  type: integer
 *                  description: The number of rate
 *              status:
 *                  type: integer
 *                  description: Status of book 
 *                  default: 0
 *                  enum: [-1 (deleted), 0 (ongoing), 1 (finished)]
 *              search_number:
 *                  type: integer
 *                  description: The number of searches for this book
 *              follow: 
 *                  type: integer
 *                  description: Number of user following book
 *              view:
 *                  type: integer
 *                  description: Number of view
 *              genres:
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/Genre'
 */





/**
 * @swagger
 * components:
 *  schemas:
 *      Chapter:
 *          type: object
 *          required:
 *              - title
 *              - images
 *          properties:
 *              chapter_endpoint:
 *                  type: string
 *                  description: auto generated endpoint of chapter
 *              book_endpoint:
 *                  $ref: '#/components/schemas/Book/properties/endpoint'
 *                  type: string
 *                  description: endpoint of relate book
 *              title:
 *                  type: string
 *                  description: title of chapter
 *              time:
 *                  type: string
 *                  description: the time this chapter init
 *                  format: dd-MM-yyyy hh:mm:ss
 *              images:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: it stores the array of image url in case the type of book is Comic, otherwise it stores the text in the case of Novel and Literature
 */





/**
 * @swagger
 * components:
 *  schemas:
 *      Comment:
 *          type: object
 *          required:
 *              - book_endpoint
 *              - content
 *          properties:
 *              id:
 *                  type: integer
 *                  description: auto generated id of comment
 *              book_endpoint:
 *                  $ref: '#/components/schemas/Book/properties/endpoint'
 *                  type: string
 *                  description: endpoint of relate book
 *              id_root:
 *                  type: integer
 *                  description: id of root comment if this is a reply, otherwise it same as id property
 *              content:
 *                  type: string
 *                  description: what user comment
 *              time:
 *                  type: string
 *                  description: the time this comment are post
 *                  format: dd-MM-yyyy hh:mm:ss
 *              files:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: an array of file url attached with comment
 *              user:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                      avatar:
 *                          type: string
 *                  description: infomation of user who post this comment
 *                  
 */





/**
 * @swagger
 * components:
 *  schemas:
 *      Genre:
 *          type: object
 *          required:
 *              - title
 *          properties:
 *              endpoint:
 *                  type: string
 *                  description: The auto generated endpoint for genre
 *              title:
 *                  type: string
 *                  description: Title
 *              description:
 *                  type: string
 *                  description: Description
 */



/**
 * @swagger
 * components:
 *  schemas:
 *      Notify:
 *          type: object
 *          required:
 *              - content
 *          properties:
 *              endpoint:
 *                  type: string
 *                  description: auto generated endpoint arcording to type of notification
 *                  oneOf: 
 *                      - comment-tag-format: +comment+comment-id
 *                      - book-finished-format: +book+book-endpoint
 *                      - new-chapter-format: +chapter+book-endpoint+chapter-endpoint
 *                      - ban-user-format: +ban+username
 *                      - unban-user-format: +unban+username
 *              username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *                  type: string
 *                  description: user received this notification
 *              content:
 *                  type: string
 *                  description: content of notification
 *              status:
 *                  type: integer
 *                  enum: [0 (unread), 1 (read)]
 *              time:
 *                  type: string
 *                  description: the time this notification init
 *                  format: dd-MM-yyyy hh:mm:ss
 * 
 */




/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - username
 *              - password
 *              - email
 *          properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 *              avatar:
 *                  type: string
 *                  description: avatar url
 *                      <img alt="Example" width=200 height=200 src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg" />
 *                  default: https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg
 *              status:
 *                  type: integer
 *                  description: status of account
 *                  default: 0
 *                  enum: [-1 (banned), 0 (not verify email), 1 (verified email)]
 *              email:
 *                  type: string
 *                  description: email of user
 *              role:
 *                  type: integer
 *                  description: user role (admin and normal user)
 *                  enum: [0 (user), 1 (admin)]
 */