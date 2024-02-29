import express from "express";
import { BranchController } from "../controller/branch-controller";
const branchRouter = express.Router();

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
 * /api/v1/branch/getStaff/{branchId}/:
 *   get:
 *     summary: get Staff for a particular branch id
 *     tags:
 *       - Users
 *     description: Returns an Staff Users Array of Objects if branch is found 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *       - in: path
 *         name: branchId
 *         description: "Branch Id"
 *         required: true
 *         schema:
 *           type: string   
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
 */
branchRouter.get("/getStaff/:branchId/", BranchController.getStaffByBranch);

/**
 * @swagger
 * /api/v1/branch/getStudents/{branchId}/:
 *   get:
 *     summary: get Students for a particular branch id
 *     tags:
 *       - Users
 *     description: Returns an Students Users Array of Objects if branch is found 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *       - in: path
 *         name: branchId
 *         description: "Branch Id"
 *         required: true
 *         schema:
 *           type: string            
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
 */
branchRouter.get("/getStudents/:branchId/", BranchController.getStudentsByBranch);

/**
 * @swagger
 * /api/v1/branch/getBatch/{branchId}/:
 *   get:
 *     summary: get Batch for a particular branch id
 *     tags:
 *       - Batch
 *     description: Returns an Batch Users Array of Objects if branch is found 
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#components/parameters/authorization'
 *       - in: path
 *         name: branchId
 *         description: "Branch Id"
 *         required: true
 *         schema:
 *           type: string            
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
 */
branchRouter.get("/getBatch/:branchId/", BranchController.getBatchByBranch);
export default branchRouter;
