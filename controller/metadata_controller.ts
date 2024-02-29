import { Request, Response } from "express";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { MetadataService } from "../service/metadata_service";

export class MetadataController {
  static getMetadataDetails(request: Request, response: Response) {
    try {
      MetadataService.getMetadataDetails()
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in metadataController - getMetadataDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in metadataController - getMetadataDetails",
        error
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
