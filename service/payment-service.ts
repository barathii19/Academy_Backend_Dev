import { MongoService } from "./mongo-service";
import { IPaymentDetails } from "../model/IPaymentDetails";
import { ObjectId } from "mongodb";
import { metaData } from "../environment/meta-data";
export class paymentService {
  static getPaymentDetails() {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getSpecificPaymentDetails(id: string) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.findOne({ courseId: id }).finally(() => {
        obj.client.close();
      });
    });
  }
  static getOrganisationBranchPayments(organisationId: string, branch: string) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.find({ organisationId, branch }).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  // getMonthwiseRevenueOfOrganisation  and branch
  static getMonthwiseRevenueOfOrganisation(organisationId: string, branch: string) {
    return MongoService.collectionDetails("payment").then((obj) => {
      const lastSixMonth = new Date(new Date().setMonth(new Date().getMonth() - 6))
      return obj.connection.aggregate([
        {
          $match: { organisationId, createdAt: { $gte: lastSixMonth }, branch }
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            revenue: "$paid",
          }
        },
        {
          $group: {
            _id: "$month",
            revenue: { $sum: "$revenue" },
          }
        },
      ]).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  static getPaymentBranchDetails(branch: String) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.find({ branch }).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  static postPaymentDetail(paymentDetail: IPaymentDetails) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.insertOne({
        ...paymentDetail,
        createdAt: new Date(),
        updatedAt: new Date()
      }).finally(() => {
        obj.client.close();
      });
    });
  }
  static deletePaymentDetails(id: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.deleteOne({ studentId: id }).finally(() => {
        obj.client.close();
      });
    });
  }
  static updatePaymentDetails(id: any, bodyData: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: bodyData })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  // push element to transaction array
  static updatePaymentTransactionDetails(organisationId: any, branch: any, studentId: any, courseId: any, bodyData: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection
        .updateOne({ organisationId, branch, studentId, courseId }, { $push: { transaction: bodyData } })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  // update processing amount
  static updatePaymentProcessingDetails(bodyContent: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection
        .updateOne({ paymentSchedule: { $elemMatch: { paymentScheduleUniqueId: bodyContent.paymentScheduleUniqueId } } }, { $set: { processing: +bodyContent?.amount, "paymentSchedule.$.isCompleted": true } })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  // admin approve transaction
  static approveTransaction(paymentScheduleUniqueId: string, transactionUniqueId: string, bodyContent: any) {
    const { status, isFullyPaid } = bodyContent
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection
        .updateOne(
          {
            // paymentSchedule:{$elemMatch:{paymentScheduleUniqueId}},
            transaction: { $elemMatch: { transactionUniqueId } }
          },
          {
            $set: {
              processing: 0,
              isFullyPaid,
              paid: bodyContent?.paid + bodyContent?.processing,
              pending: bodyContent?.total - (bodyContent?.paid + bodyContent?.processing),
              "transaction.$.status": status,
              // "paymentSchedule.$.isCompleted":true,
            }
          }
        )
        .finally(() => {
          obj.client.close();
        });
    });
  }
  // admin reject transaction
  static rejectTransaction(paymentScheduleUniqueId: string, transactionUniqueId: string, bodyContent: any) {
    const { status } = bodyContent
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection
        .updateOne(
          {
            transaction: { $elemMatch: { transactionUniqueId } }
          },
          { $set: { processing: 0, "transaction.$.status": status } })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  // update paymentScheduleIsComplete as false after admin reject transaction
  static updatePaymentIsCompletedDetails(paymentScheduleUniqueId: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection
        .updateOne({ paymentSchedule: { $elemMatch: { paymentScheduleUniqueId } } }, { $set: { "paymentSchedule.$.isCompleted": false } })
        .finally(() => {
          obj.client.close();
        });
    });
  }


  static updateStudentPaymentDetails(id: any, req: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.insertOne(req).finally(() => {
        obj.client.close();
      });
    });
  }
  static postPaymentDetails(data: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.insertMany(data).finally(() => {
        obj.client.close();
      });
    });
  }
  static getSpecificStudentPaymentDetails(id: any) {
    return MongoService.collectionDetails("payment").then((obj) => {
      return obj.connection.find({ studentId: id }).toArray().finally(() => {
        obj.client.close();
      });
    });
  }

  static getOrganisationRevenueDetails(organisationId: string) { //last six month
    return MongoService.collectionDetails("payment").then((obj) => {
      const lastSixMonth = new Date(new Date().setMonth(new Date().getMonth() - 6))
      return obj.connection.aggregate([
        {
          $match: { organisationId, createdAt: { $gte: lastSixMonth } }
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            revenue: "$paid",
          }
        },
        {
          $group: {
            _id: "$month",
            revenue: { $sum: "$revenue" },
          }
        },
      ]).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  static getUnpaidStudentList() {
    return MongoService.collectionDetails("payment").then(obj => {
      return obj.connection.aggregate([
        { $match: { isComplete: false } },
        {
          $lookup: {
            from: metaData.db.collectionDetails.user,
            localField: 'student',
            pipeline: [
              { $project: { password: 0, userGroup: 0, course: 0, batch: 0, creater: 0, branch: 0 } }
            ],
            foreignField: '_id',
            as: 'studentInfo'
          }
        },
        {
          $lookup: {
            from: metaData.db.collectionDetails.course,
            localField: 'course',
            pipeline: [
              { $project: { courseName: 1 } }
            ],
            foreignField: '_id',
            as: 'courseInfo'
          }
        },
        {
          $lookup: {
            from: metaData.db.collectionDetails.batch,
            localField: 'batch',
            pipeline: [
              { $project: { batchName: 1 } }
            ],
            foreignField: '_id',
            as: 'batchInfo'
          }
        },
        { $project: { course: 0, batch: 0, student: 0 } }
      ]).toArray().finally(() => {
        obj.client.close()
      })
    })
  }
}
