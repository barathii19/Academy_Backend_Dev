import { Request, Response } from "express";
import { paymentService } from "../service/payment-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";

export class paymentController {
  static getPaymentDetails(req: any, res: any) {
    let { start, end, field, value, branch, group }: any = req.query;
    try {
      if (!start) {
        start = 0;
      }
      if (!end) {
        end = 15;
      }
      paymentService
        .getPaymentDetails()
        .then((val) => {
          if (group && group.toLowerCase() == "super_admin") {
          } else {
            val = val.filter((data) => {
              if (data["branch"].toLowerCase().includes(branch.toLowerCase())) {
                return data;
              }
            });
          }
          if (field && value) {
            val = val.filter((data) => {
              if (data[field].toLowerCase().includes(value.toLowerCase())) {
                return data;
              }
            });
          }
          const dataLength = val.length;
          val = val.slice(start, end > dataLength ? dataLength : end);
          res.status(200).json({ val, dataLength });
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - getPaymentDetails",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in paymentController - getPaymentDetails",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }

  static updatePaymentDetails(req: any, res: any) {
    let id = req.params.id;
    let bodyContent = req.body;
    try {
      paymentService
        .updatePaymentDetails(id, bodyContent)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - updatePaymentDetails",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in paymentController - updatePaymentDetails",
        error
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static updatePaymentTransactionDetails(req: any, res: any) {
    let { organisationId, branch, studentId, courseId } = req.params;
    let bodyContent = req.body;
    try {
      paymentService
        .updatePaymentTransactionDetails(
          organisationId,
          branch,
          studentId,
          courseId,
          bodyContent
        )
        .then((pushedTransactionRes) => {
          if (pushedTransactionRes.matchedCount) {
            paymentService
              .updatePaymentProcessingDetails(bodyContent)
              .catch((e) => {
                LogController.writeLog(
                  "Exception in paymentController - updatePaymentProcessingDetails",
                  e
                );
                res.status(500).send(metaData.message.serverError);
              })
              .then((data) => {
                res.status(200).json(data);
              });
          }
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - updatePaymentTransactionDetails",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in paymentController - updatePaymentTransactionDetails",
        error
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static approveRejectTransaction(req: any, res: any) {
    const { paymentScheduleUniqueId, transactionUniqueId } = req.params;
    const { status } = req.body;
    const bodyContent = req.body;
    try {
      if (status === "Approved") {
        paymentService
          .approveTransaction(
            paymentScheduleUniqueId,
            transactionUniqueId,
            bodyContent
          )
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((e) => {
            LogController.writeLog(
              "Exception in paymentController - approveTransaction",
              e
            );
            res.status(500).send(metaData.message.serverError);
          });
      } else {
        paymentService
          .rejectTransaction(
            paymentScheduleUniqueId,
            transactionUniqueId,
            bodyContent
          )
          .then((rejectedTransactionRes) => {
            if (rejectedTransactionRes.matchedCount) {
              paymentService
                .updatePaymentIsCompletedDetails(paymentScheduleUniqueId)
                .catch((e) => {
                  LogController.writeLog(
                    "Exception in paymentController - updatePaymentIsCompletedDetails",
                    e
                  );
                  res.status(500).send(metaData.message.serverError);
                })
                .then((data) => {
                  res.status(200).json(data);
                });
            }
          })
          .catch((e) => {
            LogController.writeLog(
              "Exception in paymentController - rejectTransaction",
              e
            );
            res.status(500).send(metaData.message.serverError);
          });
      }
    } catch (error) {
      LogController.writeLog(
        "Exception in paymentController - rejectTransaction",
        error
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static getSpecificPaymentDetails(req: any, res: any) {
    const id = req.params.id;
    try {
      paymentService
        .getSpecificPaymentDetails(id)

        .then((data: any) => {
          res.status(200).json(data);
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
  static getSpecificStudentPaymentDetails(req: any, res: any) {
    const id = req.params.id;
    try {
      paymentService
        .getSpecificStudentPaymentDetails(id)
        .then((data: any) => {
          res.status(200).json(data);
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

  static groupBy = (array: any, key: any) => {
    return array.reduce((result: any, currentItem: any) => {
      (result[currentItem[key]] = result[currentItem[key]] || []).push(
        currentItem
      );
      return result;
    }, {});
  };
  static getOrganisationBranchPayments(req: any, res: any) {
    const { organisationId, branch } = req.params;
    try {
      paymentService
        .getOrganisationBranchPayments(organisationId, branch)

        .then((data: any) => {
          res.status(200).json(data);
        })

        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - getOrganisationBranchPayments",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in paymentController - getOrganisationBranchPayments",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  static postPaymentDetail(req: any, res: any) {
    try {
      let bodyContent = req.body;
      paymentService
        .postPaymentDetail(bodyContent)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in PaymentController - postPaymentDetail",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in PaymentController - postPaymentDetail",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
  // for super admin home chart getMonthwiseRevenueOfOrganisation and branch
  static getMonthwiseRevenueOfOrganisation(
    request: Request,
    response: Response
  ) {
    const { organisationId, branch } = request.params;
    try {
      paymentService
        .getMonthwiseRevenueOfOrganisation(organisationId, branch)
        .then((data: any) => {
          // data with _id contains month starts from 1
          const monthArr = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          const paymentDetailsWithMonth = data?.map((item: any) => ({
            month: monthArr[item?._id],
            revenue: item?.revenue,
          }));
          response.status(200).json(paymentDetailsWithMonth);
        })

        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - getMonthwiseRevenueOfOrganisation",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in paymentController - getMonthwiseRevenueOfOrganisation",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  // for super admin home chart total revenue
  static getOrganisationRevenueDetails(request: Request, response: Response) {
    const { organisationId } = request.params;
    try {
      paymentService
        .getOrganisationRevenueDetails(organisationId)
        .then((data: any) => {
          // data with _id contains month starts from 1
          const monthArr = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          const paymentDetailsWithMonth = data?.map((item: any) => ({
            month: monthArr[item?._id],
            revenue: item?.revenue,
          }));
          response.status(200).json(paymentDetailsWithMonth);
        })

        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - getMonthwiseRevenueOfOrganisation",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in paymentController - getMonthwiseRevenueOfOrganisation",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static deletePaymentDetails(request: Request, response: Response) {
    const { id } = request.params;
    try {
      paymentService
        .deletePaymentDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in paymentController - deletePaymentDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in paymentController - deletePaymentDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getUnpaidStudent(request: Request, response: Response) {
    try {
      paymentService
        .getUnpaidStudentList()
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          response.status(500).json({ message: e });
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in paymentController - getUnpaidStudent",
        error
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
