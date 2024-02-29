import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { DocumentService } from "../service/document-service";
import { Request, Response } from "express";

export class DocumentController {
  //used to fetch logo while siginin
  static getSpecificFileDetail(request: Request, response: Response) {
    let bodyContent = request.body;
    try {
      DocumentService.getSpecificFileDetail(bodyContent)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in DocumentController - getSpecificDocumentDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in DocumentController - getSpecificDocumentDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static uploadFileDetail(req: any, res: any) {
    let bodyContent = req.body;
    try {
      DocumentService.uploadFileDetail(bodyContent)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in documentController - UploadFileDetail",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in DocumentController - UploadFileDetail",
        error
      );
      res.status(500).send(metaData.message.serverError);
    }
  }

  static updateUploadFileDetail(req: any, res: any) {
    let { id, type } = req.params;
    let bodyContent = req.body;
    try {
      DocumentService.updateUploadFileDetail(id, type, bodyContent)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in documentController - UpdateUploadFileDetail",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in DocumentController - UpdateUploadFileDetail",
        error
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static deleteDocumentAndProfileImg(req: any, res: any) {
    let { uniqueId } = req.params;
    try {
      DocumentService.deleteDocumentAndProfileImg(uniqueId)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in documentController - deleteDocumentAndProfileImg",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in DocumentController - deleteDocumentAndProfileImg",
        error
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static deleteSpecificDocumentByTypeAndUniqueId(req: any, res: any) {
    const { uniqueId, type } = req.params;
    try {
      DocumentService.deleteSpecificDocumentByTypeAndUniqueId(type, uniqueId)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in documentController - deleteSpecificDocumentByTypeAndUniqueId",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in DocumentController - deleteSpecificDocumentByTypeAndUniqueId",
        error
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
}
