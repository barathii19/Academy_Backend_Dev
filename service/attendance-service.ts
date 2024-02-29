import { MongoService } from "./mongo-service";
import { ObjectId } from "mongodb";
import { metaData } from "../environment/meta-data";
import { rejects } from "assert";

export class AttendanceService {
  static postAttendanceDetails(id: any, bodyContent: any) {

    return MongoService.collectionDetails("attendance").then((obj) => {
      const { check_in_time, type, check_out_time } = bodyContent;

      return obj.connection.findOne({
        user_id: id,
        date: new Date().toDateString(),
      })
        .then((data) => {
          if (data && type === "check_in") {
            console.log("check_in again")
            return MongoService.collectionDetails("attendance").then((obj2) => {
              obj2.connection.findOneAndUpdate(
                { user_id: id, date: new Date().toDateString() },
                { $push: { check_in_time: check_in_time }, $set: { type: type, manualCheckout: bodyContent.manualCheckout } }, { upsert: true, returnDocument: "after" }
              );
              return new Promise((resolve, reject) => {
                resolve({
                  auth: true,
                  message: "You've Checked In!",
                  ...data
                });
              });
            });
          } else if (data && type === "check_out") {
            console.log("check_out ")
            return MongoService.collectionDetails("attendance").then((obj3) => {
              obj3.connection.findOneAndUpdate(
                { user_id: id, date: new Date().toDateString() },
                { $push: { check_out_time: check_out_time }, $set: { type: type, availability: bodyContent.availability, manualCheckout: bodyContent.manualCheckout } },
                { returnDocument: "after", upsert: true }
              );
              const { availability, manualCheckout, ...others } = data
              return new Promise((resolve, reject) => {
                resolve({
                  auth: true,
                  message: "You've Checked Out!",
                  ...others
                });
              });
            })
          }
          else {
            console.log("first time checkIn");
            return MongoService.collectionDetails("attendance").then((obj) => {
              obj.connection.insertOne({ ...bodyContent, check_in_time: [bodyContent.check_in_time] });
              return new Promise((resolve, reject) => {
                resolve({
                  auth: true,
                  message: "You've Checked In!",
                  check_in_time: [bodyContent.check_in_time]
                });
              });
            })
          }
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

  static getcheckindetails(id: any, batchId: any) {
    return MongoService.collectionDetails("user").then((userObj) => {
      return userObj.connection.findOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.staff }).then((userData) => {
        if (userData) {
          return MongoService.collectionDetails("attendance").then((attendanceObj) => {
            return attendanceObj.connection.aggregate([
              { $match: { batch: new ObjectId(batchId) } },
              {
                $lookup: {
                  from: metaData.db.collectionDetails.user,
                  localField: 'student',
                  pipeline: [
                    { $project: { password: 0, userGroup: 0, course: 0, batch: 0, creater: 0, branch: 0 } }
                  ],
                  foreignField: '_id',
                  as: 'studentInfo'
                },

              },
              { $project: { student: 0, batch: 0 } }
            ]).toArray()
          })
        } else {
          return new Promise((_, reject) => {
            reject("Staff only can get attendance details")
          })
        }
      })
    })
  }

  static putcheckindetails(id: string, attendancedetails: any) {
    return MongoService.collectionDetails("attendance").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $push: { check_out_time: attendancedetails.check_out_time } }, { upsert: true })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getWeeklyDateByQuery(startDate: any, endDate: any, userId: any, organisationId: any) {
    return MongoService.collectionDetails("attendance").then((obj) => {
      return obj.connection.find({
        user_id: userId,
        organisationId,
        fullDate: { $gte: new Date(startDate).toISOString(), $lte: new Date(endDate).toISOString() }
      }).sort({ fullDate: -1 }).toArray().finally(() => { obj.client.close(); })
    });
  }
  static putcheckinarray(id: string, bodyContent: any) {
    return MongoService.collectionDetails("attendance").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $push: { check_in_time: bodyContent.check_in_time } })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postBatchStudentAttendanceService(id: any, bodyData: any, createrId: any) {
    return MongoService.collectionDetails("batch").then((batchObj) => {
      return batchObj.connection.findOne({ _id: new ObjectId(id) }).then(batchData => {
        if (batchData) {
          if (batchData.inCharge.id === createrId) {
            const batchStudentId = batchData.studentList.map((id: any) => id.toString())
            const isNotValid = bodyData.map((doc: any) => doc.id).filter((id: any) => !batchStudentId.includes(id)).length > 0;
            if (isNotValid) {
              return new Promise((_, reject) => {
                reject("Given student are not in batch student list")
              })
            }
            const attendStatus: any = []

            for (const stdId of batchStudentId) {
              const studentStatus = bodyData.find((doc: any) => doc.id === stdId)
              attendStatus.push({
                id: new ObjectId(stdId),
                status: studentStatus && studentStatus.status ? studentStatus.status : "P"
              })
            }
            return MongoService.collectionDetails("attendance").then((attendObj) => {
              return attendObj.connection.findOne({ batch: new ObjectId(id) }).then((attendanceData) => {
                const attenInfo = {
                  date: new Date().toISOString(),
                  attendance: attendStatus,
                  updateBy: new ObjectId(createrId)
                }
                if (attendanceData) {
                  const attendanceList = attendanceData.list;
                  const index = attendanceList.findIndex((doc: any) => new Date(doc.date).toLocaleDateString() === new Date().toLocaleDateString())
                  if (index != -1) {
                    attendanceList[index] = attenInfo
                  } else {
                    attendanceList.push(attenInfo)
                  }
                  return attendObj.connection.findOneAndUpdate({ batch: new ObjectId(id) }, { $set: { list: attendanceList } }).then(() => {
                    return new Promise((resolve) => {
                      resolve({ message: "your batch attendance updated" })
                    })
                  })
                } else {
                  const attend = {
                    batch: new ObjectId(id),
                    list: [attenInfo]
                  }
                  return attendObj.connection.insertOne(attend)
                }
              }).finally(() => {
                attendObj.client.close()
              })
            })
          } else {
            return new Promise((_, reject) => {
              reject("only batch incharge can update the batch")
            })
          }
        } else {
          return new Promise((_, reject) => {
            reject("Invalid Batch")
          })
        }
      }).finally(() => {
        batchObj.client.close()
      })
    })
  }
  static getBatchAttendanceService(id: any) {
    return MongoService.collectionDetails("attendance").then(obj => {
      return obj.connection.findOne({ batch: new ObjectId(id) }).finally(() => {
        obj.client.close()
      })
    })
  }
  static attendanceRange(id: any) {
    return MongoService.collectionDetails("attendance").then(obj => {
      return obj.connection.findOne({ batch: new ObjectId(id) }).finally(() => {
        obj.client.close()
      })
    })
  }
}