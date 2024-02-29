import { Request, Response } from "express";
import { BatchService } from "../service/batch-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { MongoService } from "../service/mongo-service";
import { LeaveService } from "../service/leave-service";
import { EmailController } from "./email-controller";
import { OrganisationService } from "../service/new-organisation-service";
import moment from "moment";
import { NotificationService } from "../service/notification-service";

export class LeaveController {
  static postApplyLeave(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      bodyContent = {
        ...request.body,
        fromDate: new Date(bodyContent?.fromDate).toISOString(),
        toDate: new Date(bodyContent?.toDate).toISOString(),
        createdAt: new Date().toISOString(),
        approverComments: "",
      };
      const totalLeaveDatas = bodyContent?.leaveDates?.map(
        (leaveDate: string) => ({
          ...bodyContent,
          fullDate: new Date(leaveDate).toISOString(),
        })
      );
      LeaveService.postLeaveDetail(totalLeaveDatas)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in LeaveController - postApplyLeave",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in LeaveController - postApplyLeave",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static getApplyLeave(request: any, response: any) {
    let _sDate, _eDate;
    const { startDate, endDate, userId, organisationId } = request.query;
    if (startDate || endDate || userId || organisationId) {
      _sDate = new Date(startDate).toISOString();
      _eDate = new Date(endDate).toISOString();
    }

    try {
      LeaveService.getApplyLeave(_sDate, _eDate, userId, organisationId)
        .then((data: any) => {
          // include fullDate key for every leaveDate
          let leaveObjWithFullDate: any[] = [];
          for (const eachLeaveObj of data) {
            for (const eachLeaveDate of eachLeaveObj?.leaveDates) {
              leaveObjWithFullDate.push({
                ...eachLeaveObj,
                fullDate: eachLeaveDate,
              });
            }
          }
          response.status(200).json(data?.length ? leaveObjWithFullDate : data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in LeaveController - getApplyLeave",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog("Exception in LeaveController - getApplyLeave", e);
      response.status(500).send(metaData.message.serverError);
    }
  }

  static getLeaveDetails(request: Request, response: Response) {
    const { organisationId, branch } = request.params;
    try {
      LeaveService.getLeaveDetails(organisationId, branch)
        .then((data: any) => {
          response.status(200).json(data);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in LeaveController - LeaveDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog("Exception in LeaveController - LeaveDetails", e);
      response.status(500).send(metaData.message.serverError);
    }
  }

  static updateApplyLeaves(request: Request, response: Response) {
    // let id = request.params.id;
    // let bodyContent = request.body;
    // try {
    //   LeaveService.updateApplyLeaves(id, bodyContent)
    //     .then((data) => {
    //       if(data.modifiedCount){
    //           OrganisationService.getSpecificOrganisation(bodyContent?.organisationId).then((organisation:any)=>{
    //             EmailController.sendMail({
    //               fromEmail: metaData.email.fromEmail,
    //               body: metaData.email.template.leave
    //                 .replace("$date",new Date(bodyContent?.fullDate).toDateString() )
    //                 .replace("$status", bodyContent?.status)
    //                 .replace("$comment", bodyContent?.approverComments)
    //                 .replace("$userid", bodyContent?.requestorId)
    //                 .replace(/companyname/g,organisation?.organisationName),
    //               subject: `Approval Leave - ${organisation?.organisationName}`,
    //               toEmail: bodyContent?.requestorEmail,
    //             });
    //             // send notification to the receiver
    //             const notificationData={
    //               isViewed:false,
    //               organisationId:bodyContent?.organisationId,
    //               branch:bodyContent?.branch,
    //               createdAt:new Date().toISOString(),
    //               creatorId:bodyContent?.requestorId,
    //               creatorEmail:bodyContent?.requestorEmail,
    //               receiverEmail:bodyContent?.receiverEmail,
    //               receiverId:bodyContent?.receiverId,
    //               type:bodyContent?.requestType,
    //               notificationHint:bodyContent?.requestType,
    //               notificationSummary:bodyContent?.command,
    //             }
    //             NotificationService.postNotificationDetail(notificationData).catch((e)=>{
    //               LogController.writeLog(
    //                 "Exception in leaveController - postNotificationDetails",
    //                 e
    //               );
    //             })
    //           }).catch((e)=>{
    //             LogController.writeLog(
    //               "Exception in leaveController - getSpecificOrganisation",
    //               e
    //             );
    //           })
    //       }
    //       response.status(200).json(data);
    //     })
    //     .catch((e) => {
    //       LogController.writeLog(
    //         "Exception in leaveController - updateApplyLeaves",
    //         e
    //       );
    //       response.status(500).send(metaData.message.serverError);
    //     });
    // } catch (e) {
    //   LogController.writeLog(
    //     "Exception in leaveController - updateApplyLeaves",
    //     e
    //   );
    //   response.status(500).send(metaData.message.serverError);
    // }
  }
}
