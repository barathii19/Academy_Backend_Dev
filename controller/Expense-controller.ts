import { Request, Response } from "express";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { ExpenseService } from "../service/Expense-service";
import { LogController } from "./log-controller";
import { metaData } from "../environment/meta-data";
export class ExpenseController {
  static postExpense(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    const bodyData = request.body;
    try {
      if (jwtPayload && jwtPayload.id) {
        if (
          bodyData &&
          bodyData.expense &&
          typeof bodyData.expense === "number" &&
          bodyData.date &&
          bodyData.expenseCategory &&
          bodyData.expenseDescription
        ) {
          ExpenseService.postExpenseService(jwtPayload.id, bodyData).then(
            (data) => {
              response.status(200).json(data);
            }
          );
        } else {
          response.status(500).json({ message: "required field are missing" });
        }
      } else {
        response.status(500).json({ message: "Invalid Jwt" });
      }
    } catch (error) {
      LogController.writeLog(
        "Exception in ExpenseController - postExpense",
        error
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getExpense(request: Request, response: Response) {
    try {
      ExpenseService.getExpenseService(request)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((error) => {
          response.status(500).json({
            message: LogController.errorMes(
              "expensecontroller-getExpense",
              error
            ),
          });
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes("expensecontroller-getExpense", error),
      });
    }
  }
  static updateExpenseStatus(request: Request, response: Response) {
    const bodyData = request.body;
    const jwtPayload = decodeJwt(request);

    try {
      if (
        bodyData &&
        bodyData.status &&
        (bodyData.status === "approved" ||
          bodyData.status === "pending" ||
          bodyData.status === "rejected") &&
        bodyData.id
      ) {
        if (jwtPayload && jwtPayload.id) {
          ExpenseService.updateStatus(jwtPayload.id, bodyData)
            .then((data) => {
              response.status(200).json({ message: data });
            })
            .catch((e) => {
              response.status(500).json({ message: e });
            });
        } else {
          response.status(500).json({ message: "Invalid jt" });
        }
      } else {
        response.status(500).json({ message: "invalid query params" });
      }
    } catch (error) {
      LogController.writeLog(
        "Exception in ExpenseController - updateExpenseStatus",
        error
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  static getChartData(request: Request, response: Response) {
    try {
      const query = request.query;
      if (
        query &&
        Object.keys(query).length > 0 &&
        query.year &&
        query.type &&
        (query.type === "expense" || query.type === "income")
      ) {
        ExpenseService.getChartDataService(query.year, query.type)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "Invalid query" });
      }
    } catch (error) {
      LogController.writeLog(
        "Exception in ExpenseController - getChartData",
        error
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
}
