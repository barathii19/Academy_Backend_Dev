import { MongoService } from "./mongo-service";
import { EmailController } from "../controller/email-controller";
import { metaData } from "../environment/meta-data";
import { IMAT_OTP_DETAILS, IMAT_OTP_PAYLOAD } from "../model/IMATOTPDetails";
import { ObjectId } from "mongodb";
import {
  IMAT_ANSWERS,
  IMAT_QUIZ,
  IMAT_USER_PAYLOAD,
} from "../model/IMAT-UserDetails";

export class MATExamService {
  static RegisterExam(userData: IMAT_USER_PAYLOAD) {
    let userExist: Boolean = false;
    if (userData.email) {
      return MongoService.collectionDetails("matExam")
        .then((obj) => {
          return obj.connection
            .findOne({ email: userData?.email })
            .then((user) => {
              if (user) {
                userExist = true;
              }
              if (!userExist) {
                return MATExamService.SendOtp(userData);
              } else {
                if (user?.isCompleted) {
                  return new Promise((resolve, reject) => {
                    reject({ message: "Already Completed the exam" });
                  });
                } else if (user?.malpractice) {
                  return new Promise((resolve, reject) => {
                    reject({ message: "You are restricted" });
                  });
                } else if (!user?.isCompleted && !user?.malpractice) {
                  return MATExamService.SendOtp(userData);
                }
              }
            });
        })
        .catch((err) => {
          return new Promise((resolve, reject) => {
            reject(err);
          });
        });
    } else {
      return new Promise((resolve, reject) => {
        reject({ success: false, message: "Invalid Payload" });
      });
    }
  }
  static SendOtp(userData: any) {
    let otp = Math.floor(1000 + Math.random() * 9000);
    return EmailController.sendMail({
      fromEmail: metaData.email.fromEmail,
      body: metaData.email.template.matOtp.replace("$otp", otp.toString()),
      subject: "OTP",
      toEmail: userData.email,
    })
      .then((email) => {
        if (email.status) {
          let matOtp: IMAT_OTP_DETAILS = {
            otp,
            email: userData.email,
            name: userData.name,
            contact: userData.contact,
            createdAt: new Date(),
          };
          return MongoService.collectionDetails("matOtp").then((obj) => {
            return obj.connection
              .findOne({ email: matOtp.email })
              .then((otpData) => {
                if (otpData) {
                  return obj.connection
                    .findOneAndUpdate(
                      { email: matOtp.email },
                      {
                        $set: {
                          otp: matOtp.otp,
                        },
                      }
                    )
                    .then((otp) => {
                      return {
                        success: true,
                        data: {
                          otpId: otp.value?._id,
                          email: matOtp.email,
                          name: matOtp.name,
                        },
                        message: "OTP sended",
                      };
                    });
                } else {
                  return obj.connection.insertOne(matOtp).then((otpData) => {
                    return {
                      success: true,
                      data: {
                        otpId: otpData.insertedId,
                        email: matOtp.email,
                        name: matOtp.name,
                      },
                      message: "OTP sended",
                    };
                  });
                }
              })
              .catch((e) => {
                return new Promise((resolve, reject) => {
                  reject(e);
                });
              });
          });
        } else {
          return new Promise((reslove, reject) => {
            reject({ success: false, message: "Email not sent!" });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return new Promise((resolve, reject) => {
          reject(err);
        });
      });
  }
  static LoginViaOtp(payload: IMAT_OTP_PAYLOAD) {
    const { id, otp } = payload;
    if (id && otp) {
      return MongoService.collectionDetails("matOtp").then((obj) => {
        return obj.connection
          .findOne({ _id: new ObjectId(id) })
          .then((otpObj) => {
            if (otp == otpObj?.otp) {
              return MongoService.collectionDetails("matExam").then((obj) => {
                const userData = {
                  name: otpObj?.name,
                  email: otpObj?.email,
                  contact: otpObj?.contact,
                  isCompleted: false,
                };
                return obj.connection
                  .insertOne(userData)
                  .then((d) => {
                    return new Promise((resolve, reject) => {
                      resolve({
                        success: true,
                        data: { userId: d.insertedId, name: otpObj?.name },
                        message: "Login successfully",
                      });
                    });
                  })
                  .catch((e) => {
                    return new Promise((resolve, reject) => {
                      reject(e);
                    });
                  });
              });
            } else {
              return new Promise((resolve, reject) => {
                reject({ success: false, message: "OTP Invalid" });
              });
            }
          })
          .catch((e) => {
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
  static PostMatQuiz(payload: IMAT_QUIZ) {
    return MongoService.collectionDetails("matQuiz").then((obj) => {
      if (payload.type == "Aptitude") {
        payload.typeId = "01";
      } else if (payload.type == "Programming") {
        payload.typeId = "02";
      }
      return obj.connection
        .insertOne(payload)
        .then(() => {
          return new Promise((resolve, reject) => {
            resolve({ success: true, message: "Quiz added" });
          });
        })
        .catch((e) => {
          return new Promise((resolve, reject) => {
            reject({ success: false, message: e });
          }).finally(() => {
            obj.client.close();
          });
        });
    });
  }
  static GetMatQuiz() {
    return MongoService.collectionDetails("matQuiz").then((obj) => {
      return obj.connection
        .aggregate([{ $sample: { size: 10 } }, { $project: { answer: 0 } }])
        .toArray()
        .then((data) => {
          return data;
        })
        .catch((e) => {
          return new Promise((resolve, reject) => {
            reject(e);
          });
        });
    });
  }
  static SubmitQuiz(payload: IMAT_ANSWERS) {
    const { id, answers } = payload;
    if (id) {
      return MongoService.collectionDetails("matQuiz").then((obj) => {
        return obj.connection
          .find({}, { projection: { answer: 1, _id: 1 } })
          .toArray()
          .then((quiz) => {
            return MongoService.collectionDetails("matExam")
              .then((obj) => {
                const correctCount = answers.reduce((count, userAnswer) => {
                  const correctAnswer = quiz.find(
                    (answer) => answer._id.toString() === userAnswer.id
                  );
                  return correctAnswer &&
                    correctAnswer.answer === userAnswer.answer
                    ? count + 1
                    : count;
                }, 0);
                const percentage = (correctCount / answers.length) * 100;
                return obj.connection
                  .updateOne(
                    { _id: new ObjectId(id) },
                    {
                      $set: {
                        isCompleted: true,
                        mark: percentage,
                      },
                    }
                  )
                  .then(() => {
                    return new Promise((resolve, reject) => {
                      resolve({
                        success: true,
                        message: "Exam completed",
                        data: {
                          percentage: percentage,
                        },
                      });
                    });
                  });
              })
              .finally(() => {
                obj.client.close();
              });
          })
          .catch((e) => {
            return new Promise((resolve, reject) => {
              reject(e);
            });
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject({ success: false, message: "Invalid user" });
      });
    }
  }
  static BlockUser(payload: any) {
    const { id } = payload;
    if (id) {
      return MongoService.collectionDetails("matExam").then((obj) => {
        return obj.connection
          .updateOne({ _id: new ObjectId(id) }, { $set: { malpractice: true } })
          .then(() => {
            return new Promise((resolve, reject) => {
              resolve({ message: "User is restricted" });
            });
          })
          .catch((e) => {
            return new Promise((resolve, reject) => {
              reject(e);
            });
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject({ success: false, message: "Invalid Payload" });
      });
    }
  }
}
