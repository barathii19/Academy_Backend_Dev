import { Request, Response} from "express";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { homeService } from "../service/home-service";

export class HomeController {
  static getCardDetails(request: Request, response: Response) {
    try {
      homeService
        .getCardDetails(
          request.query.id,
          request.query.group,
          request.query.branch
        )
        .then((data) => {

          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in HomeController - getCardDetails",
            e
          );
          response.status(500).send({ auth: false, message: "Server Error" });
        });
    } catch (e) {
      LogController.writeLog("Exception in HomeController - getCardDetails", e);

      response.status(500).send(metaData.message.serverError);
    }
  }
  static getPaymentDetails(request: Request, response: Response) {
    try {
      homeService.getPaymentDetails(
        request.query.id,
        request.query.group,
        request.query.branch
      );
         } catch (e) {
      LogController.writeLog(
        "Exception in HomeController - getPaymentDetails",
        e
      );

      response.status(500).send(metaData.message.serverError);
    }
  }
  static getBatchDetails(request: Request, response: Response) {
    try {
      homeService
        .getBatchDetails(
          request.query.id,
          request.query.group,
          request.query.branch
        )
        .then((data) => {           
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in HomeController - getBatchDetails",
            e
          );
          response.status(500).send({ auth: false, message: "Server Error" });
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in HomeController - getBatchDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
