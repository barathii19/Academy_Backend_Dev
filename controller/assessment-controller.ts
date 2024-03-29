import { Request, Response } from "express";
import { AssessmentService } from "../service/assessment-service";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { IAssessmentPayload } from "../model/IAssessment";
import { LogController } from "./log-controller";

export class AssessmentController {
  static getAssessment(request: Request, response: Response) {
    const batchId = request.params.id;
    try {
      AssessmentService.getAssessmentService(batchId)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          response.status(500).json({
            message: LogController.errorMes(
              "assessmentController-getAssessment",
              e
            ),
          });
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "assessmentController-getAssessment",
          error
        ),
      });
    }
  }
  static postAssessment(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    const bodyContent: IAssessmentPayload = request.body;
    const file = request.file;
    try {
      if (jwtPayload && jwtPayload.id) {
        if (
          bodyContent &&
          bodyContent.title &&
          bodyContent.totalMark &&
          bodyContent.batch &&
          bodyContent.startTime &&
          bodyContent.endTime &&
          bodyContent.module &&
          bodyContent.description
        ) {
          AssessmentService.postAssessmentService(bodyContent, file, jwtPayload.id)
            .then((data) => {
              response.status(200).json(data);
            })
            .catch((e) => {
              response.status(500).json({ message: e });
            });
        } else {
          response.status(500).json({ message: "Invalid Payload" });
        }
      } else {
        response.status(500).json({ message: "Invalid Jwt" });
      }
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "assessmentcontroller-postAssessment",
          error
        ),
      });
    }
  }
  static getAssessmentInfo(request: Request, response: Response) {
    const id = request.params.id;
    try {
      AssessmentService.getAssessmentInfoService(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          response.status(500).json({ message: e });
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "assessmentcontroller-getAssessmentInfo",
          error
        ),
      });
    }
  }
  static postAssessmentInfo(request: Request, response: Response) {
    const id = request.params.id;
    const bodyData = request.body;
    try {
      if (bodyData && Array.isArray(bodyData) && bodyData.length > 0) {
        AssessmentService.postAssessmentInfoService(id, bodyData)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "invalid payload" });
      }
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "assessmentcontroller-postAssessmentInfo",
          error
        ),
      });
    }
  }
  static deleteAssessment(request: Request, response: Response) {
    const id = request.params.id;
    const jwtPayload = decodeJwt(request);

    try {
      if (jwtPayload && jwtPayload.id) {
        AssessmentService.deleteAssessmentService(id, jwtPayload.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json({
              message: LogController.errorMes(
                "assessmentcontroller-deleteAssessment",
                e
              ),
            });
          });
      } else {
        response.status(500).json({ message: "invalid jwt" });
      }
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "assessmentcontroller-deleteAssessment",
          error
        ),
      });
    }
  }
  static getStudentAssessment( request: Request, response: Response ){
    const { id } = request.params
    try {
      AssessmentService.studentAssessmentService(id)
      .then((data) => {
        response.status(200).json({ success: true, data });
      })
      .catch((e) => {
        response.status(500).json({
          message: LogController.errorMes(
            "assessmentcontroller-deleteAssessment",
            e
          ),
        });
      });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "assessmentcontroller-getStudentAssessment",
          error
        ),
      });
    }
  }
  static submitAssessment(request: Request, response: Response){
    const payload = request.body;
    const jwtPayload = decodeJwt(request);
    try {
      if(jwtPayload && jwtPayload.id){
        AssessmentService.submitAssessmentService(jwtPayload.id, payload).then((data) => {
          response.status(200).json({ success: true, data })
        }).catch((e) => {
          response.status(500).json(e)
        })
      } else {
        response.status(401).json({ message: "Invalid user" })
      }
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "assessmentcontroller-submitAssessment",
          error
        ),
      });
    }
  }
}
