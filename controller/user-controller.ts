import { Request, Response } from "express";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { UserService } from "../service/user-service";

export class UserController {
  static getUserAllDetails(request: Request, response: Response) {
    const { organisationId, branch } = request.params;
    try {
      UserService.getUserAllDetails(organisationId, branch)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - getUserAllDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - getUserAllDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getAllUsersOfOrganisation(request: Request, response: Response) {
    const { organisationId } = request.params;
    try {
      UserService.getAllUsersOfOrganisation(organisationId)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BranchController - getAllUsersOfOrganisation",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BranchController - getAllUsersOfOrganisation",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static getUsersOfOrganisationDetails(request: Request, response: Response) {
    const { organisationId, branch }: any = request.params;
    try {
      UserService.getUsersOfOrganisationDetails(organisationId, branch)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in UserController - getUsersOfOrganisationDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in UserController - getUsersOfOrganisationDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
