import { MongoService } from "./mongo-service";
import {
  IBatchDetails,
  IBatchPayload,
  IPostBatchDetails,
} from "../model/IBatchDetails";
import { ObjectId } from "mongodb";
import { OrganisationService } from "./new-organisation-service";
import { Request } from "express";
import { metaData } from "../environment/meta-data";
import { IPostStaffDetails } from "../model/IStaffDetails";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { MetadataController } from "../controller/metadata_controller";

export class BatchService {
  static getBatchDetails(request: Request) {
    const adminId = decodeJwt(request)?.id;
    const couseId: any = request.query?.course;
    const query: any = { creater: adminId };
    if (couseId) {
      query["course.id"] = couseId;
    }
    if (adminId) {
      return MongoService.collectionDetails("batch").then((obj) => {
        return obj.connection
          .find(query)
          .toArray()
          .finally(() => {
            obj.client.close();
          });
      });
    } else {
      return new Promise((res, rej) => {
        rej({
          message: "JWT mismatch",
        });
      });
    }
  }
  static getValidBatchDetails(details: any) {
    const batchData: any = {};
    const validKeys = ["batchName", "duration"];
    for (const key of Object.keys(details)) {
      const value = details[key];
      if (validKeys.includes(key)) {
        batchData[key] = value;
      }
    }
    return batchData;
  }
  static updateBatchService(id: string, bodyData: any) {
    const validBatchDetails = this.getValidBatchDetails(bodyData);
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: validBatchDetails }
        )
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getSpecificBatchOfStudent(
    organisationId: string,
    branch: string,
    studentId: string
  ) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .findOne({
          organisationId,
          branch,
          "batchStudentList.studentId": studentId,
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getBatchBranchDetails(branch: String) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .find({ branch })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getSpecificTeacherDetails(id: any) {
    console.log(id, "id");
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection.aggregate([
        { $match: { "inCharge.id": id } },
        {
          $lookup: {
            from: metaData.db.collectionDetails.assessment,
            localField: "createrId",
            foreignField: "inCharge.id",
            as: "assessment_details",
          },
        },
        {
          $lookup: {
            from: metaData.db.collectionDetails.quiz,
            localField: "createrId",
            foreignField: "inCharge.id",
            as: "quiz_details",
          },
        },
        {
          $lookup: {
            from: metaData.db.collectionDetails.user,
           let: { studentId: "$studentList" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$studentId"] }
                }
              }
            ],
            as: "studentList"
          }
        }
      ]).toArray()
    });
  }
  static postBatchDetails(batchDetails: IBatchDetails[]) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection.insertMany(batchDetails).finally(() => {
        obj.client.close();
      });
    });
  }
  static postBatchDetail(bodyContent: IBatchPayload, request: Request) {
    const batchDetail: IPostBatchDetails = {
      ...bodyContent,
      studentList: [],
      creater: "",
      branch: "",
      _id: "",
      completed: false,
      info: {},
    };
    const batchObjectId = new ObjectId();
    const createrData: any = decodeJwt(request);
    return MongoService.collectionDetails("user").then((userObj) => {
      return userObj.connection
        .findOne({
          _id: new ObjectId(batchDetail.inCharge.id),
          userGroup: metaData.userGroup.staff,
        })
        .then((staffDetails: IPostStaffDetails | any) => {
          if (staffDetails) {
            batchDetail.branch = staffDetails.branch;
            batchDetail.creater = createrData?.id;
            batchDetail.studentList = [];
            batchDetail._id = batchObjectId;
            batchDetail.course = {
              id: new ObjectId(bodyContent.course.id),
              name: bodyContent.course.name,
            };
            const assignedIn = [...staffDetails.assignedIn];
            assignedIn.push({
              batchId: batchObjectId,
              batchName: bodyContent.batchName,
            });
            userObj.connection
              .findOneAndUpdate(
                { _id: new ObjectId(batchDetail.inCharge.id) },
                {
                  $set: {
                    assignedIn: assignedIn,
                  },
                }
              )
              .finally(() => {
                userObj.client.close();
              });
            return MongoService.collectionDetails("batch").then((obj) => {
              return obj.connection.insertOne(batchDetail).finally(() => {
                obj.client.close();
              });
            });
          } else {
            return new Promise((resolve, reject) => {
              reject("Please choose vaild staff");
            });
          }
        });
    });
  }
  static addStudentToBatch(id: string, batchDetail: any) {
    const { studentSelectedToAdd } = batchDetail;
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $addToSet: {
              studentList: {
                $each: studentSelectedToAdd.map(
                  (data: string) => new ObjectId(data)
                ),
              },
            },
          }
        )
        .then((data: any) => {
          for (const studentId of studentSelectedToAdd) {
            return MongoService.collectionDetails("user").then((obj) => {
              return (
                obj.connection
                  // .updateOne({ _id: new ObjectId(studentId) }, { $push: { batch: { $each: [{ id: new ObjectId(id), name: batchName }] } } })
                  .updateOne(
                    { _id: new ObjectId(studentId) },
                    { $set: { currentBatchId: new ObjectId(id) } }
                  )
              );
            });
          }
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static removeStudentFromBatch(id: string, batchDetail: any) {
    const { studentId } = batchDetail;
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .updateOne(
          { _id: new ObjectId(id) },
          { $pull: { studentList: new ObjectId(studentId) } }
        )
        .then((data: any) => {
          return MongoService.collectionDetails("user").then((obj) => {
            return (
              obj.connection
                // .updateOne({ _id: new ObjectId(studentId) }, { $push: { batch: { $each: [{ id: new ObjectId(id), name: batchName }] } } })
                .updateOne(
                  { _id: new ObjectId(studentId) },
                  { $set: { currentBatchId: null } }
                )
            );
          });
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static delicateBatch(id: string, batchDetail: any) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: batchDetail })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deActivateBatch(id: string, batchDetail: IBatchDetails) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: batchDetail })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteBatchDetail(id: string) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }
  static generateBatchID(category: string, organisationId: string) {
    let flag = true;
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .then((data) => {
          if (!data) {
            flag = false;
          }
          return OrganisationService.getSpecificOrganisation(
            organisationId
          ).then((organisation: any) => {
            return new Promise((resolve, reject) => {
              let batchID =
                `${organisation?.organisationName}-B-` +
                category[0]?.toLocaleUpperCase() +
                category[1]?.toUpperCase() +
                "-" +
                new Date().getFullYear().toString()[2] +
                new Date().getFullYear().toString()[3];
              if (flag) {
                resolve(batchID + (data.length + 1));
              } else {
                resolve(batchID + 1);
              }
            });
          });
        })
        .catch(() => {
          return new Promise((resolve, reject) => {
            reject();
          });
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getBatchByBranch(branchId: string) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .find({ branch: new ObjectId(branchId) })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static updateCompletedStatus(id: any, batchid: any, bodyData: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .findOne({ userGroup: metaData.userGroup.staff, _id: new ObjectId(id) })
        .then((data) => {
          if (data) {
            return MongoService.collectionDetails("batch").then((batchobj) => {
              return batchobj.connection
                .findOne({
                  _id: new ObjectId(batchid),
                  courseProgress: bodyData.id,
                })
                .then((data1) => {
                  if (data1) {
                    return new Promise((resolve, reject) => {
                      resolve("Already Completed");
                    });
                  } else {
                    return batchobj.connection
                      .findOneAndUpdate(
                        { _id: new ObjectId(batchid) },
                        { $push: { courseProgress: bodyData.id } }
                      )
                      .then((data) => {
                        return new Promise((resolve, reject) => {
                          resolve("Updated successfully");
                        });
                      })
                      .finally(() => {
                        batchobj.client.close();
                      });
                  }
                });
            });
          } else {
            return new Promise((resolve, reject) => {
              reject("Invalid details");
            });
          }
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getBatchRecord(id: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .findOne({ _id: new ObjectId(id) })
        .then((data: any) => {
          const usergroup = data.userGroup;
          if (usergroup === metaData.userGroup.admin) {
            return MongoService.collectionDetails("batch").then((obj1) => {
              return obj1.connection
                .find({ creater: id })
                .toArray()
                .finally(() => {
                  obj1.client.close();
                });
            });
          } else if (usergroup === metaData.userGroup.staff) {
            return MongoService.collectionDetails("batch").then((obj1) => {
              return obj1.connection
                .find({ "inCharge.id": id })
                .toArray()
                .finally(() => {
                  obj1.client.close();
                });
            });
          } else if (usergroup === metaData.userGroup.student) {
            return MongoService.collectionDetails("batch").then((obj1) => {
              return obj1.connection
                .find({ studentList: new ObjectId(id) })
                .toArray()
                .finally(() => {
                  obj1.client.close();
                });
            });
          }
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getCourseAndStudent(batchId: any) {
    return MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .aggregate([
          { $match: { _id: new ObjectId(batchId) } },
          {
            $lookup: {
              from: metaData.db.collectionDetails.course,
              localField: "course.id",
              foreignField: "_id",
              as: "CourseData",
            },
          },
          {
            $lookup: {
              from: metaData.db.collectionDetails.user,
              let: { list: "$studentList" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$_id", "$$list"],
                    },
                  },
                },
                { $project: { userGroup: 0, password: 0 } },
              ],
              as: "studentData",
            },
          },
        ])
        .toArray();
    });
  }
  static getBatchByQueryService(query: any) {
    if (query && query.course) {
      return MongoService.collectionDetails("batch").then((obj) => {
        return obj.connection
          .find({ "course.id": new ObjectId(query.course) })
          .toArray()
          .finally(() => {
            obj.client.close();
          });
      });
    } else {
      return new Promise((_, reject) => {
        return reject("Available Query (course)");
      });
    }
  }
  static updateBatchModulesService(id: any, bodyData: any, updatedBy: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .findOne({
          _id: new ObjectId(updatedBy),
          userGroup: metaData.userGroup.staff,
        })
        .then((userData) => {
          if (userData) {
            const assignedBatch = userData.assignedIn.map((doc: any) =>
              doc.batchId.toString()
            );
            if (assignedBatch.includes(id)) {
              return MongoService.collectionDetails("batch").then(
                async (batchObj) => {
                  try {
                    const batchData: any = await batchObj.connection
                      .aggregate([
                        { $match: { _id: new ObjectId(id) } },
                        {
                          $lookup: {
                            from: metaData.db.collectionDetails.course,
                            localField: "course.id",
                            foreignField: "_id",
                            as: "courseData",
                          },
                        },
                      ])
                      .toArray();
                    const courseInfo = batchData[0].courseData[0];
                    let batchModuleInfo = batchData[0].info;
                    if (
                      batchModuleInfo &&
                      Object.keys(batchModuleInfo).length > 0
                    ) {
                      if (batchModuleInfo.topic.includes(bodyData.topicId)) {
                        return new Promise((_, reject) => {
                          reject("This topic already completed");
                        });
                      }
                      if (batchModuleInfo.module.includes(bodyData.moduleId)) {
                        return new Promise((_, reject) => {
                          reject("This module already completed");
                        });
                      }
                    } else {
                      batchModuleInfo = {
                        module: [],
                        topic: [],
                      };
                    }
                    const totalCourseModuleInfo: any = {};
                    for (const doc of courseInfo.modules) {
                      const topics = doc.topics.map((doc: any) => doc.topicId);
                      totalCourseModuleInfo[doc.moduleId] = topics;
                    }
                    const selectedModuleTopicId =
                      totalCourseModuleInfo[bodyData.moduleId];
                    if (
                      !(
                        selectedModuleTopicId &&
                        selectedModuleTopicId.includes(bodyData.topicId)
                      )
                    ) {
                      return new Promise((_, reject) => {
                        reject("Please check the module and topic id");
                      });
                    }
                    batchModuleInfo.topic.push(bodyData.topicId);
                    const flag =
                      selectedModuleTopicId.filter(
                        (id: any) => !batchModuleInfo.topic.includes(id)
                      ).length === 0;
                    if (flag) {
                      batchModuleInfo.module.push(bodyData.moduleId);
                    }

                    return batchObj.connection
                      .updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { info: batchModuleInfo } }
                      )
                      .finally(() => {
                        batchObj.client.close();
                      });
                  } catch (error) {
                    return new Promise((_, reject) => {
                      reject("batchservice-async error");
                    });
                  }
                }
              );
            } else {
              return new Promise((_, reject) => {
                reject(userData.firstName + ", you can only update your batch");
              });
            }
          } else {
            return new Promise((_, reject) => {
              reject("Staff only can update the batch module");
            });
          }
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
}
