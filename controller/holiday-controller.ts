import { Request, Response } from "express";
import { BatchService } from "../service/batch-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
import { MongoService } from "../service/mongo-service";
import { HolidayService } from "../service/holiday-service";
import { EmailController } from "./email-controller";

export class HolidayController {

  static getHolidayDetails(request: any, response: any) {
    let _sDate, _eDate
    const { startDate, endDate } = request.query;
    if (startDate || endDate) {
      _sDate = new Date(startDate).toISOString()
      _eDate = new Date(endDate).toISOString()
    }
    try {
      HolidayService.getHolidayDetails(startDate, endDate)
        .then((data: any) => {
          // include fullDate key for every holiday
          const holidays = data?.map((holiday: any) => ({
            ...holiday, fullDate: holiday?.date
          }))
          response.status(200).json(holidays);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in HolidayController - getHolidayDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {

      LogController.writeLog(
        "Exception in HolidayController - getHolidayDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static postHolidayDetails(request: Request, response: Response) {
    // try {
    //   let bodyContent = request.body;
    //   console.log(bodyContent);

    //   HolidayService.postHolidayDetails(bodyContent)
    //       .then((data) => {
    //           if(data){
    //             EmailController.sendMail({
    //                 fromEmail: metaData.email.fromEmail,
    //                 body: metaData.email.template.newUser
    //                   .replace("$fromDate",bodyContent.fromDate )
    //                   .replace("$toDate", bodyContent.toDate),
    //                 subject: "Apply Leave - CRUD",
    //                 toEmail: bodyContent.email,
    //               });
    //           }

    //         response.status(200).json(data);
    //       })
    //       .catch((e) => {
    //         LogController.writeLog(
    //           "Exception in HolidayController - postHolidayDetails",
    //           e
    //         );
    //         response.status(500).send(metaData.message.serverError);
    //       });
    // } catch (e) {
    //   LogController.writeLog(
    //     "Exception in HolidayController - postHolidayDetails",
    //     e
    //   );
    //   response.status(500).send(metaData.message.serverError);
    // }
  }
  static holidayDetails(request: Request, response: Response) {
    try {

      HolidayService.holidayDetails()
        .then((data: any) => {
          const totaldata = {
            count: data.length,
            data,
          };
          response.status(200).json(totaldata);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in HolidayController - holidayDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {

      LogController.writeLog(
        "Exception in HolidayController - holidayDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static deleteHoliday(request: any, response: any) {
    try {
      let id = request.params.id;
      HolidayService.deleteHoliday(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in HolidayController - deleteHoliday",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in HolidayController - deleteHoliday",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

  static putHolidayDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      HolidayService.putHolidayDetails(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          LogController.writeLog(
            "Exception in HolidayController - putHolidayDetails",
            e
          );
          response.status(500).send(metaData.message.serverError);
        });
    } catch (e) {
      LogController.writeLog(
        "Exception in HolidayController - putHolidayDetails",
        e
      );
      response.status(500).send(metaData.message.serverError);
    }
  }

}