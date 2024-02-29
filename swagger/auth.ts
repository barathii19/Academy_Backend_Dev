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
 * /login:
 *   post:
 *     summary: get login details
 *     tags:
 *       - Auth
 *     description: Returns a JSON object if id is match
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Required userId and password"
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *              userName:
 *                  type: string
 *              password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Returns a JSON object if login is verified
 *         schema:
 *           type: object
 *           properties:
 *              auth:
 *                  type: boolean
 *              message:
 *                  type: string
 *              data:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *       400:
 *          description: Returns 400 if mobileNumber is not valid
 *          schema:
 *              $ref:   '#components/responses/400'
 *       500:
 *          $ref:   '#/components/responses/500'
 */