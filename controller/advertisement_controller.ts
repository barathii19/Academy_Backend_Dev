import { Request, Response,  } from "express";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { AdvertisementService } from "../service/advertisement-service"; 

export class AdvertisementController {
static getAdvertisementDetails(request: Request, response: Response) {
  const {organisationId,branch} = request.query;
    try {     
      AdvertisementService.getAdvertisementDetails(organisationId,branch)
        .then((data:any) => {
          response.status(200).json(data);        
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in AdvertisementController - getAdvertisementDetails",
            e
          );
          response.status(500).send(e);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdvertisementController - getAdvertisementDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
 
  static postAdvertisementDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      AdvertisementService.postAdvertisementDetails(bodyContent)
        .then((data) => { 
          response.status(200).json(data);
        })
        
        .catch((e) => {
          LogController.writeLog(
            "Exception in AdvertisementController - postAdvertisementDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      
      LogController.writeLog(
        "Exception in AdvertisementController - postAdvertisementDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static deleteAdvertisementDetails(request: any, response: any) {
    try {
      let id = request.params.id;
      AdvertisementService.deleteAdvertisementDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in AdvertisementController - deleteAdvertisementDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdvertisementController - deleteAdvertisementDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static updateAdvertisementDetail(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      AdvertisementService.updateAdvertisementDetail(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in AdvertisementController - updateAdvertisementDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AdvertisementController - updateAdvertisementDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
 
}