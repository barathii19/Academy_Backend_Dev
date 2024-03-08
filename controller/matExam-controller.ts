import { Request, Response } from "express";
import { MATExamService } from "../service/matExam.srevice";
import { metaData } from "../environment/meta-data";
import { LogController } from "./log-controller";

export class MATExamController {
  static RegisterForExam(request: Request, response: Response) {
    const userData = request.body;
    try {
      MATExamService.RegisterExam(userData)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((err) => {
          response.status(400).json(err);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in MATExamController - RegisterForExam",
        error
      );
      response
        .status(500)
        .json({ success: false, error: metaData.message.serverError });
    }
  }
  static LoginForExam(request: Request, response: Response) {
    const payload = request.body;
    try {
      MATExamService.LoginViaOtp(payload)
        .then((data) => {
          console.log(data, "data");
          response.status(200).json(data);
        })
        .catch((e) => {
          response.status(400).json(e);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in MATExamController - LoginForExam",
        error
      );
      response.status(500).json(metaData.message.serverError);
    }
  }
  static PostMatQuiz(request: Request, response: Response) {
    const payload = request.body;
    try {
      MATExamService.PostMatQuiz(payload).then((data) => {
        response.status(200).json(data);
      });
    } catch (error) {
      LogController.writeLog(
        "Exception in MATExamController - PostMatQuiz",
        error
      );
      response.status(500).json(metaData.message.serverError);
    }
  }
  static GetMatQuiz(request: Request, response: Response) {
    try {
      MATExamService.GetMatQuiz().then((data) => {
        console.log(data, "contoller");

        response.status(200).json({ success: true, data: data });
      });
    } catch (error) {
      LogController.writeLog(
        "Exception in MATExamController - GetMatQuiz",
        error
      );
      response
        .status(500)
        .json({ success: false, message: metaData.message.serverError });
    }
  }
  static SubmitQuiz(request: Request, response: Response) {
    const payload = request.body;
    try {
      MATExamService.SubmitQuiz(payload).then((data) => {
        console.log(data);
        response.status(200).json(data);
      });
    } catch (error) {
      LogController.writeLog(
        "Exception in MATExamController - SubmitQuiz",
        error
      );
      response.status(500).json(metaData.message.serverError);
    }
  }
  static BlockUser(request: Request, response: Response) {
    const payload = request.body;
    try {
      MATExamService.BlockUser(payload)
        ?.then((data) => {
          response.status(200).json(data);
        })
        .catch((error) => {
          response.status(500).json(error);
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in MATExamController - BlockUser",
        error
      );
      response.status(500).json(metaData.message.serverError);
    }
  }
  static GetExamMark(request: Request, response: Response) {
    try {
      MATExamService.getMark()
        .then((data) => {
          console.log(data, "data");
          response.status(200).json({ success: true, data: data });
        })
        .catch((err) => {
          response.status(400).json(err);
        });
    } catch (error) {
      console.log(error, "err");
      response.status(500).json({ success: false, error });
    }
  }
}
