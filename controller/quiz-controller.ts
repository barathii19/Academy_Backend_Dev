import { Request, Response } from "express";
import { QuizService } from "../service/quiz-service";
import { LogController } from "./log-controller";
import { decodeJwt } from "../HelperFunction/jwtHelper";

export class QuizContoller {
  static addQuizToBatch(request: Request, response: Response) {
    const createrId = decodeJwt(request)?.id;
    const payload = request.body;
    try {
      QuizService.addQuiz(payload, createrId)
        .then(() => {
          response.status(200).json({ success: true, message: "Quiz created" });
        })
        .catch((e) => {
          response.status(500).json({
            message: LogController.errorMes("QuizContoller-addQuizToBatch", e),
          });
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes("QuizContoller-addQuizToBatch", error),
      });
    }
  }
  static getQuizList(request: Request, response: Response) {
    const { id } = request.params;
    try {
      QuizService.getQuiz(id)
        .then((data) => {
          response.status(200).json({ success: true, data: data });
        })
        .catch((err) => {
          response.status(500).json({
            message: LogController.errorMes("QuizContoller-getQuiz", err),
          });
        });
    } catch (error) {
      response.status(500).json({
        message: LogController.errorMes("QuizContoller-getQuiz", error),
      });
    }
  }
  static submitQuiz(request: Request, response: Response) {
    const bodyData = request.body;
    try {
      QuizService.submitQuiz(bodyData)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((err) => {
          response.status(500).json(err);
        });
    } catch (error) {
      response.status(500).json(error);
    }
  }
}
