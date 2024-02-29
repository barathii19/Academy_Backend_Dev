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
 * /admindetail:
 *   post:
 *     summary: Create a new admin
 *     tags:
 *       - Admin
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
 *                firstName:
 *                    type: string
 *                lastName:
 *                    type: string
 *                mobileNumber:
 *                    type: string
 *                email:
 *                    type: string
 *                assignedBranch:
 *                    type: object
 *                    properties:
 *                       id:
 *                           type: string
 *                       name:
 *                           type: string
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
 * /d/admindetails/{adminId}:
 *   delete:
 *     summary: Delete an admindetail
 *     tags:
 *       - Admin
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
 *         description: Returns status 200 if admin deleted successfully
 *  
 *       500:
 *         description: Returns a string if failled
 *         schema:
 *           type: string
 * 
 * /admindetails:
 *   get:
 *     summary: get admin details
 *     tags:
 *       - Admin
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
 *                firstName:
 *                    type: string
 *                lastName:
 *                    type: string
 *                mobileNumber:
 *                    type: string
 *                email:
 *                    type: string
 *                assignedBranch:
 *                    type: object
 *                    properties:
 *                       id:
 *                           type: string
 *                       name:
 *                           type: string
 *                password:
 *                    type: string
 *                userGroup:
 *                    type: string
 *                isActive:
 *                    type: boolean
 * 
 *       500:
 *         description: Returns a string if failed
 *         schema:
 *           type: string
 * 
 * /update/admindetails/{adminId}:
 *   put:
 *     summary: Update individual admin using admin id
 *     tags:
 *       - Admin
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
 *                firstName:
 *                    type: string
 *                lastName:
 *                    type: string
 *                mobileNumber:
 *                    type: string
 *                email:
 *                    type: string
 *                assignedBranch:
 *                    type: object
 *                    properties:
 *                       id:
 *                           type: string
 *                       name:
 *                           type: string
 *                password:
 *                    type: string
 *                userGroup:
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
 *
 *       500:
 *         description: Returns a string if update failled
 *         schema:
 *           type: string 
 * 
 * /admindetails/{adminId}:
 *   get:
 *     summary: get specific admin detail
 *     tags:
 *       - Admin
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
 *                firstName:
 *                    type: string
 *                lastName:
 *                    type: string
 *                mobileNumber:
 *                    type: string
 *                email:
 *                    type: string
 *                assignedBranch:
 *                    type: object
 *                    properties:
 *                       id:
 *                           type: string
 *                       name:
 *                           type: string
 *                password:
 *                    type: string
 *                userGroup:
 *                    type: string
 *                isActive:
 *                    type: boolean
 * 
 *       500:
 *         description: Returns a string if failed
 *         schema:
 *           type: string
 *
 */
