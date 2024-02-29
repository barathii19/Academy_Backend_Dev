import { Request, Response, NextFunction } from "express";
import { AdminService } from "../service/admin-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { IPostAdminDetils } from "../model/IAdminDetails";

export class AdminController {
  static getAdminDetails(request: Request, response: Response) {
    try {
      AdminService.getAdminDetails()
        .then((data: any) => {
          const adminDetails = data.map((document:any)=>{
            const doc = {...document}
            delete doc.password;
            return doc
          }) 
          response.status(200).json(adminDetails);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - getAdminDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - getAdminDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getApprovalDetails(request: Request, response: Response) {
    let {start,end,field,value,sort }:any =request.query
    
    try {
      AdminService.getApprovalDetails()
        .then((data: any) => {
          const totaldata = {
            count: data.length,
            data,
          };
          response.status(200).json(totaldata);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - getApprovalDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
     
      LogController.writeLog(
        "Exception in AdminController - getApprovalDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  

  static getSpecificAdminDetail(request: Request, response: Response) {
    try {
      let id = request.params.id;
      AdminService.getSpecificAdminDetails(id)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - getSpecificStudentDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - getSpecificStudentDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postAdminDetail(request: Request, response: Response) {
    try {
      let bodyContent:IPostAdminDetils = request.body;
      AdminService.postAdminDetail(bodyContent)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - postAdminDetail",
            e
          );
          response.status(500).send(LogController.errorMes(
            "Exception in AdminController - postAdminDetail",
            e
          ));
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - postAdminDetail",
        e
      );
      response.status(500).send(
        LogController.errorMes(
          "Exception in AdminController - postAdminDetail",
          e
        )
      );
    }
  }
  static postAdminDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      AdminService.postAdminDetails(bodyContent)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - postAdminDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - postAdminDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static updateAdminDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;

      AdminService.updateAdminDetail(id, bodyContent)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - updateAdminDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - updateAdminDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static deleteAdminDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      AdminService.deleteAdminDetail(id)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - deleteAdminDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - deleteAdminDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postApprovalDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      AdminService.postApprovalDetails(bodyContent)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - postAdminDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - postAdminDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static deleteApprovalDetails(request: any, response: any) {
    try {
      let id = request.params.id;
      AdminService.deleteApprovalDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in AdminController - deleteApprovalDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - deleteApprovalDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postUploadDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      AdminService.postUploadDetails(bodyContent)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AdminController - postAdminDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdminController - postAdminDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

}
