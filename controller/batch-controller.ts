import { Request, Response } from "express";
import { BatchService } from "../service/batch-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { MongoService } from "../service/mongo-service";
import { CourseService } from "../service/course-service";
import { LoginService } from "../service/login-service";
import { IBatchPayload, IPostBatchDetails } from "../model/IBatchDetails";
import { decodeJwt } from "../HelperFunction/jwtHelper";

export class BatchController {
  static getBatchDetails(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    if (jwtPayload && jwtPayload.id) {
      try {
        BatchService.getBatchRecord(jwtPayload.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((err) => {
            response.status(500).json({ message: err });
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      response.status(500).json({ message: "Invalid Credential" });
    }
  }

  static updateBatch(request: Request, response: Response) {
    const batchId = request.params.id;
    const bodyData = request.body;
    try {
      BatchService.updateBatchService(batchId, bodyData)
        .then((data) => {
          response.status(200).json({
            message: "batch updated",
          });
        })
        .catch((e) => {
          response
            .status(500)
            .send(
              LogController.errorMes(
                "Exception in BatchController - updateBatch",
                e
              )
            );
        });
    } catch (e) {
      response
        .status(500)
        .send(
          LogController.errorMes(
            "Exception in BatchController - updateBatch",
            e
          )
        );
    }
  }

  static getSpecificTeacherDetails(req: any, res: any) {
    const id = req.params.id;
    try {
      BatchService.getSpecificTeacherDetails(id)

        .then((data: any) => {
          const totaldata = {
            count: data.length,
            data,
          };
          res.status(200).json(totaldata);
        })

        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - getspecificdetails",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in paymentController - getspecificdetails",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static postBatchDetail(request: Request, response: Response) {
    try {
      let bodyContent: IBatchPayload = request.body;
      BatchService.postBatchDetail(bodyContent, request)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - postBatchDetail",
            e
          );
          response
            .status(500)
            .send(
              LogController.errorMes(
                "Exception in BatchController - postBatchDetail",
                e
              )
            );
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - postBatchDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static postBatchDetails(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      BatchService.postBatchDetails(bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - postBatchDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - postBatchDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static addStudentToBatch(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      BatchService.addStudentToBatch(id, bodyContent)
        .then(async (data) => {
          try {
            if (data) {
              const { studentSelectedToAdd } = bodyContent;
              // const studentIdToUpadteAvailability = studentSelectedToAdd?.map(({ studentId }: any) => studentId)
              for (const studentId of studentSelectedToAdd) {
                await LoginService.updateAvailabilityToJoinBatch(studentId, {
                  availabilityToJoinBatch: false,
                }).catch((e) => {
                  LogController.writeLog(
                    "Exception in UserController - availabilityToJoinBatch",
                    e
                  );
                });
              }
            }
            response.status(200).json(data);
          } catch (error) {
            response
              .status(500)
              .json({ message: "batchController-async error" });
          }
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - addStudentToBatch",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - addStudentToBatch",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static removeStudentFromBatch(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      BatchService.removeStudentFromBatch(id, bodyContent)
        .then((data) => {
          if (data) {
            const { studentId } = bodyContent;
            LoginService.updateAvailabilityToJoinBatch(studentId, {
              availabilityToJoinBatch: true,
            })
              .catch((e) => {
                LogController.writeLog(
                  "Exception in BatchController - availabilityToJoinBatch",
                  e
                );
              })
              .then((data) => {
                console.log("updateAvailabilityToJoinBatchData", data);
              });
          }
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - removeStudentFromBatch",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - removeStudentFromBatch",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static delicateBatch(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      BatchService.delicateBatch(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - delicateBatch",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog("Exception in BatchController - delicateBatch", e);
      response.status(500).send(metaData.message.serverError);
    }
  }
  static deActivateBatch(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      BatchService.deActivateBatch(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - deActivateBatch",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - deActivateBatch",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static deleteBatchDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      BatchService.deleteBatchDetail(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - deleteBatchDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - deleteBatchDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getSpecificBatchOfStudent(request: Request, response: Response) {
    try {
      const { organisationId, branch, studentId } = request.params;
      BatchService.getSpecificBatchOfStudent(organisationId, branch, studentId)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - getSpecificBatchOfStudent",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - getSpecificBatchOfStudent",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static updateCompletedStatus(request: Request, response: Response) {
    try {
      const staff = decodeJwt(request)?.id;
      let batchid = request.params.batchid;
      let bodyContent = request.body;
      BatchService.updateCompletedStatus(staff, batchid, bodyContent)
        .then((data) => {
          response.status(200).json({ message: data });
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - updateCompletedStatus",
            e
          );
          response.status(500).json({
            message: LogController.errorMes(
              "BatchController-updateCompletedStatus",
              e
            ),
          });
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - updateCompletedStatus",
        e
      );
      response.status(500).json({
        message: LogController.errorMes(
          "BatchController-updateCompletedStatus",
          e
        ),
      });
    }
  }

  static getCourseAndStudent(request: Request, response: Response) {
    try {
      const batchId = request.params.batchId;
      BatchService.getCourseAndStudent(batchId)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in BatchController - get course and student details",
            e
          );
          response.status(500).json({
            message: LogController.errorMes(
              "batchcontroller - getCourseAndStudent",
              e
            ),
          });
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in BatchController - getCourseAndStudent",
        e
      );
      response.status(500).json({
        message: LogController.errorMes(
          "batchcontroller - getCourseAndStudent",
          e
        ),
      });
    }
  }
  static getBatchByQuery(request: Request, response: Response) {
    const query = request.query;
    try {
      if (query && Object.keys(query).length > 0) {
        BatchService.getBatchByQueryService(query)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "No Query Available" });
      }
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes("batchControll-getBatchByQuery", error),
      });
    }
  }
  static updateBatchModules(request: Request, response: Response) {
    const bodyData = request.body;
    const batchId = request.params.id;
    const jwtPayload = decodeJwt(request);

    try {
      if (
        jwtPayload &&
        jwtPayload.id &&
        bodyData &&
        bodyData.moduleId &&
        bodyData.topicId
      ) {
        BatchService.updateBatchModulesService(batchId, bodyData, jwtPayload.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "Invalid Payload" });
      }
    } catch (error) {
      LogController.writeLog(
        "Exception in BatchController - updateBatchModules",
        error
      );
      response.status(500).json({
        message: LogController.errorMes(
          "batchcontroller - updateBatchModules",
          error
        ),
      });
    }
  }
}
