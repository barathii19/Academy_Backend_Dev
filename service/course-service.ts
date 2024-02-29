import { MongoService } from "./mongo-service";
import { ICourseDetails, IPostCourseDetails } from "../model/ICourseDetails";
import { ObjectId } from "mongodb";
import { OrganisationService } from "./new-organisation-service";
import { v4 as uuidv4 } from "uuid";
import { metaData } from "../environment/meta-data";
export class CourseService {
  static getCourseDetails() {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection
        .aggregate([
          {
            $lookup: {
              from: metaData.db.collectionDetails.user,
              localField: 'createBy',
              pipeline: [
                { $project: { password: 0, userGroup: 0 } }
              ],
              foreignField: '_id',
              as: 'creater'
            },

          },
          { $project: { createBy: 0 } }
        ])
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static getSpecificCourseDetails(id: string) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection.findOne({ courseId: id }).finally(() => {
        obj.client.close();
      });
    });
  }
  static getSpecificOrganisationCourseDetail(organisationId: string, branch: string) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection.find({ organisationId, branch }).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  static getCourseBranchDetails(branch: String) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.find({ branch }).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
  static postCourseDetails(courseDetails: ICourseDetails[]) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection.insertMany(courseDetails).finally(() => {
        obj.client.close();
      });
    });
  }
  static postCourseDetail(courseDetail: IPostCourseDetails, createrId: any) {
    return MongoService.collectionDetails("course").then((obj) => {
      const course: any = {};
      course.courseName = courseDetail.courseName;
      course.description = courseDetail.description;
      course.actualPrice = courseDetail.actualPrice;
      course.offeredPrice = courseDetail.offeredPrice;
      const modules = courseDetail.modules;
      let mod_arr: any = [];
      for (let x of modules) {
        const topic = x.topics;
        let top_arr = [];
        for (let y of topic) {
          let d = {
            topicId: uuidv4(),
            topic: y.topic,
            description: y.description
          }
          top_arr.push(d)
        }
        let m = {
          moduleId: uuidv4(),
          moduleName: x.moduleName,
          description: x.description,
          topics: top_arr
        }
        mod_arr.push(m)
      }
      course.modules = mod_arr;
      course.createBy = new ObjectId(createrId)
      console.log(course, "course");
      return obj.connection.insertOne(course).finally(() => {
        obj.client.close();
      });
    });
  }
  static updateCourseDetail(id: string, courseDetail: ICourseDetails) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: courseDetail },)
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteCourseDetail(id: string) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }

  static generateCourseID(courseName: string, organisationId: string) {
    let flag = true;
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .then((data) => {
          if (!data) {
            flag = false;
          }
          return OrganisationService.getSpecificOrganisation(organisationId).then((organisation: any) => {
            return new Promise((resolve, reject) => {
              let courseID =
                `${organisation?.organisationName}-C-` +
                courseName[0] +
                courseName[1] +
                "-" +
                new Date().getFullYear().toString()[2] +
                new Date().getFullYear().toString()[3];
              if (flag) {
                resolve(courseID + (data.length + 1));
              } else {
                resolve(courseID + 1);
              }
            });
          })

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
  static getCourseAndDouments(organisationId: string, branch: string) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection.aggregate([
        {
          $match: { organisationId, branch }
        },
        {
          $lookup: {
            from: "document_details",
            localField: "courseId",
            foreignField: "uniqueId",
            as: "documents"
          }
        }
      ]).toArray().finally(() => {
        obj.client.close();
      });
    });
  }
}
