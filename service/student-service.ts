import { MongoService } from "./mongo-service";
import { IPostStudentDetails, IStudentDetails, IStudentPayload } from "../model/IStudentDetails";
import { ObjectId } from "mongodb";
import { metaData } from "../environment/meta-data";
import { Request } from "express"
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { HelperController } from "../controller/Helper-controller";
import { LogController } from "../controller/log-controller";
export class StudentService {
  static getStudentDetails(id: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection.findOne({ _id: new ObjectId(id) }).then(async (userData) => {
        try {
          let aggregateQuery: any = [
            {
              $lookup: {
                'from': metaData.db.collectionDetails.payment,
                'let': { 'payment': '$course.payment' },
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$in': ['$_id', '$$payment']
                      }
                    }
                  }
                ],
                'as': 'paymentData'
              }
            },
            { $project: { password: 0, userGroup: 0 } }
          ]
          if (userData) {
            const userGroup = userData.userGroup;
            if (userGroup === metaData.userGroup.admin) {
              aggregateQuery.unshift({ $match: { userGroup: metaData.userGroup.student, creater: new ObjectId(id) } })
            } else if (userGroup === metaData.userGroup.staff) {
              const assignedBatchId = userData.assignedIn.map((doc: any) => doc.batchId)
              const batchList = await MongoService.collectionDetails("batch").then(batchObj => {
                return batchObj.connection.aggregate([
                  { $match: { _id: { $in: assignedBatchId } } }
                ]).toArray().finally(() => {
                  batchObj.client.close()
                })
              })
              const staffStudentId = batchList.map(doc => doc.studentList).flat(1)
              aggregateQuery.unshift({ $match: { userGroup: metaData.userGroup.student, _id: { $in: staffStudentId } } })

            } else if (userGroup === metaData.userGroup.recruiter) {
              aggregateQuery.unshift({
                $lookup: {
                  from: metaData.db.collectionDetails.interview,
                  localField: '_id',
                  foreignField: 'student',
                  as: 'interviewScheduledInfo'
                },
              })
              aggregateQuery.unshift({ $match: { userGroup: metaData.userGroup.student } })
            } else {
              aggregateQuery.unshift({ $match: { userGroup: metaData.userGroup.student } })
            }
            return obj.connection.aggregate(aggregateQuery).toArray()
          } else {
            return new Promise((_, reject) => {
              reject("Invalid User")
            })
          }
        } catch (error) {
          return new Promise((_, reject) => {
            reject(LogController.errorMes("studentserviceasyncerror-", error))
          })
        }
      })
    });
  }
  static getSpecificStudentDetails(id: string) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.findOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }
  static postStudentDetails(studentDetails: IStudentDetails[]) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.insertMany(studentDetails).finally(() => {
        obj.client.close();
      });
    });
  }
  static postStudentDetail(studentDetail: IStudentDetails) {
    console.log("studentDetail", studentDetail);

    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.insertOne(studentDetail).finally(() => {
        obj.client.close();
      });
    });
  }

  static updateNewCourse(id: string, req: any) {
    const { course, section } = req
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection
        .updateOne({ studentId: id }, { $push: { course: req } })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getValidStudentData(details: any) {
    const validData: any = {}
    const validKeys = ["firstName", "lastName", "email", "mobileNumber"]
    for (const key of Object.keys(details)) {
      const value = details[key];
      if (validKeys.includes(key)) {
        validData[key] = value
      }
    }
    return validData
  }
  static updateStudentDetail(id: string, studentDetail: any) {
    const validStudentData = this.getValidStudentData(studentDetail);
    if (Object.keys(validStudentData).length > 0) {
      return MongoService.collectionDetails("user").then((obj) => {
        return obj.connection
          .updateOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.student }, { $set: validStudentData })
          .finally(() => {
            obj.client.close();
          });
      });
    } else {
      return new Promise((res, rej) => {
        rej({
          message: "Check the payload. You can only update firstName,lastName,email and mobileNumber"
        })
      })
    }

  }
  static deleteStudentDetail(id: string) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }
  static getStudentBranchDetails(branch: String) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.find({ branch }).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  static getOrganisationStudentDetails(organisationId: string, branch: String) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.find({ organisationId, branch }).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  static createStudent(id: string, bodyData: IStudentPayload) {
    return new Promise((resolve, reject) => {
      MongoService.collectionDetails("user").then(obj => {
        return obj.connection.findOne({ userGroup: metaData.userGroup.admin, _id: new ObjectId(id) }).then(async (admin) => {
          try {
            const student: any = {};
            const payment: any = {};
            const courseCostDetails: any = {}
            let attendance: any = {}
            const studentObjectId = new ObjectId();
            const paymentObjectId = new ObjectId();
            let flag = false;
            if (admin) {
              student.firstName = bodyData.firstName;
              student.lastName = bodyData.lastName;
              student.mobileNumber = bodyData.mobileNumber;
              student.email = bodyData.email;
              student._id = studentObjectId;
              student.isActive = true;
              student.userGroup = metaData.userGroup.student;
              student.creater = new ObjectId(id)
              student.branch = new ObjectId(admin.branch)
              student.password = "12345678"
              student.profileColor = HelperController.getRandomColor()
            }

            await MongoService.collectionDetails("batch").then(async (batchObj) => {
              await batchObj.connection.findOne({ _id: new ObjectId(bodyData.batch.id) }).then((batchData) => {
                if (batchData) {
                  if (batchData.course.id.toString() === bodyData.course.id) {
                    student.course = [{ ...bodyData.course, payment: paymentObjectId }];
                    student.batch = [bodyData.batch];
                    flag = true
                  } else {
                    reject("Batch and Course is Mismatch")
                  }
                } else {
                  reject("Batch Is Missing")
                }
              })
              if (flag) {
                batchObj.connection.updateOne({ _id: new ObjectId(bodyData.batch.id) }, { $push: { studentList: studentObjectId } })
              }
              return
            })

            if (!flag) {
              return
            }

            await MongoService.collectionDetails("course").then((courseObj) => {
              return courseObj.connection.findOne({ _id: new ObjectId(bodyData.course.id) }).then((courseInfo: any) => {
                courseCostDetails.price = courseInfo.offeredPrice
              }).finally(() => {
                courseObj.client.close()
              })
            })

            if (!(bodyData.payment.paidAmount === courseCostDetails.price) && bodyData.payment.paymentMethod === "fullPayment") {
              reject("Course Cost Mismatch")
              return;
            }
            if (bodyData.payment.paymentMode === "online" && !bodyData.payment.transactionId) {
              reject("Transaction Id Need")
              return;
            }
            payment._id = paymentObjectId;
            payment.payment = [{
              paymentMethod: bodyData.payment.paymentMethod,
              paymentMode: bodyData.payment.paymentMode,
              amount: bodyData.payment.paidAmount,
              createAt: new Date()
            }]
            payment.course = new ObjectId(bodyData.course.id);
            payment.batch = new ObjectId(bodyData.batch.id);
            payment.student = studentObjectId

            if (bodyData.payment.paymentMethod === "fullPayment") {
              payment.isComplete = true;
              payment.pendingAmount = 0
            }

            if (bodyData.payment.paymentMode === "online") {
              payment.payment[0].transactionId = bodyData.payment.transactionId
            }

            if (bodyData.payment.paymentMethod === "installment") {
              payment.pendingAmount = courseCostDetails.price - bodyData.payment.paidAmount
              payment.isComplete = false
              payment.paidAmount = bodyData.payment.paidAmount
              payment.payment[0].amount = bodyData.payment.paidAmount
            }

            attendance = {
              student: studentObjectId,
              batch: new ObjectId(bodyData.batch.id),
              attendance: []
            }

            await MongoService.collectionDetails("payment").then((paymentObj) => {
              return paymentObj.connection.insertOne(payment).then(() => {
                return obj.connection.insertOne(student).then(() => {
                  MongoService.collectionDetails("attendance").then((attendanceObj) => {
                    return attendanceObj.connection.insertOne(attendance).then(() => {
                      resolve("Student Created Successfully")
                    }).finally(() => {
                      attendanceObj.client.close()
                    })
                  })
                })
              }).finally(() => {
                paymentObj.client.close()
                obj.client.close()
              })
            })
          } catch (error) {
            return new Promise((_, reject) => {
              reject(LogController.errorMes("studentservicepostasyncerror-", error))
            })
          }
        })
      })
    })
  }
  static updateStudentPaymentService(id: string, bodyContent: any, createrId: any) {
    return MongoService.collectionDetails("user").then(userObj => {
      return userObj.connection.findOne({ _id: new ObjectId(createrId), userGroup: metaData.userGroup.admin }).then((userData) => {
        if (userData) {
          return MongoService.collectionDetails("payment").then(obj => {
            return obj.connection.findOne({ _id: new ObjectId(id) }).then(async (data) => {
              if (data) {
                let flag = false;
                try {
                  const studentInfo = await userObj.connection.findOne({ _id: new ObjectId(data.student), creater: new ObjectId(createrId) })
                  if (studentInfo) {
                    flag = true
                  }
                } catch (error) {
                  return new Promise((_, reject) => {
                    reject(LogController.errorMes("studentservice-", error))
                  })
                }
                if (!flag) {
                  return new Promise((_, reject) => {
                    reject("only branch admin can update")
                  })
                }
                if (data.isComplete) {
                  return new Promise((_, reject) => {
                    reject("Already user paid a full amount")
                  })
                }
                const existingTransaction = data.payment;
                if (data.pendingAmount < bodyContent.paidAmount) {
                  return new Promise((_, reject) => {
                    reject("Given amount is greater than pending amount")
                  })
                }
                const payment: any = {
                  paymentMethod: existingTransaction[existingTransaction.length - 1].paymentMethod,
                  paymentMode: bodyContent.paymentMode,
                  amount: bodyContent.paidAmount,
                  createAt: new Date(),
                }
                if (bodyContent.transactionId && bodyContent.paymentMode === "online") {
                  payment["transactionId"] = bodyContent.transactionId
                }
                existingTransaction.push(payment)

                const updatedPaymentInfo: any = {
                  payment: existingTransaction,
                  pendingAmount: data.pendingAmount - bodyContent.paidAmount,
                  paidAmount: data.paidAmount + bodyContent.paidAmount
                }
                if (updatedPaymentInfo.pendingAmount === 0) {
                  updatedPaymentInfo["isComplete"] = true
                }
                return obj.connection.updateOne({ _id: new ObjectId(id) }, { $set: updatedPaymentInfo })
              } else {
                return new Promise((_, reject) => {
                  reject("Invalid Id")
                })
              }
            }).finally(() => {
              obj.client.close()
            })
          })
        } else {
          return new Promise((_, reject) => {
            reject("Admin only can update the payment")
          })
        }
      }).finally(() => {
        userObj.client.close()
      })
    })

    // return MongoService.collectionDetails("payment").then((obj) => {
    //   return obj.connection.findOne({
    //     student: new ObjectId(studentId),
    //     course: new ObjectId(bodyContent.courseId)
    //   }).then(async (paymentData) => {
    //     try {
    //       const courseInfo: any = {}
    //       const updatedPaymentData: any = {}
    //       if (paymentData) {
    //         if (paymentData.isComplete) {
    //           return new Promise((resolve, reject) => {
    //             reject("Fully paid")
    //           })
    //         }
    //         if (paymentData.pendingAmount < bodyContent.paidAmount) {
    //           return new Promise((resolve, reject) => {
    //             reject("paid amount greater than pending amount")
    //           })
    //         }
    //         const courseData: any = await MongoService.collectionDetails("course").then(courseObj => {
    //           return courseObj.connection.findOne({ _id: paymentData.course }).finally(() => {
    //             courseObj.client.close()
    //           })
    //         })
    //         if (!courseData) {
    //           return new Promise((resolve, reject) => {
    //             reject("invalid payment")
    //           })
    //         }

    //         courseInfo.price = courseData.offeredPrice;
    //         updatedPaymentData.pendingAmount = paymentData.pendingAmount - bodyContent.paidAmount
    //         updatedPaymentData.paidAmount = paymentData.paidAmount + bodyContent.paidAmount
    //         updatedPaymentData.isComplete = updatedPaymentData.pendingAmount <= 0
    //         const history: any = {
    //           paymentMethod: paymentData.payment.at(-1).paymentMethod,
    //           paymentMode: bodyContent.paymentMode,
    //           amount: bodyContent.paidAmount,
    //           createAt: new Date()
    //         }
    //         if (bodyContent.transactionId) {
    //           history.transactionId = bodyContent.transactionId
    //         }
    //         updatedPaymentData.payment = [...paymentData.payment, history]

    //         return obj.connection.updateOne({
    //           student: new ObjectId(studentId),
    //           course: new ObjectId(bodyContent.courseId)
    //         }, { $set: updatedPaymentData }).finally(() => {
    //           obj.client.close()
    //         })
    //       } else {
    //         return new Promise((resolve, reject) => {
    //           reject("invalid payload")
    //         })
    //       }
    //     } catch (error) {
    //       return new Promise((_, reject) => {
    //         reject(LogController.errorMes("studentserviceputasyncerror-", error))
    //       })
    //     }
    //   }).finally(() => {
    //     obj.client.close()
    //   })
    // });
  }
  static enrollNewCourse(bodyContent: any) {
    const studentId = bodyContent.id
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection.findOne({
        userGroup: metaData.userGroup.student,
        _id: new ObjectId(studentId)
      }).then(async (userData) => {
        try {
          if (userData) {
            const prevCourse = userData.course.map((doc: any) => doc.id)
            if (prevCourse.includes(bodyContent.course.id)) {
              return new Promise((_, reject) => {
                reject("already you have a same course")
              })
            }
            const batchData = await MongoService.collectionDetails("batch").then((batchObj) => {
              return batchObj.connection.findOne({ _id: new ObjectId(bodyContent.batch.id) }).finally(() => {
                batchObj.client.close()
              })
            })
            if (!batchData) {
              return new Promise((_, reject) => {
                reject("Invalid Batch")
              })
            }
            if (batchData.course.id.toString() !== bodyContent.course.id) {
              return new Promise((_, reject) => {
                reject("Course and Batch are mismatch")
              })
            }
            await MongoService.collectionDetails("batch").then((batchObj) => {
              return batchObj.connection.updateOne({ _id: new ObjectId(bodyContent.batch.id) }, { $push: { studentList: new ObjectId(studentId) } }).finally(() => {
                batchObj.client.close()
              })
            })
            const paymentId = new ObjectId();
            const courseInfo: any = {}
            const payment: any = {}
            const updatedStudentData: any = {}
            let attendance: any = {}
            const courseData = await MongoService.collectionDetails("course").then((courseObj) => {
              return courseObj.connection.findOne({ _id: new ObjectId(bodyContent.course.id) }).finally(() => {
                courseObj.client.close()
              })
            })
            if (!courseData) {
              return new Promise((_, reject) => {
                reject("Invalid Course")
              })
            }
            courseInfo.price = courseData.offeredPrice;
            if (courseInfo.price < bodyContent.payment.paidAmount) {
              return new Promise((_, reject) => {
                reject("Paid amount is greater than original price")
              })
            }
            payment._id = paymentId;
            payment.course = new ObjectId(bodyContent.course.id);
            payment.batch = new ObjectId(bodyContent.batch.id);
            payment.student = new ObjectId(studentId);
            payment.pendingAmount = courseInfo.price - bodyContent.payment.paidAmount;
            payment.paidAmount = bodyContent.payment.paidAmount;
            payment.payment = [{
              paymentMethod: bodyContent.payment.paymentMethod,
              paymentMode: bodyContent.payment.paymentMode,
              amount: bodyContent.payment.paidAmount
            }];
            payment.isComplete = false;

            if (bodyContent.payment.transactionId) {
              payment.payment[0].transactionId = bodyContent.payment.transactionId
            }
            if (bodyContent.payment.paymentMethod === "fullpayment" && courseInfo.price === bodyContent.payment.paidAmount) {
              payment.isComplete = true;
            }
            if (bodyContent.payment.paymentMethod === "fullpayment" && courseInfo.price !== bodyContent.payment.paidAmount) {
              return new Promise((_, reject) => {
                reject("course fee is mismatch")
              })
            }

            updatedStudentData.batch = [...userData.batch, bodyContent.batch]
            updatedStudentData.course = [...userData.course, { ...bodyContent.course, payment: paymentId }]
            attendance = {
              student: new ObjectId(studentId),
              batch: new ObjectId(bodyContent.batch.id),
              attendance: []
            }
            obj.connection.updateOne({
              userGroup: metaData.userGroup.student,
              _id: new ObjectId(studentId)
            }, { $set: updatedStudentData })
            return MongoService.collectionDetails("payment").then((paymentObj) => {
              return paymentObj.connection.insertOne(payment).then(() => {
                return MongoService.collectionDetails("attendance").then((attendanceObj) => {
                  return attendanceObj.connection.insertOne(attendance).finally(() => {
                    attendanceObj.client.close()
                  })
                })
              }).finally(() => {
                paymentObj.client.close()
              })
            })
          } else {
            return new Promise((_, reject) => {
              reject("Invalid User")
            })
          }
        } catch (error) {
          return new Promise((_, reject) => {
            reject(LogController.errorMes("enrollnewasyncerror-", error))
          })
        }
      }).finally(() => {
        obj.client.close()
      })
    })
  }
}