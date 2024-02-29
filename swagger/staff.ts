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
 * /staffdetail:
 *   post:
 *     summary: Create a new admin
 *     tags:
 *       - Staff
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
 *                name:
 *                    type: string
 *                mobileNumber:
 *                    type: string
 *                email:
 *                    type: string
 *                field:
 *                    type: array
 *                    items:
 *                       type: string  
 *                branch:
 *                    type: string
 *                userGroup:
 *                    type: string
 * 
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
 * /d/staffdetails/{staffId}:
 *   delete:
 *     summary: Delete an staffdetail
 *     tags:
 *       - Staff
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
 * 
 * /update/staffdetails/{staffId}:
 *   put:
 *     summary: Update individual Staff details using Staff id
 *     tags:
 *       - Staff
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
 *                name:
 *                    type: string
 *                mobileNumber:
 *                    type: string
 *                email:
 *                    type: string
 *                field:
 *                    type: array
 *                    items:
 *                       type: string  
 *                branch:
 *                    type: string
 *                userGroup:
 *                    type: string
 *                password:
 *                    type: string
 *                address:
 *                    type: string
 *                bloodGroup:
 *                    type: string
 *                city:
 *                    type: string
 *                district:
 *                    type: string
 *                dob:
 *                    type: string
 *                firstName:
 *                    type: string
 *                lastName:
 *                    type: string
 *                gender:
 *                    type: string
 *                state:
 *                    type: string
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
 */