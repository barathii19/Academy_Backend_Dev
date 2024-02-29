import { Request, Response } from "express";
import { StudentService } from "../service/student-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { LoginService } from "../service/login-service";
import { paymentService } from "../service/payment-service";
import { EmailController } from "./email-controller";
import { BatchService } from "../service/batch-service";
import { ObjectId } from "mongodb";
import { OrganisationService } from "../service/new-organisation-service";
import { decodeJwt } from "../HelperFunction/jwtHelper";

export class StudentController {
  static getStudentDetails(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    try {
      if (jwtPayload && jwtPayload.id) {
        StudentService.getStudentDetails(jwtPayload.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response
              .status(500)
              .send(
                LogController.errorMes(
                  "Exception in studentController - getStudentDetails",
                  e
                )
              );
          });
      } else {
        response.status(500).json({ message: "invalid jwt" });
      }
    } catch (e) {
      response
        .status(500)
        .send(
          LogController.errorMes(
            "Exception in studentController - getStudentDetails",
            e
          )
        );
    }
  }
  static getOrganisationStudentDetails(request: Request, response: Response) {
    try {
      const { organisationId, branch } = request.params;
      StudentService.getOrganisationStudentDetails(organisationId, branch)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in StudentController - getOrganisationStudentDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in StudentController - getOrganisationStudentDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getSpecificStudentDetail(request: Request, response: Response) {
    try {
      let id = request.params.id;
      StudentService.getSpecificStudentDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in StudentController - getSpecificStudentDetail",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in StudentController - getSpecificStudentDetail",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getStudentBranchDetails(request: Request, response: Response) {
    let { branch }: any = request.query;

    try {
      const studentDetails = StudentService.getStudentBranchDetails(branch);
      const paymentDetails = paymentService.getPaymentBranchDetails(branch);
      const batchDetails = BatchService.getBatchBranchDetails(branch);
      studentDetails.then((data) => {});

      Promise.all([studentDetails, paymentDetails, batchDetails]).then(
        (data) => {
          const totalObject = {
            studentDetails: data[0],
            paymentDetails: data[1],
            batchDetails: data[2],
          };
          response.status(200).json(totalObject);
        }
      );
    } catch (e) {
      LogController.writeLog(
        "Exception in StudentController - getStudentBranchDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static async postStudentDetails(request: Request, response: Response) {
    const adminId = decodeJwt(request)?.id;
    const bodyData = request.body;
    try {
      if (adminId) {
        if (
          bodyData.course.id &&
          bodyData.batch.id &&
          bodyData.payment.paymentMode &&
          bodyData.payment.paymentMethod &&
          bodyData.payment.paidAmount &&
          typeof bodyData.payment.paidAmount === "number" &&
          (bodyData.payment.paymentMode === "offline" ||
            (bodyData.payment.paymentMode === "online" &&
              bodyData.payment.transactionId))
        ) {
          StudentService.createStudent(adminId, bodyData)
            .then((data) => {
              response.status(200).json({ message: data });
            })
            .catch((err) => {
              response.status(500).json({ message: err });
            });
        } else {
          response.status(500).json({ message: "required fields are missing" });
        }
      } else {
        response.status(500).json({
          message: "Invalid JWT",
        });
      }
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes("Student - postStudentDetails", error),
      });
    }
  }

  static updateNewCourseDetails(request: Request, response: Response) {
    let id = request.params.id;
    const bodyData = request.body;
    const { requestCourse, ...restData } = request.body;
    const studentUpdateDetails = {
      ...restData,
    };
    try {
      StudentService.updateNewCourse(id, requestCourse).then((data) => {
        response.status(200).json(data);
      });
      const data = {
        studentId: bodyData.studentId,
        courseId: bodyData.courseId,
        total: bodyData.TotalAmount,
        paid: 0,
        pending: 0,
        processing: 0,
        transaction: [
          {
            transactionId: bodyData.transactionId,
            amount: bodyData.amount ? bodyData.amount : 0,
            submittedOn: bodyData.submittedOn,
            approvedBy: "",
            requesterComments: bodyData.requesterComments,
            approverComments: "",
            status: bodyData.status,
            courseId: bodyData.courseId,
          },
        ],
        isNewrequest: false,
      };
      paymentService
        .updateStudentPaymentDetails(id, data)
        .then((data) => {
          response.status(200).json(data);
        })

        .catch((e) => {
          LogController.writeLog(
            "Exception in studentController - updateNewCourseDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes(
          "Student - updateNewCourseDetails",
          error
        ),
      });
    }
  }

  static updateStudentDetails(request: Request, response: Response) {
    const studentId = request.params.id;
    const bodyData = request.body;
    try {
      StudentService.updateStudentDetail(studentId, bodyData)
        .then((data) => {
          response.status(200).json({
            message: "updated Successfully",
          });
        })
        .catch((e) => {
          response
            .status(500)
            .send(
              LogController.errorMes(
                "Exception in StudentController - updateStudentDetails",
                e
              )
            );
        });
    } catch (e) {
      response
        .status(500)
        .send(
          LogController.errorMes(
            "Exception in StudentController - updateStudentDetails",
            e
          )
        );
    }
  }
  static deleteStudentDetails(request: Request, response: Response) {
    try {
      let { id, studentId } = request.params;
      StudentService.deleteStudentDetail(id)
        .then((data) => {
          if (data) {
            paymentService
              .deletePaymentDetails(studentId)
              .then((res) => {
                response.status(200).json(res);
              })
              .catch((e) => {
                LogController.writeLog(
                  "Exception in StudentController - deletePaymentDetails",
                  e
                );
                response.status(500).send(metaData.message.serverError);
              });
          }
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in StudentController - deleteStudentDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in StudentController - deleteStudentDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static updateStudentPayment(request: Request, response: Response) {
    const id = request.params.id;
    const bodyData = request.body;
    const jwtPayload = decodeJwt(request);
    try {
      if (jwtPayload && jwtPayload.id) {
        if (
          bodyData &&
          bodyData.paidAmount &&
          typeof bodyData.paidAmount === "number" &&
          bodyData.paymentMode &&
          (bodyData.paymentMode === "offline" ||
            (bodyData.paymentMode === "online" && bodyData.transactionId))
        ) {
          StudentService.updateStudentPaymentService(
            id,
            bodyData,
            jwtPayload.id
          )
            .then((data) => {
              response.status(200).json(data);
            })
            .catch((e) => {
              console.log(e);
              response.status(500).json({ message: e });
            });
        } else {
          response
            .status(500)
            .json({ message: "paymentMode are required field" });
        }
      } else {
        response.status(500).json({ mssage: "Invalid Jwt" });
      }
    } catch (error) {
      console.log(
        LogController.errorMes("studentcontroller-updateStudentPayment", error),
        error
      );
      response.status(500).json({
        message: LogController.errorMes(
          "studentcontroller-updateStudentPayment",
          error
        ),
      });
    }
  }
  static enrollNewCourse(request: Request, response: Response) {
    const bodyData = request.body;
    try {
      if (
        bodyData.id &&
        bodyData.course.id &&
        bodyData.batch.id &&
        bodyData.payment.paymentMode &&
        bodyData.payment.paymentMethod &&
        bodyData.payment.paidAmount &&
        typeof bodyData.payment.paidAmount === "number" &&
        (bodyData.payment.paymentMode === "offline" ||
          (bodyData.payment.paymentMode === "online" &&
            bodyData.payment.transactionId))
      ) {
        StudentService.enrollNewCourse(bodyData)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "required fields are missing" });
      }
    } catch (error) {
      console.log(
        LogController.errorMes("studentcontroller-enrollNewCourse", error),
        error
      );
      response.status(500).json({
        message: LogController.errorMes(
          "studentcontroller-enrollNewCourse",
          error
        ),
      });
    }
  }
}
function data(data: any, arg1: string) {
  throw new Error("Function not implemented.");
}
