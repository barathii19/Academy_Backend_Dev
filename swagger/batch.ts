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
 * /batchdetail:
 *   post:
 *     summary: Create a new Batch
 *     tags:
 *       - Batch
 *     description: Returns an empty object if update successfully. 
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
 *                batchName:
 *                    type: string
 *                duration:
 *                    type: object
 *                    properties:
 *                        startDate:
 *                            type: string
 *                        endDate:
 *                            type: string
 *                        timing:
 *                            type: object
 *                            properties:
 *                               from:
 *                                   type: string
 *                               to:
 *                                   type: string
 *                course:
 *                    type: object
 *                    properties:
 *                       id:
 *                           type: string
 *                       name:
 *                           type: string
 *                inCharge:
 *                    type: object
 *                    properties:
 *                       id:
 *                           type: string
 *                       name:
 *                           type: string
 *                branch:
 *                    type: string
 *                creater:
 *                    type: string
 *                studentList:
 *                    type: array
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
 * /batchdetails:
 *   get:
 *     summary: get batch details
 *     tags:
 *       - Batch
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *                  id:
 *                      type: string
 *                  batchName:
 *                      type: string
 *                  duration:
 *                      type: object
 *                      properties:
 *                          startDate:
 *                              type: string
 *                          endDate:
 *                              type: string
 *                          timing:
 *                              type: object
 *                              properties:
 *                                 from:
 *                                     type: string
 *                                 to:
 *                                     type: string
 *                  course:
 *                      type: object
 *                      properties:
 *                         id:
 *                             type: string
 *                         name:
 *                             type: string
 *                  inCharge:
 *                      type: object
 *                      properties:
 *                         id:
 *                             type: string
 *                         name:
 *                             type: string
 *                  branch:
 *                      type: string
 *                  creater:
 *                      type: string
 *                  studentList:
 *                      type: array
 *       500:
 *         description: Returns a JSON object if authenticate successfully
 *         schema:
 *           type: object
 *           properties:
 *             auth:
 *               type: boolean
 *             message:
 *               type: string  
 * 
 * /update/batchdetails/delicate/{batchId}:
 *   post:
 *     summary: Update individual batch using batch id
 *     tags:
 *       - Batch
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
 *             type: object
 *             properties:
 *                  batchName:
 *                      type: string
 *                  duration:
 *                      type: object
 *                      properties:
 *                          startDate:
 *                              type: string
 *                          endDate:
 *                              type: string
 *                          timing:
 *                              type: object
 *                              properties:
 *                                 from:
 *                                     type: string
 *                                 to:
 *                                     type: string
 *                  course:
 *                      type: object
 *                      properties:
 *                         id:
 *                             type: string
 *                         name:
 *                             type: string
 *                  inCharge:
 *                      type: object
 *                      properties:
 *                         id:
 *                             type: string
 *                         name:
 *                             type: string
 *                  branch:
 *                      type: string
 *                  creater:
 *                      type: string
 *                  studentList:
 *                      type: array
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
 *       500:
 *         description: Returns a string if update failled
 *         schema:
 *           type: string 
 * 
 * /d/batchdetails/{batchId}:
 *   delete:
 *     summary: Delete an batchdetail
 *     tags:
 *       - Batch
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