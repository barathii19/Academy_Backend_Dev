import { Request, Response, NextFunction } from "express";
import { OrganisationService } from "../service/new-organisation-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { LoginService } from "../service/login-service";
import { EmailController } from "./email-controller";
export class OrganisationController {
  // static postOrganisationDetails(request: Request, response: Response) {
  //   try {
  //     const bodyContent = request.body;
  //     OrganisationService.postOrganisationDetails({...bodyContent})
  //       .then((data: any) => {
  //         const {organisationName,primaryColor,secondaryColor,description,accountNumber,ifscCode,banckName,upiId,...restData}=bodyContent
  //           let password = LoginService.generatePassword()
  //           LoginService.postLoginDetail({...restData,password})
  //           .then(async (data: any) => {
  //               await EmailController.sendMail({
  //               fromEmail: metaData.email.fromEmail,
  //               body: metaData.email.template.newUser
  //                   .replace("$pwd", password)
  //                   .replace("$userid", bodyContent.email)
  //                   .replace(
  //                     /companyname/g,
  //                     "CRUD"
  //                   ),
  //               subject: "RE:Account creation - CRUD",
  //               toEmail: bodyContent.email,
  //               });
  //               response.status(200).json(data);
  //           })
  //         .catch((e) => {
  //           LogController.writeLog(
  //             "Exception in LoginController - postLoginDetail",
  //             e
  //           );
  //           response.status(500).send(metaData.message.serverError);
  //         });
  //       })
  //       .catch((e: any) => {
  //         LogController.writeLog(
  //           "Exception in OrganisationController - OrganisationControllerDetails",
  //           e
  //         );
  //         response.status(400).send({
  //           auth: false,
  //           message: "Organisation exists with this email",
  //         });
  //       });
  //   } catch (e) {
  //     LogController.writeLog(
  //       "Exception in OrganisationController - OrganisationControllerDetails",
  //       e
  //     );
  //     response.status(500).send(metaData.message.serverError);
  //   }
  // }
  //used only while signin without token
  static getSpecificOrganisationDetails(req: any, res: any) {
    const bodyContent = req.body
    try {
      OrganisationService
        .getSpecificOrganisationDetails(bodyContent)

        .then((data: any) => {
          res.status(200).json(data);
        })

        .catch((e) => {
          LogController.writeLog(
            "Exception in OrganisationController - getspecificdetails",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in OrganisationController - getspecificdetails",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
}
