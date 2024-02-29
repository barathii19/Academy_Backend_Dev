import { metaData } from "../environment/meta-data";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { IPostStaffDetails } from "../model/IStaffDetails";
import { LoginService } from "../service/login-service";
import { staffService } from "../service/staffs-service";
import { LogController } from "./log-controller";

export class staffController {
  static getStaffDetails(request: any, response: any) {
    const creater = decodeJwt(request);
    try {
      if (creater && creater.id) {
        staffService.getStaffDetails(creater.id).then((data) => {
          response.status(200).json(data)
        }).catch((e) => {
          response.status(500).json({ message: LogController.errorMes("staff controller - ", e) })
        })
      } else {
        response.status(500).json({ message: "Invalid credential" })
      }
    } catch (e) {
      LogController.writeLog(
        "Exception in StaffController 1 - getStaffDetails",
        e
      );
      response.status(500).send(
        LogController.errorMes(
          "Exception in StaffController 1 - getStaffDetails",
          e
        )
      );
    }
  }
  static getSpecificStaffDetails(req: any, res: any) {
    const { staffId } = req.params;
    try {
      staffService.getStaffDetailsByStaffId(staffId).then((data: any) => {
        if (data) {
          return res.status(200).json(data);
        } else {
          return res.status(200).json("staff not found");
        }
      });
    } catch (e: any) {
      LogController.writeLog("Exception in staffController - getStaffName", e);
      res.status(500).send(metaData.message.serverError);
    }
  }

  static postStaffDetails(req: any, res: any) {
    const bodyContent: IPostStaffDetails = req.body
    try {
      staffService.createStaff(bodyContent, req).then((data) => {
        res.status(200).json(data)
      }).catch((err) => {
        LogController.writeLog(
          "Exception in staffController - postStaffDetails - 2",
          err
        );
        res.status(500).send(
          LogController.errorMes(
            "Exception in staffController - postStaffDetails - 2",
            err
          )
        )
      })
    } catch (err: any) {
      LogController.writeLog(
        "Exception in staffController - postStaffDetails - 2",
        err
      );
    }
  }

  static updateStaffDetails(request: any, response: any) {
    try {
      let updateId = request.params.id;
      let bodyContent = request.body;
      staffService.updateStaffDetails(updateId, bodyContent)
        .then((res) => {
          response.status(200).json(res)
        }).catch((e) => {
          LogController.writeLog(
            "Exception in StaffController - inupdateStaffDetails",
            e
          );
          response.status(500).send(
            LogController.errorMes(
              "Exception in StaffController - inupdateStaffDetails",
              e
            )
          );
        })
    } catch (e) {
      LogController.writeLog(
        "Exception in StaffController - inupdateStaffDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static deleteStaffDetail(request: any, response: any) {
    try {
      let { id } = request.params;
      staffService
        .deleteStaffDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in staffController - deletestaffDetails",
            e
          );
          response.status(500).json({ message: LogController.errorMes("Warning !", e) });
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in staffController - deletestaffDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getOrganisationsStaffs(request: any, response: any) {
    const { organisationId, branch } = request.params;
    try {
      staffService
        .getOrganisationsStaffs(organisationId, branch)
        .then((data: any) => {
          response.status(200).json(data);
        });
    } catch (e: any) {
      LogController.writeLog("Exception in staffController - getStaffName", e);
      response.status(500).send(metaData.message.serverError);
    }
  }
  static deleteStaffDocumentByDocumentName(request: any, response: any) {
    try {
      const { id, documentName } = request.params;
      staffService
        .deleteStaffDocumentByDocumentName(id, documentName)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in staffController - deletestaffDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in staffController - deletestaffDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
