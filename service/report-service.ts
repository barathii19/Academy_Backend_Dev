import { MongoService } from "./mongo-service";

export class reportService {
  static getReportDetails() {
    const paymentData = MongoService.collectionDetails("payment").then(
      (obj) => {
        return obj.connection
          .find({})
          .toArray()
          .finally(() => {
            obj.client.close();
          });
      }
    );
    const batchData = MongoService.collectionDetails("batch").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
    const studentData = MongoService.collectionDetails("student").then(
      (obj) => {
        return obj.connection
          .find({})
          .toArray()
          .finally(() => {
            obj.client.close();
          });
      }
    );
    const courseData = MongoService.collectionDetails("cource").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
    const userDetails = MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .find({ userGroup: { $in: ["student", "teacher"] } })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
    const skillsDetails = MongoService.collectionDetails("batch").then(
      (obj) => {
        return obj.connection
          .aggregate([
            {
              $group: {
                _id: "$platform",
                batchStudentList: { $sum: { $size: "$batchStudentList" } },
              },
            },
          ])
          .toArray()
          .finally(() => {
            obj.client.close();
          });
      }
    );
    const resolvedPromise = [
      paymentData,
      batchData,
      studentData,
      courseData,
      userDetails,
      skillsDetails,
    ];
    return Promise.all(resolvedPromise);
  }
}
