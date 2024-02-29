import { Request, Response} from "express";
import { NotificationService } from "../service/notification-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";

export class NotificationController {
  static getNotificationDetails(request: Request, response: Response) {
    try {
      let { email, branch, organisationId }: any = request.query;
      NotificationService.getNotificationDetails(email, branch, organisationId)
        .then((res) => {
          // res = res.filter((data) => {
          //   if (
          //     group &&
          //     data["toGroup"]
          //   ) {
          //     return data;
          //   } else if (
          //     branch &&
          //     data["toBranch"]
          //   ) {
          //     return data;
          //   }
          //   else if (
          //     id &&
          //     data["receiverId"]
          //   ) {
          //     return data;
          //   }
          // });
          response.status(200).json(res.reverse());
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in NotificationController - getNotificationDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in NotificationController - getNotificationDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postNotificationDetail(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      bodyContent.isViewed = false;
      NotificationService.postNotificationDetail(bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in NotificationController - postNotificationDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in NotificationController - postNotificationDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static updateNotificationDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      NotificationService.updateNotificationDetail(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in NotificationController - updateNotificationDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in NotificationController - updateNotificationDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static deleteNotificationDetails(request: Request, response: Response) {
    try {
      const id: any = request.params.id;
      NotificationService.deleteNotificationDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - deleteNotificationDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - deleteNotificationDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
