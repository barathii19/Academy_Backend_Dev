import { MongoService } from "./mongo-service";
export class homeService {
  static async getCardDetails(id: any, group: any, branch: any) {
    let flag = false;
    let output = {
      student: {
        count: 20,
      },
      course: {
        count: 10,
      },
      batch: {
        count: 10,
      },
      payment: {
        total: 0,
        paid: 0,
        pending: 0,
      },
    };
    try {
      switch (group) {
        case "Admin":
          {
            let tempStudent = await MongoService.collectionDetails(
              "student"
            ).then((obj) => {
              return obj.connection
                .find({
                  branch: branch,
                })
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempStudent) {
              output.student.count = tempStudent.length;
            }

            let tempCourse = await MongoService.collectionDetails(
              "course"
            ).then((obj) => {
              return obj.connection
                .find({
                  branch: branch,
                })
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempCourse) {
              output.course.count = tempCourse.length;
            }

            let tempBatch = await MongoService.collectionDetails("batch").then(
              (obj) => {
                return obj.connection
                  .find({
                    branch: branch,
                  })
                  .toArray()
                  .finally(() => {
                    obj.client.close();
                  });
              }
            );
            if (tempBatch) {
              output.batch.count = tempBatch.length;
            }

            let tempPayment = await MongoService.collectionDetails(
              "payment"
            ).then((obj) => {
              return obj.connection
                .find({
                  branch: branch,
                })
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempPayment) {
              output.payment.total = tempPayment.reduce(
                (payment: any, a) => payment.total + a,
                0
              );
              output.payment.paid = tempPayment.reduce(
                (payment: any, a) => payment.paid + a,
                0
              );
              output.payment.pending = tempPayment.reduce(
                (payment: any, a) => payment.pending + a,
                0
              );
            }
          }
          break;
        case "Staff":
          {
            let tempStudent = await MongoService.collectionDetails(
              "batch"
            ).then((obj) => {
              return obj.connection
                .find({
                  staffId: id,
                })
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempStudent) {
              let tempStudents = tempStudent
                .map((x) => x.student)
                .reduce((prev: any, current: any) => [...prev, ...current]);
              if (tempStudent) {
                output.student.count = tempStudents.length;
              }
            }

            let tempStaff = await MongoService.collectionDetails("staff").then(
              (obj) => {
                return obj.connection
                  .findOne({
                    staffId: id,
                  })
                  .finally(() => {
                    obj.client.close();
                  });
              }
            );
            if (tempStaff && tempStaff.course) {
              output.course.count = tempStaff.course.length;
            }

            let tempBatch = await MongoService.collectionDetails("batch").then(
              (obj) => {
                return obj.connection
                  .find({
                    staffId: id,
                  })
                  .toArray()
                  .finally(() => {
                    obj.client.close();
                  });
              }
            );
            if (tempBatch) {
              output.batch.count = tempBatch.length;
            }
          }
          break;
        case "Student":
          {
            let tempStudent = await MongoService.collectionDetails(
              "student"
            ).then((obj) => {
              return obj.connection
                .findOne({
                  id: id,
                })
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempStudent && tempStudent.courses) {
              output.course.count = tempStudent.courses.length;
            }

            let tempBatch = await MongoService.collectionDetails("batch").then(
              (obj) => {
                return obj.connection
                  .find({
                    students: [id],
                  })
                  .toArray()
                  .finally(() => {
                    obj.client.close();
                  });
              }
            );
            if (tempBatch) {
              output.batch.count = tempBatch.length;
            }

            let tempPayment = await MongoService.collectionDetails(
              "payment"
            ).then((obj) => {
              return obj.connection
                .find({
                  studentId: [id],
                })
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempPayment) {
              output.payment.total = tempPayment.reduce(
                (payment: any, a) => payment.total + a,
                0
              );
              output.payment.paid = tempPayment.reduce(
                (payment: any, a) => payment.paid + a,
                0
              );
              output.payment.pending = tempPayment.reduce(
                (payment: any, a) => payment.pending + a,
                0
              );
            }
          }
          break;
        case "SuperAdmin":
          {
            let tempStudent = await MongoService.collectionDetails(
              "student"
            ).then((obj) => {
              return obj.connection
                .find({})
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempStudent) {
              output.student.count = tempStudent.length;
            }

            let tempCourse = await MongoService.collectionDetails(
              "course"
            ).then((obj) => {
              return obj.connection
                .find({})
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempCourse) {
              output.course.count = tempCourse.length;
            }

            let tempBatch = await MongoService.collectionDetails("batch").then(
              (obj) => {
                return obj.connection
                  .find({})
                  .toArray()
                  .finally(() => {
                    obj.client.close();
                  });
              }
            );
            if (tempBatch) {
              output.batch.count = tempBatch.length;
            }

            let tempPayment = await MongoService.collectionDetails(
              "payment"
            ).then((obj) => {
              return obj.connection
                .find({})
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempPayment) {
              output.payment.total = tempPayment.reduce(
                (payment: any, a) => payment.total + a,
                0
              );
              output.payment.paid = tempPayment.reduce(
                (payment: any, a) => payment.paid + a,
                0
              );
              output.payment.pending = tempPayment.reduce(
                (payment: any, a) => payment.pending + a,
                0
              );
            }
          }
          break;
        default:
          break;
      }
      flag = true;
    } catch (e) {}

    return new Promise((resolve, reject) => {
      if (flag) {
        resolve(output);
      } else {
        reject(output);
      }
    });
  }
  static async getBatchDetails(id: any, group: any, branch: any) {
    let flag = false;
    let output = {
      batch: {
        name: 0,
      },
      noOfStudent: {
        count: 0,
      },
      date: {
        startingDate: 0,
        endingDate: 0,
      },
      platform: {
        name: 0,
      },
    };
    try {
      switch (group) {
        case "teacher":
          {
            const tempBatch = MongoService.collectionDetails("batch").then(
              (obj) => {
                return obj.connection
                  .find({ staffId: id })
                  .toArray()
                  .finally(() => {
                    obj.client.close();
                  });
              }
            );
            const sliceBatchData = (await tempBatch).slice(0, 4);
            if (sliceBatchData?.length > 0) {
              return sliceBatchData;
            }
          }
          break;

        default:
          break;
      }
    } catch (e) {}
    return new Promise((resolve, reject) => {
      if (flag) {
        resolve(output);
      } else {
        reject(output);
      }
    });
  }
  static async getPaymentDetails(id: any, group: any, branch: any) {
    let flag = false;
    let output = {
      payment: {
        studentId: 0,
        total: 0,
        paid: 0,
        pending: 0,
        requested: 0,
      },
    };
    try {
      switch (group) {
        case "Admin":
          {
            let tempPayment = await MongoService.collectionDetails(
              "payment"
            ).then((obj) => {
              return obj.connection
                .find({
                  branch: branch,
                })
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempPayment) {
              const slicedData = tempPayment
                .slice(0, tempPayment.length < 4 ? tempPayment.length : 4)
                .map((paymentData, index) => {
                  const temp = {
                    studentId: paymentData.studentId,
                    total: paymentData.total,
                    paid: paymentData.paid,
                    pending: paymentData.pending,
                    requested: paymentData.requested,
                  };
                  return temp;
                });
            }
          }
          break;
        case "SuperAdmin":
          {
            let tempPayment = await MongoService.collectionDetails(
              "payment"
            ).then((obj) => {
              return obj.connection
                .find({})
                .toArray()
                .finally(() => {
                  obj.client.close();
                });
            });
            if (tempPayment) {
              const slicedData = tempPayment
                .slice(0, tempPayment.length < 4 ? tempPayment.length : 4)
                .map((paymentData, index) => {
                  const temp = {
                    studentId: paymentData.studentId,
                    total: paymentData.total,
                    paid: paymentData.paid,
                    pending: paymentData.pending,
                    requested: paymentData.requested,
                  };
                  return temp;
                });
            }
          }
          break;
        default:
          break;
      }
      flag = true;
    } catch (e) {}
    return new Promise((resolve, reject) => {
      if (flag) {
        resolve(output);
      } else {
        reject(output);
      }
    });
  }
}
