import { createTransport } from "nodemailer";
import { IEmailDetails } from "../model/IEmailDetails";
import { metaData } from "../environment/meta-data";
import { EmailService } from "../service/email-service";
import { LogController } from "./log-controller";
import { Request, Response } from "express";

export class EmailController {
  static transporter = createTransport({
    host: metaData.email.host,
    port: metaData.email.port,
    auth: {
      user: metaData.email.fromEmail,
      pass: metaData.email.password,
    },
    logger: true,
  });

  static async sendMail(emailDetails: IEmailDetails) {
    return this.transporter
      .sendMail({
        from: emailDetails.fromEmail,
        to: emailDetails.toEmail,
        subject: emailDetails.subject,
        html: emailDetails.body,
      })
      .then((info: any) => {
        return { status: true, message: info.response };
      })
      .catch((e: any) => {
        return { status: false, message: e.message };
      });
  }

  static getEmailDetails(request: Request, response: Response) {
    try {
      EmailService.getEmailDetails()
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in EmailController - getEmailDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in EmailController - getEmailDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postEmailDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      let userID: any;
      EmailService.generateUserID().then((id) => {
        userID = id;
        let password = EmailService.generatePassword();
        bodyContent = {
          ...bodyContent,
          id: id,
          createdDate: new Date(),
        };
        EmailService.postEmailDetails(bodyContent)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            LogController.writeLog(
              "Exception in CourseController - postEmailDetails",
              e
            );
            response.status(500).send(metaData.message.serverError);
          });
      });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - postEmailDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
