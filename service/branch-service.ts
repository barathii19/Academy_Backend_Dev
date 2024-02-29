import { MongoService } from "./mongo-service";
import { ICourseDetails } from "../model/ICourseDetails";
import { ObjectId } from "mongodb";
import { IBatchDetails } from "../model/IBatchDetails";
import { IBranchDetails, IReassignAdmin } from "../model/IBranchDetails";
import { Request } from "express";
import { metaData } from "../environment/meta-data";
import { AdminService } from "./admin-service";

export class BranchService {
  static getBranchAggregateData(datas: any) {
    const branchData = []
    for (const data of datas) {
      const formatedData = { ...data }
      let studentCount = 0;
      let staffCount = 0;
      if (formatedData.countData && formatedData.countData.length > 0) {
        studentCount = formatedData.countData.filter((doc: any) => doc.userGroup === metaData.userGroup.student).length;
        staffCount = formatedData.countData.filter((doc: any) => doc.userGroup === metaData.userGroup.staff).length;
      } else {
        formatedData.studentCount = 0
        formatedData.staffCount = 0
      }
      formatedData.studentCount = studentCount;
      formatedData.staffCount = staffCount;
      delete formatedData.countData;
      branchData.push(formatedData)
    }
    return branchData
  }
  static getBranchDetails(request?: Request) {
    return MongoService.collectionDetails("branch").then((obj) => {
      const filterOption = request?.query;
      let query = {

      };
      if (filterOption && filterOption.isAssigned && (filterOption.isAssigned === "false" || filterOption.isAssigned === "true")) {
        query = {
          isAssigned: filterOption.isAssigned === "false" ? false : true
        }
      }
      if (Object.keys(query).length > 0) {
        return obj.connection
          .find(query)
          .toArray()
          .finally(() => {
            obj.client.close();
          });
      } else {
        return obj.connection.aggregate([
          {
            $lookup: {
              from: metaData.db.collectionDetails.user,
              localField: '_id',
              pipeline: [{
                $project: { password: 0, userGroup: 0, assignedBranch: 0 }
              }],
              foreignField: 'assignedBranch.id',
              as: 'branchAdmin'
            }
          },
          {
            $lookup: {
              from: metaData.db.collectionDetails.user,
              localField: '_id',
              foreignField: 'branch',
              as: 'countData'
            }
          },
          {
            $lookup: {
              from: metaData.db.collectionDetails.user,
              localField: 'createBy',
              pipeline: [{
                $project: { password: 0, userGroup: 0, changePassword: 0 }
              }],
              foreignField: '_id',
              as: 'creater'
            }
          },
          { $project: { createBy: 0 } }
        ]).toArray()
          .then(branchData => {
            const branchAggregateData = this.getBranchAggregateData(branchData)
            return new Promise((res, rej) => {
              res(branchAggregateData)
            })
          })
          .finally(() => {
            obj.client.close();
          });

      }

    });
  }
  static getSpecificBranchDetails(organisationId: string) {
    return MongoService.collectionDetails("branch").then((obj) => {
      return obj.connection
        .find({ organisationId })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postBranchDetails(branchDetails: IBranchDetails, createrId: any) {
    return BranchService.getBranchDetails().then((data: any) => {
      let isAvailable = false;
      if (data && data.length) {
        isAvailable =
          data.filter(
            (x: any) =>
              x.branch &&
              x.branch.toLowerCase() == branchDetails.branch.toLowerCase()
          ).length > 0;
      }
      if (!isAvailable) {
        return MongoService.collectionDetails("user").then((userObj) => {
          return userObj.connection.findOne({ _id: new ObjectId(createrId) }).then((createrData: any) => {
            return MongoService.collectionDetails("branch").then((obj) => {
              return obj.connection.insertOne({
                ...branchDetails, createBy: new ObjectId(createrId),
                isAssigned: false
              }).finally(() => {
                obj.client.close();
              });
            });
          })

        })

      } else {
        return new Promise((resolve, reject) => {
          reject({ msg: "Branch already available" });
        });
      }
    });
  }
  static getBranchkeys(details: any) {
    let reservedData: any = {}
    const availableKeys = ["branch", "address", "state", "city"]
    for (const key of Object.keys(details)) {
      const value = details[key]
      if (availableKeys.includes(key)) {
        reservedData[key] = value
      }
    }
    return reservedData
  }
  static updateBranchDetail(id: string, branchDetail: IBranchDetails) {
    const reservedData = this.getBranchkeys(branchDetail)
    if (Object.keys(reservedData).length > 0) {
      return MongoService.collectionDetails("branch").then((obj) => {
        return obj.connection
          .updateOne({ _id: new ObjectId(id) }, { $set: reservedData })
          .finally(() => {
            obj.client.close();
          });
      });
    } else {
      return new Promise((res, rej) => {
        rej({
          message: "Please check the payload. you can only change branch,address,state and city"
        })
      })
    }

  }
  static deleteBranchDetail(id: any) {
    return MongoService.collectionDetails("branch").then((obj) => {
      return obj.connection
        .deleteOne({
          _id: new ObjectId(id),
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getSpecificBranchByOrganisationId(organisationId: any) {
    return MongoService.collectionDetails("branch").then((obj) => {
      return obj.connection
        .find({
          organisationId,
        }).toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static reassignAdmin(details: IReassignAdmin) {

  }
  static isBranchExist(branchId: string) {
    return MongoService.collectionDetails("branch").then(
      (obj) => {
        return obj.connection
          .find({ _id: new ObjectId(branchId) })
          .toArray()
          .finally(() => {
            obj.client.close();
          });
      }
    );
  }
}
