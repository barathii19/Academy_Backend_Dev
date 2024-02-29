import { Request, Response } from "express";
import { CourseService } from "../service/course-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { IPostCourseDetails } from "../model/ICourseDetails";
import { decodeJwt } from "../HelperFunction/jwtHelper";

export class CourseController {
  static getCourseDetails(req: Request, res: Response) {
    try {
      CourseService.getCourseDetails()
        .then((data: any) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - getCourseDetails",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - getCourseDetails",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static getSpecificCourseDetail(request: Request, response: Response) {
    try {
      let id = request.params.id;
      CourseService.getSpecificCourseDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - getSpecificCourseDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - getSpecificCourseDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postCourseDetail(request: Request, response: Response) {
    try {
      let bodyContent: IPostCourseDetails = request.body;
      const creater = decodeJwt(request);
      if (
        creater &&
        creater.id &&
        bodyContent &&
        bodyContent.offeredPrice &&
        typeof bodyContent.offeredPrice === "number" &&
        bodyContent.actualPrice &&
        typeof bodyContent.actualPrice === "number" &&
        bodyContent.courseName &&
        bodyContent.description &&
        bodyContent.modules &&
        bodyContent.modules.length > 0
      ) {
        CourseService.postCourseDetail(bodyContent, creater.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            LogController.writeLog(
              "Exception in CourseController - postCourseDetail",
              e
            );
            response.status(500).send(metaData.message.serverError);
          });
      } else {
        response.status(500).json({ messge: "invalid payload" });
      }
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - postCourseDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postCourseDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      CourseService.postCourseDetails(bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - postCourseDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - postCourseDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static updateCourseDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent: IPostCourseDetails = request.body;
      CourseService.updateCourseDetail(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - updateCourseDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - updateCourseDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static deleteCourseDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      CourseService.deleteCourseDetail(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - deleteCourseDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - deleteCourseDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  // getSpecificOrganisationCourses
  static getSpecificOrganisationCourseDetail(
    request: Request,
    response: Response
  ) {
    try {
      const { organisationId, branch } = request.params;
      CourseService.getSpecificOrganisationCourseDetail(organisationId, branch)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - getSpecificOrganisationCourseDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - getSpecificOrganisationCourseDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getCourseAndDouments(request: Request, response: Response) {
    try {
      const { organisationId, branch } = request.params;
      CourseService.getCourseAndDouments(organisationId, branch)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - getCourseAndDouments",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - getCourseAndDouments",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
