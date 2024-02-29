import { Request, Response } from "express";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { BranchService } from "../service/branch-service";
import { IBranchDetails, IReassignAdmin } from "../model/IBranchDetails";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { sendErrorResponse, sendSuccessResponse } from "../common/api-response";
import { UserService } from "../service/user-service";
import { BatchService } from "../service/batch-service";

export class BranchController {
  static postBranchDetails(request: Request, response: Response) {
    try {
      let bodyContent: IBranchDetails = request.body;
      const creater: any = decodeJwt(request);
      BranchService.postBranchDetails(bodyContent, creater?.id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - postAddBranchDetails",
            e
          );
          response.status(500).send(e);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - postAddBranchDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getBranchDetails(request: Request, response: Response) {
    try {
      BranchService.getBranchDetails(request)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - getBranchDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - getBranchDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getSpecificBranchDetails(request: Request, response: Response) {
    const { organisationId } = request.params;
    try {
      BranchService.getSpecificBranchDetails(organisationId)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - getSpecificBranchDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - getSpecificBranchDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static updateBranchDetail(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      BranchService.updateBranchDetail(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - updateBranchDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - updateBranchDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static deleteBranchDetail(request: Request, response: Response) {
    try {
      const id: any = request.params.id;
      BranchService.deleteBranchDetail(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - deleteBranchDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - deleteBranchDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getSpecificBranchByOrganisationId(
    request: Request,
    response: Response
  ) {
    try {
      const id: any = request.params.id;
      BranchService.getSpecificBranchByOrganisationId(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - getSpecificBranchDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - getSpecificBranchDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static reassignBranchAdmin(request: Request, response: Response) {
    const bodyData: IReassignAdmin = request.body;
    try {
      BranchService.reassignAdmin(bodyData);
    } catch (e) {
      LogController.writeLog(
        "Exception in reassignBranchAdmin - reassignBranchAdmin",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  /**
   * get staff details
   * @param request
   * @param response
   */
  static getStaffByBranch(request: Request, response: Response) {
    try {
      const branchId: string = request.params.branchId;
      const userGroup: string = "staff";
      console.log(branchId);

      BranchService.isBranchExist(branchId).then((branchData) => {
        if (branchData.length === 1) {
          UserService.getUserDetailsByBranchAndGroup(branchId, userGroup).then(
            (userData) => {
              sendSuccessResponse(response, 200, "get Staff Details Success", {
                userData,
              });
            }
          );
        } else if (branchData.length > 1) {
          sendErrorResponse(
            response,
            400,
            `Multiple Branch Exist}`,
            "Invalid Branch"
          );
        } else {
          sendErrorResponse(
            response,
            400,
            `Branch ${metaData.message.notExist}`,
            "Invalid Branch"
          );
        }
      });
    } catch (error) {
      LogController.writeLog(
        "Exception in BatchController - getStaffByBranch",
        error
      );
      sendErrorResponse(response, 500, metaData.message.serverError, error);
    }
  }
  /**
   * get Student Details
   * @param request
   * @param response
   */
  static getStudentsByBranch(request: Request, response: Response) {
    try {
      const branchId: string = request.params.branchId;
      const userGroup: string = "student";
      BranchService.isBranchExist(branchId).then((branchData) => {
        if (branchData.length === 1) {
          UserService.getUserDetailsByBranchAndGroup(branchId, userGroup).then(
            (userData) => {
              sendSuccessResponse(response, 200, "get User Details Success", {
                userData,
              });
            }
          );
        } else if (branchData.length > 1) {
          sendErrorResponse(
            response,
            400,
            `Multiple Branch Exist}`,
            "Invalid Branch"
          );
        } else {
          sendErrorResponse(
            response,
            400,
            `Branch ${metaData.message.notExist}`,
            "Invalid Branch"
          );
        }
      });
    } catch (error) {
      LogController.writeLog(
        "Exception in BatchController - getStudentsByBranch",
        error
      );
      sendErrorResponse(response, 500, metaData.message.serverError, error);
    }
  }
  /**
   * get Batch Details
   * @param request
   * @param response
   */
  static getBatchByBranch(request: Request, response: Response) {
    try {
      const branchId: string = request.params.branchId;
      BranchService.isBranchExist(branchId).then((branchData) => {
        if (branchData.length === 1) {
          BatchService.getBatchByBranch(branchId).then((branchData) => {
            sendSuccessResponse(response, 200, "get Branch Details Success", {
              branchData,
            });
          });
        } else if (branchData.length > 1) {
          sendErrorResponse(
            response,
            400,
            `Multiple Branch Exist}`,
            "Invalid Branch"
          );
        } else {
          sendErrorResponse(
            response,
            400,
            `Branch ${metaData.message.notExist}`,
            "Invalid Branch"
          );
        }
      });
    } catch (error) {
      LogController.writeLog(
        "Exception in BatchController - getBatchByBranch",
        error
      );
      sendErrorResponse(response, 500, metaData.message.serverError, error);
    }
  }
}
