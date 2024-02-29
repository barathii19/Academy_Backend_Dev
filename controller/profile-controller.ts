import { Request, Response } from "express";
import { ProfileService } from "../service/profile-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { LoginService } from "../service/login-service";
import { EmailController } from "./email-controller";
import { ObjectId } from "mongodb";
import { OrganisationService } from "../service/new-organisation-service";
import { decodeJwt } from "../HelperFunction/jwtHelper";
export class ProfileController {
  static updateProfileDetails(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    const bodyData = request.body;
    try {
      if (jwtPayload && jwtPayload.id) {
        ProfileService.updateProfileDetail(jwtPayload.id, bodyData)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((err) => {
            response.status(500).json(err);
          });
      } else {
        response.status(500).json({ message: "Invalid Credential" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
