import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "../service/attendance-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { request } from "http";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { HelperController } from "./Helper-controller";

export class AttendanceController {
  static postAttendanceDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      let id = request.params.id;
      AttendanceService.postAttendanceDetails(id, bodyContent)

        .then((data: any) => {
          response.status(200).json({ isAvailable: true, ...data });
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in AttendanceController - postAttendanceDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AttendanceController - postAttendanceDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static getcheckindetails(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    const batchId = request.params.id;
    try {
      if (jwtPayload && jwtPayload.id) {
        AttendanceService.getcheckindetails(jwtPayload.id, batchId)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "Invalid Payload" });
      }
    } catch (e) {
      LogController.writeLog(
        "Exception in AttendanceController - getcheckindetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static putcheckindetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      AttendanceService.putcheckindetails(id, bodyContent)
        .then((data) => {
          console.log("dat", data, id);
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in AttendanceController - putcheckindetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AttendanceController - putcheckindetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static putcheckinarray(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      AttendanceService.putcheckinarray(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in CourseController - putcheckinarray",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in CourseController - putcheckinarray",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getWeeklyDateByQuery(req: any, res: any) {
    let _sDate, _eDate;
    const { startDate, endDate, userId, organisationId } = req.query;
    if (startDate || endDate || userId || organisationId) {
      _sDate = new Date(startDate);
      _eDate = new Date(endDate);
    }
    try {
      AttendanceService.getWeeklyDateByQuery(
        _sDate,
        _eDate,
        userId,
        organisationId
      )
        .then((data: any) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in AttendanceController - getWeeklyDateByQuery",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in AttendanceController - getWeeklyDateByQuery",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static postBatchStudentAttendance(request: Request, response: Response) {
    const batchId = request.params.id;
    const bodyData = request.body;
    const jwtPayload = decodeJwt(request);
    try {
      if (bodyData && Array.isArray(bodyData) && bodyData.length > 0) {
        if (jwtPayload && jwtPayload.id) {
          AttendanceService.postBatchStudentAttendanceService(
            batchId,
            bodyData,
            jwtPayload.id
          )
            .then((data) => {
              response.status(200).json(data);
            })
            .catch((e) => {
              response.status(500).json({ message: e });
            });
        } else {
          response.status(500).json({ message: "invalid user/jwt" });
        }
      } else {
        response.status(500).json({ message: "invalid payload" });
      }
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "attendancecontroller-postBatchStudentAttendance",
          error
        ),
      });
    }
  }
  static GetBatchAttendance(request: Request, response: Response) {
    const batchId = request.params.id;
    try {
      AttendanceService.getBatchAttendanceService(batchId)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          response.status(500).json({
            message: LogController.errorMes(
              "attendanceController-GetBatchAttendance",
              e
            ),
          });
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "attendanceController-GetBatchAttendance",
          error
        ),
      });
    }
  }
  static getAttendanceRange(request: Request, response: Response) {
    const batchId = request.params.id;
    try {
      AttendanceService.attendanceRange(batchId)
        .then((data) => {
          if (data) {
            const [start, end] = HelperController.getWeekDates();
            const attendList = data.list
              .filter((doc: any) => {
                return (
                  new Date(start) <= new Date(doc.date) &&
                  new Date(end) >= new Date(doc.date)
                );
              })
              .map((doc: any) => {
                const list = doc.attendance;
                const pCount = list.filter(
                  (doc: any) => doc.status === "P"
                ).length;
                const percentage = (pCount / list.length) * 100;
                return {
                  ...doc,
                  percentage,
                };
              });
            response.status(200).json(attendList);
          }
        })
        .catch((e) => {
          console.log(e);
          response.status(500).json({
            message: LogController.errorMes(
              "attendanceController-getAttendanceRange",
              e
            ),
          });
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "attendanceController-getAttendanceRange",
          error
        ),
      });
    }
  }
}
