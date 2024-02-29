import { Request, Response, } from "express";
import { LoginService } from "../service/login-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { EmailController } from "./email-controller";
import { OrganisationService } from "../service/new-organisation-service";
import { readFile } from "fs"
import path from "path";
import { decodeJwt } from "../HelperFunction/jwtHelper";

export class LoginController {
  static getLoginDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      LoginService.getLoginDetails(bodyContent.userName, bodyContent.password)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LoginController - getLoginDetails",
            e
          );
          response.status(401).send(e);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - getLoginDetails",
        e
      );

      response.status(500).send(metaData.message.serverError);
    }
  }

  static postLoginDetail(request: Request, response: Response) {
    // try {
    //   let bodyContent = request.body;
    //   let userID: any;
    //   LoginService.generateUserID(bodyContent).then((id) => {

    //     userID = id;
    //     let password = LoginService.generatePassword();
    //     bodyContent = {
    //       ...bodyContent,
    //       id: id,
    //       changePassword: true,
    //       password: password,
    //       createdDate: new Date(),
    //     };
    //     LoginService.postLoginDetail(bodyContent)
    //       .then((data: any) => {
    //         OrganisationService.getSpecificOrganisation(
    //           bodyContent?.organisationId
    //         ).then((organisation: any) => {
    //           if (organisation) {
    //             EmailController.sendMail({
    //               fromEmail: metaData.email.fromEmail,
    //               body: metaData.email.template.newUser
    //                 .replace("$pwd", password)
    //                 .replace("$userid", userID)
    //                 .replace(
    //                   /companyname/g,
    //                   organisation?.organisationName
    //                 ),
    //               subject: `RE:Account creation - ${organisation?.organisationName}`,
    //               toEmail: bodyContent?.email,
    //             });
    //           }
    //         });
    //         response.status(200).json({ ...data, id });
    //       })
    //       .catch((e) => {
    //         LogController.writeLog(
    //           "Exception in LoginController - postLoginDetail",
    //           e
    //         );
    //         response.status(500).send(metaData.message.serverError);
    //       });
    //   });
    // } catch (e) {
    //   LogController.writeLog(
    //     "Exception in LoginController - postLoginDetail",
    //     e
    //   );
    //   response.status(500).send(metaData.message.serverError);
    // }
  }

  static getSpecificUserDetail(request: Request, response: Response) {
    const { id } = request.params;
    try {
      LoginService.getSpecificUserDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LoginController - getSpecificUserDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - getSpecificUserDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static updateLoginDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      LoginService.updateLoginDetail(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LoginController - updateLoginDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - updateLoginDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static changePasswordDetail(request: Request, response: Response) {
    try {
      let { id } = decodeJwt(request);
      let { currentPassword, newPassword, confirmPassword } = request.body;

      if (newPassword && currentPassword && confirmPassword && (newPassword === confirmPassword)) {
        if (newPassword.length < 8) {
          response.status(500).json({ message: "Password should have 8 characters" })
          return
        }
        LoginService.changePasswordDetail(id, request.body)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json(e)
          });
      } else {
        response.status(500).json({ message: "Password Mismatch!" })
      }

    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - changePasswordDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static resetPasswordDetail(request: Request, response: Response) {
    try {
      let bodyContent = request.body;

      LoginService.resetPasswordDetail(bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LoginController - resetPasswordDetail",
            e
          );
          response.status(500).send(e);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - resetPasswordDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static verifyAuthentication(
    token: string,
    successCallback: Function,
    failiureCallback: Function
  ) {
    try {
      LoginService.verifyToken(token, successCallback, failiureCallback);
    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - verifyAuthentication",
        e
      );
    }
  }

  static forgotPassword(request: Request, response: Response) {
    // try {
    //   let bodyContent = request.body;
    //   let otp = Math.floor(100000 + Math.random() * 900000);
    //   LoginService.getUserDetails(bodyContent.userName)
    //     .then((data: any) => {
    //       OrganisationService.getSpecificOrganisationDetails(data)
    //         .then((organistiondata: any) => {
    //           console.log("OTP", otp.toString(), data.email);
    //           console.log("organisation", organistiondata.organisationName);
    //           EmailController.sendMail({
    //             fromEmail: metaData.email.fromEmail,
    //             body: metaData.email.template.otp.replace("$otp", otp.toString())
    //               .replace(/companyName/g, organistiondata?.organisationName),
    //             subject: "RE:Password reset - request - OTP",
    //             toEmail: data.email,
    //           }).then((email) => {
    //             if (email.status) {
    //               LoginService.postOTPDetails(bodyContent.userName, otp)
    //                 .then((data2: any) => {
    //                   response.status(200).json({
    //                     auth: true,
    //                     type: metaData.responseType.Success,
    //                     status: email.status,
    //                     mailMessage: email.message,
    //                     message:
    //                       "OTP send to " + LoginController.mashkingEmail(data?.email),
    //                   });
    //                 })
    //                 .catch((e) => {
    //                   LogController.writeLog(
    //                     "Exception in LoginController - sendOTP",
    //                     e
    //                   );
    //                   response.status(500).send(metaData.message.serverError);
    //                 });
    //             } else {
    //               response.status(500).json({
    //                 auth: false,
    //                 type: metaData.responseType.Failed,
    //                 status: email.status,
    //                 mailMessage: email.message,
    //                 message:
    //                   "server issue",
    //               });
    //             }
    //           }).catch(err => {
    //             response.status(500).json({ message: "Error", error: err })
    //           })

    //           console.log(bodyContent.userName, otp);
    //         })
    //     })
    //     .catch((e) => {
    //       response.status(500).send({
    //         auth: true,
    //         message: "Username is not valid",
    //       });
    //     });
    // } catch (e) {
    //   LogController.writeLog("Exception in LoginController - sendOTP", e);
    // }
  }

  static mashkingEmail(email: any) {
    let temp = email.split("@");
    let frontSection = temp[0][0] + temp[0][1];
    let backSection = "";
    let star = "";
    if (temp[0].length > 5) {
      backSection = temp[0][temp[0].length - 3] + temp[0][temp[0].length - 2];
    }
    for (let index = 3; index < temp[0].length - 2; index++) {
      star += "*";
    }
    return frontSection + star + backSection + "@" + temp[1];
  }

  static confirmOtp(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      LoginService.confirmOtpDetails(bodyContent.userName, bodyContent.otp)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LoginController - confirmOtp",
            e
          );
          response.status(500).send(e);
        });
    } catch (e) {
      LogController.writeLog("Exception in LoginController - confirmOtp", e);
    }
  }
  // delete user by _id
  static deleteLoginDetail(request: Request, response: Response) {
    const { id } = request.params;
    try {
      LoginService.deleteLoginDetail(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LoginController - deleteLoginDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - deleteLoginDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static getCredentials(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      LoginService.getCredentials(bodyContent.email, bodyContent.password)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LoginController - getCredentials",
            e
          );
          response.status(401).send(e);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in LoginController - getCredentials",
        e
      );

      response.status(500).send(metaData.message.serverError);
    }
  }
  static getPermission(request: Request, response: Response) {
    const jsonLocation = path.resolve("data/permission.json")
    const user: any = decodeJwt(request);

    readFile(jsonLocation, (err, data: any) => {
      if (err) throw err;
      if (data) {
        const permissionData = JSON.parse(data);
        try {
          LoginService.getUserGroup(user.id).then((userData: any) => {
            if (userData && Object.keys(userData).length > 0) {
              const group = userData.userGroup;
              const userPermission = permissionData[group];
              response.status(200).json(userPermission)
            } else {
              response.status(500).json({
                message: "Invalid user"
              })
            }
          })
        } catch (error) {
          response.status(500).json({
            message: LogController.errorMes("permission", error)
          })
        }
      }



    })
  }
}
