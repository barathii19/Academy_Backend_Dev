import { ObjectId } from "mongodb";
import { IQuiz, ISumbmit_Quiz } from "../model/IQuiz";
import { MongoService } from "./mongo-service";

export class QuizService {
  static addQuiz(quizData: IQuiz, createrId: any) {
    return MongoService.collectionDetails("batch").then((obj) => {
      let studentList: Array<any> = [];
      const batchId: any = quizData.batchId;
      quizData.questions.map((question) => {
        question.questionId = new ObjectId();
        return question;
      });
      obj.connection.findOne({ _id: new ObjectId(batchId) }).then((batch) => {
        studentList = batch?.studentList;
      });
      return MongoService.collectionDetails("quiz").then((obj) => {
        const quiz: any = {};
        studentList = studentList.map((id: any) => {
          return { studentId: id, solved: false, score: [] };
        });
        quiz.batchId = quizData.batchId;
        quiz.createrId = new ObjectId(createrId);
        quiz.moduleId = quizData.moduleId;
        quiz.moduleName = quizData.moduleName;
        quiz.questions = quizData.questions;
        quiz.topic = quizData.topic;
        quiz.type = quizData.type;
        quiz.students = studentList;
        obj.connection
          .insertOne(quiz)
          .then((res) => {
            console.log(res, "res");
            return new Promise((reslove, reject) => {
              reslove({ success: true, message: "Quiz posted" });
            });
          })
          .catch((err) => {
            console.log(err, "errr");
            return new Promise((resolve, reject) => {
              reject(err);
            });
          })
          .finally(() => {
            obj.client.close();
          });
      });
    });
  }
  static getQuiz(id: any) {
    return MongoService.collectionDetails("quiz").then((obj) => {
      return obj.connection
        .aggregate([
          {
            $match: {
              "students.studentId": new ObjectId(id),
            },
          },
          {
            $unwind: "$students",
          },
          {
            $match: {
              "students.studentId": new ObjectId(id),
            },
          },
          {
            $project: {
              topic: 1,
              moduleId: 1,
              moduleName: 1,
              batchId: 1,
              questions: {
                $map: {
                  input: "$questions",
                  as: "question",
                  in: {
                    questionId: "$$question.questionId",
                    question: "$$question.question",
                    options: "$$question.options",
                  },
                },
              },
              date: 1,
              creater: 1,
              studentId: "$students.studentId",
              solved: "$students.solved",
              score: "$students.score",
            },
          },
        ])
        .toArray()
        .then((res) => {
          return new Promise((resolve, reject) => {
            resolve({ success: false, data: res });
          });
        })
        .catch((e) => {
          return new Promise((resolve, reject) => {
            reject(e);
          });
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static submitQuiz(payload: ISumbmit_Quiz) {
    const studentId = payload.student_id;
    const id = payload.quiz_id;
    const answers = payload.student_submit_answer;
    const isAnswersValid = answers.every((answer) => answer.id);
    if (id && isAnswersValid && studentId) {
      return MongoService.collectionDetails("quiz").then((obj) => {
        return obj.connection
          .findOne({
            $and: [
              { "students.studentId": new ObjectId(studentId) },
              { _id: new ObjectId(id) },
            ],
          })
          .then((quiz) => {
            const questions = quiz?.questions;
            const correctCount = answers.reduce((count, userAnswer) => {
              const correctAnswer = questions.find(
                (answer: any) => answer?.questionId.toString() === userAnswer.id
              );
              return correctAnswer && correctAnswer.answer === userAnswer.option
                ? count + 1
                : count;
            }, 0);
            const percentage = (correctCount / answers.length) * 100;
            return obj.connection.findOneAndUpdate(
              {
                $and: [
                  { "students.studentId": new ObjectId(studentId) },
                  { _id: new ObjectId(id) },
                ],
              },
              {
                $set: {
                  "students.$.score": percentage,
                  "students.$.solved": true,
                },
              }
            );
          })
          .then((d) => {
            console.log(d);
            return new Promise((resolve, reject) => {
              resolve({ success: true, message: "Your score update" });
            });
          })
          .catch((e) => {
            console.log(e, "error");
            return new Promise((resolve, reject) => {
              reject(e);
            });
          })
          .catch((e) => {
            console.log(e);
            return new Promise((resolve, reject) => {
              reject(e);
            });
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject({ success: false, message: "Invalid payload" });
      });
    }
  }
}
