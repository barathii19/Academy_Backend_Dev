import { Request, Response } from "express";
import { BatchService } from "../service/batch-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { MongoService } from "../service/mongo-service";
import { EmailController } from "./email-controller";
import { ApplyService } from "../service/apply-service";

export class ApplyController {

  static getApplyDetails(request: Request, response: Response) {

    try {
      ApplyService.getApplyDetails()
        .then((data: any) => {

          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in ApplyController - getApplyDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {

      LogController.writeLog(
        "Exception in ApplyController - getApplyDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postApplyDetails(request: Request, response: Response) {
    // try {
    //   let bodyContent = request.body;
    //   console.log(bodyContent);

    //   ApplyService.postApplyDetails(bodyContent)
    //       .then((data) => {
    //           if(data){
    //             EmailController.sendMail({
    //                 fromEmail: metaData.email.fromEmail,
    //                 body: metaData.email.template.newUser
    //                   .replace("$fromDate",bodyContent.fromDate )
    //                   .replace("$toDate", bodyContent.toDate),
    //                 subject: "Apply Leave - CRUD",
    //                 toEmail: bodyContent.email,
    //               });
    //           }

    //         response.status(200).json(data);
    //       })
    //       .catch((e) => {
    //         LogController.writeLog(
    //           "Exception in ApplyController - postApplyDetails",
    //           e
    //         );
    //         response.status(500).send(metaData.message.serverError);
    //       });
    // } catch (e) {
    //   LogController.writeLog(
    //     "Exception in ApplyController - postApplyDetails",
    //     e
    //   );
    //   response.status(500).send(metaData.message.serverError);
    // }
  }




}