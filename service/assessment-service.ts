import { ObjectId } from "mongodb";
import { MongoService } from "./mongo-service";
import { metaData } from "../environment/meta-data";
import { ISubmitAssessment } from "../model/IAssessment";

export class AssessmentService {
  static getAssessmentService(batchId: any) {
    return MongoService.collectionDetails("assessment").then((obj) => {
      return obj.connection
        .find({ batch: new ObjectId(batchId) })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postAssessmentService(bodyData: any, file: any, createrId: any) {
    return MongoService.collectionDetails("batch").then((batchObj) => {
      return batchObj.connection
        .findOne({
          _id: new ObjectId(bodyData.batch),
          "inCharge.id": createrId,
        })
        .then((batchData) => {
          if (batchData) {
            const studentList = batchData.studentList.map((id: any) => {
              return {
                id,
                attendance: null,
                mark: 0,
                githubLink: "",
                remarks: "",
                status: "pending",
              };
            });
            const assessment = {
              ...bodyData,
              attachment: file,
              batch: new ObjectId(bodyData.batch),
              assessment: studentList,
            };
            return MongoService.collectionDetails("assessment").then(
              (testObj) => {
                return testObj.connection.insertOne(assessment).finally(() => {
                  testObj.client.close();
                });
              }
            );
          } else {
            return new Promise((_, reject) => {
              reject("invalid batch");
            });
          }
        })
        .finally(() => {
          batchObj.client.close();
        });
    });
  }
  static getAssessmentInfoService(id: any) {
    return MongoService.collectionDetails("assessment").then((obj) => {
      return obj.connection
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $unwind: {
              path: "$assessment",
            },
          },
          {
            $lookup: {
              from: metaData.db.collectionDetails.user,
              foreignField: "_id",
              localField: "assessment.id",
              let: {
                tId: "$assessment.id",
                tmark: "$assessment.mark",
                tattendance: "$assessment.attendance",
                tRoot: "$$ROOT",
              },
              pipeline: [
                {
                  $project: {
                    mark: "$$tmark",
                    attendance: "$$tattendance",
                    totalMark: "$$tRoot.totalMark",
                    date: "$$tRoot.date",
                    timings: "$$tRoot.timings",
                    title: "$$tRoot.title",
                    firstName: "$$ROOT.firstName",
                    lastName: "$$ROOT.lastName",
                    email: "$$ROOT.email",
                    mobileNumber: "$$ROOT.mobileNumber",
                    profileColor: "$$ROOT.profileColor",
                  },
                },
              ],
              as: "assessmentList",
            },
          },
          {
            $unwind: {
              path: "$assessmentList",
            },
          },
          {
            $group: {
              _id: "$_id",
              assessmentList: {
                $push: "$assessmentList",
              },
            },
          },
        ])
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postAssessmentInfoService(id: any, bodyData: any[]) {
    return MongoService.collectionDetails("assessment").then((obj) => {
      return obj.connection
        .findOne({ _id: new ObjectId(id) })
        .then((data) => {
          if (data) {
            const updatedAssessment = [];
            for (const info of data.assessment) {
              const avaData = bodyData.find(
                (doc: any) => doc.id === info.id.toString()
              );
              if (avaData) {
                updatedAssessment.push({
                  id: info.id,
                  attendance: avaData.attendance,
                  mark: avaData.mark,
                });
              } else {
                updatedAssessment.push(info);
              }
            }
            return obj.connection.findOneAndUpdate(
              { _id: new ObjectId(id) },
              { $set: { assessment: updatedAssessment } }
            );
          } else {
            return new Promise((_, reject) => {
              reject("Invalid Id");
            });
          }
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteAssessmentService(id: any, createrId: any) {
    return MongoService.collectionDetails("assessment").then((obj) => {
      return obj.connection
        .findOne({ _id: new ObjectId(id) })
        .then((data) => {
          if (data) {
            const batchId = data.batch;
            return MongoService.collectionDetails("batch").then((batchobj) => {
              return batchobj.connection
                .findOne({
                  _id: new ObjectId(batchId),
                  "inCharge.id": createrId,
                })
                .then((batchData) => {
                  if (batchData) {
                    return obj.connection.deleteOne({ _id: new ObjectId(id) });
                  } else {
                    return new Promise((_, reject) => {
                      reject("Invalid user");
                    });
                  }
                })
                .finally(() => {
                  batchobj.client.close();
                });
            });
          } else {
            return new Promise((_, reject) => {
              reject("Assessment not available");
            });
          }
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static studentAssessmentService(id: any) {
    return MongoService.collectionDetails("assessment").then((obj) => {
      return obj.connection
        .aggregate([
          { $unwind: "$assessment" },
          {
            $match: {
              "assessment.id": new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: metaData.db.collectionDetails.batch,
              localField: "batch",
              foreignField: "_id",
              as: "batch",
            },
          },
          {
            $unwind: "$batch",
          },
          {
            $lookup: {
              from: metaData.db.collectionDetails.course,
              let: { courseId: "$batch.course.id", moduleId: "$module" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$courseId"],
                    },
                  },
                },
                {
                  $project: {
                    modules: {
                      $filter: {
                        input: "$modules",
                        as: "mod",
                        cond: { $eq: ["$$mod.moduleId", "$$moduleId"] },
                      },
                    },
                  },
                },
                {
                  $unwind: "$modules",
                },
                {
                  $project: {
                    _id: 0,
                    moduleName: "$modules.moduleName",
                  },
                },
              ],
              as: "module_details",
            },
          },
          {
            $unwind: "$module_details",
          },
        ])
        .toArray();
    });
  }
  static submitAssessmentService(id: any, payload: ISubmitAssessment) {
    const { studentId, assessmentId, githubLink, status, remarks, mark } =
      payload;
  if(studentId && assessmentId){
    return MongoService.collectionDetails("user").then((obj) => {
        return obj.connection
          .findOne({ _id: new ObjectId(id) })
          .then((obj) => {
            if (obj) {
              if (obj.userGroup === "student") {
                return MongoService.collectionDetails("assessment")
                  .then((obj) => {
                    return obj.connection.findOneAndUpdate(
                      {
                        $and: [
                          { _id: new ObjectId(assessmentId) },
                          { "assessment.id": new ObjectId(studentId) },
                        ],
                      },
                      {
                        $set: {
                          "assessment.$.githubLink": githubLink,
                          "assessment.$.attendance": true,
                        },
                      }
                    )
                  })
                  .catch((e) => {
                    return new Promise((resolve, reject) => {
                      reject(e);
                    });
                  });
              }
              if (obj.userGroup === "staff") {
                console.log(12345678);
                console.log(mark, remarks, status);
                return MongoService.collectionDetails("assessment")
                  .then((obj) => {
                    return obj.connection.findOneAndUpdate(
                        {
                          $and: [
                            { _id: new ObjectId(assessmentId) },
                            { "assessment.id": new ObjectId(studentId) },
                          ],
                        },
                        {
                          $set: {
                            "assessment.$.mark": mark,
                            "assessment.$.remarks": remarks,
                            "assessment.$.status": status,
                          },
                        }
                      )
                  })
                  .catch((e) => {
                    return new Promise((resolve, reject) => {
                      reject(e);
                    });
                  });
              }
            } else {
              return new Promise((resolve, reject) => {
                reject({ success: false, message: "Invalid user" });
              });
            }
          })
          .catch((e) => {
            return new Promise((resolve, reject) => {
              reject({ success: false, message: e });
            });
          });
      });
  } else {
    return new Promise((resolve, reject) => {
        reject({ success: false, message: "Invalid payload" })
    })
  }
  }
}
