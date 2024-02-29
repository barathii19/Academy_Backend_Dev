import { metaData } from "../environment/meta-data";
import { reportService } from "../service/report-service";
import { LogController } from "./log-controller";

export class reportController {
  static getReportDetails(req: any, res: any) {
    try {
      reportService
        .getReportDetails()
        .then((data) => {
          const studentCount = data[4].filter(
            (studentData) => studentData.userGroup === "student"
          );
          const teacherCount = data[4].filter(
            (TeacherData) => TeacherData.userGroup === "teacher"
          );
          const userReportData = [
            { name: "student", value: studentCount.length },
            { name: "teacher", value: teacherCount.length },
          ];
          const sentdata = {
            payment: data[0],
            batch: data[1],
            student: data[2],
            course: data[3],
            batchData: data[5],
            users: userReportData
          };
          res.status(200).json(sentdata);
        })
        .catch((e: any) => {
          LogController.writeLog(
            "Exception in paymentController - getPaymentDetails",
            e
          );
          res.status(500).send(metaData.message.serverError);
        });
    } catch (e: any) {
      LogController.writeLog(
        "Exception in paymentController - getPaymentDetails",
        e
      );
      res.status(500).send(metaData.message.serverError);
    }
  }
}
