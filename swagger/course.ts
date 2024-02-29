/**
 * @swagger
 * components:
 *   parameters:
 *       authorization:
 *           in: header
 *           name: authorization
 *           required: true
 */

/**
 * @swagger
 * /coursedetails:
 *   get:
 *     summary: get course details
 *     tags:
 *       - Course
 *     description: Returns a array of objects 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *     responses:
 *       200:
 *         description: Returns a JSON object if authenticate successfully
 *         schema:
 *           type: object
 *           properties:
 *                id:
 *                    type: string
 *                courseName:
 *                    type: string
 *                description:
 *                    type: string
 *                actualPrice:
 *                    type: string
 *                offerPrice:
 *                    type: string
 *                modules:
 *                    type: array
 *                    items:
 *                       type: object
 *                       properties:
 *                          moduleName:
 *                              type: string
 *                          description:
 *                              type: string
 *                          topics:
 *                              type: array
 *                              items:
 *                                 type: object
 *                                 properties:
 *                                     topic: 
 *                                         type: string
 *                                     description: 
 *                                         type: string
 * 
 *       500:
 *         description: Returns a string if failed
 *         schema:
 *           type: string
 * 
 * /update/coursedetail/{courseId}:
 *   put:
 *     summary: Update individual course details using course id
 *     tags:
 *       - Course
 *     description: Returns JSON object if update successfully 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *       - in: "body"
 *         name: "body"
 *         description: "Required single property and value of the object or total updated objects"
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *                courseName:
 *                    type: string
 *                description:
 *                    type: string
 *                actualPrice:
 *                    type: string
 *                offerPrice:
 *                    type: string
 *                modules:
 *                    type: array
 *                    items:
 *                       type: object
 *                       properties:
 *                          moduleName:
 *                              type: string
 *                          description:
 *                              type: string
 *                          topics:
 *                              type: array
 *                              items:
 *                                 type: object
 *                                 properties:
 *                                     topic: 
 *                                         type: string
 *                                     description: 
 *                                         type: string
 *     
 *     responses:
 *       200:
 *         description: Returns a JSON object if update successfully
 *         schema:
 *           type: object
 *           properties:
 *                acknowledged:
 *                    type: boolean
 *                modifiedCount:
 *                    type: number 
 *
 *       500:
 *         description: Returns a string if update failled
 *         schema:
 *           type: string
 * 
 * /coursedetail:
 *   post:
 *     summary: Create an course
 *     tags:
 *       - Course
 *     description: Returns an empty object if update successfully 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *       - in: "body"
 *         name: "body"
 *         description: "Required object of details"
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *                courseName:
 *                    type: string
 *                description:
 *                    type: string
 *                actualPrice:
 *                    type: string
 *                offerPrice:
 *                    type: string
 *                modules:
 *                    type: array
 *                    items:
 *                       type: object
 *                       properties:
 *                          moduleName:
 *                              type: string
 *                          description:
 *                              type: string
 *                          topics:
 *                              type: array
 *                              items:
 *                                 type: object
 *                                 properties:
 *                                     topic: 
 *                                         type: string
 *                                     description: 
 *                                         type: string
 *                   
 *     responses:
 *       200:
 *         description: Returns a JSON object if branch added successfully
 *         schema:
 *           type: object
 *           properties:
 *                acknowledged:
 *                    type: boolean
 *                insertedId:
 *                    type: string  
 *       500:
 *         description: Returns a string if failled
 *         schema:
 *           type: string 
 * 
 * /d/coursedetails/{courseId}:
 *   delete:
 *     summary: Delete an coursedetail
 *     tags:
 *       - Course
 *     description: Returns an empty if delete successfully 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *
 *     responses:
 *       200:
 *         description: Returns status 200 if course deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *                acknowledged:
 *                    type: boolean
 *                deletedCount:
 *                    type: number 
 *  
 *       500:
 *         description: Returns a string if failled
 *         schema:
 *           type: string
 */
