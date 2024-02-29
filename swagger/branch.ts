/**
 * @swagger
 * components:
 *  parameters:
 *      authorization:
 *        in: header
 *        name: authorization
 *        required: true
 *  schemas:
 *  responses:
 *      400:
 *          type: object
 *          properties:
 *              auth:
 *                  type: boolean
 *                  example: false
 *              message:
 *                  type: string
 *                  example: userId is not valid
 *              data:
 *                  type: object
 *                  properties:
 *      500:
 *          description: Returns 500 for server exception
 *          schema:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: number
 *                      example: 500
 *                  error:
 *                      type: string
 *                  message:
 *                      type: string
 */

/**
 * @swagger
 * /branchdetails:
 *   get:
 *     summary: get branch details
 *     tags:
 *       - Branch
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
 *                id:
 *                    type: string
 *                branch:
 *                    type: string
 *                address:
 *                    type: string
 *                city:
 *                    type: string
 *                state:
 *                    type: string
 *                createBy:
 *                    type: object
 *                    properties:
 *                       id:
 *                           type: string
 *                       firstName:
 *                           type: string
 *                       lastName:
 *                           type: string
 *                isAssigned:
 *                    type: boolean
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
 * /update/branchdetails/{branchId}:
 *   put:
 *     summary: Update individual branch using branch id
 *     tags:
 *       - Branch
 *     description: Returns JSON object if update successfully 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *       - in: path
 *         name: branchId
 *         description: branch id to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: "body"
 *         name: "body"
 *         description: "Required single property and value of the object or total updated objects"
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *                branch:
 *                    type: string
 *                address:
 *                    type: string
 *                city:
 *                    type: string
 *                state:
 *                    type: string
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
 * /addbranch:
 *   post:
 *     summary: Create a new branch
 *     tags:
 *       - Branch
 *     description: Returns a empty object if update successfully 
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
 *                branch:
 *                    type: string
 *                address:
 *                    type: string
 *                city:
 *                    type: string
 *                state:
 *                    type: string
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
 */