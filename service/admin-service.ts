import { MongoService } from "./mongo-service";
import { IAdminDetails, IPostAdminDetils } from "../model/IAdminDetails";
import { IApprovalDetails } from "../model/IApprovalDetails";
import { IUploadDetails } from "../model/IUploadDetails";
import { ObjectId } from "mongodb";
import { metaData } from "../environment/meta-data";
import { HelperController } from "../controller/Helper-controller";
export class AdminService {
  static getAdminDetails() {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .find({ userGroup: metaData.userGroup.admin })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static getSpecificAdminDetails(id: string) {
    return MongoService.collectionDetails("admin").then((obj) => {
      return obj.connection.findOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }
  static postAdminDetails(adminDetails: IAdminDetails[]) {
    return MongoService.collectionDetails("admin").then((obj) => {
      return obj.connection.insertMany(adminDetails).finally(() => {
        obj.client.close();
      });
    });
  }
  static postAdminDetail(adminDetail: IPostAdminDetils) {
    return MongoService.collectionDetails("branch").then((branchObj) => {
      const updateKey = {
        $set: {
          isAssigned: true
        }
      }
      return branchObj.connection.findOneAndUpdate({ _id: new ObjectId(adminDetail.assignedBranch.id), isAssigned: false }, updateKey).then((resp: any) => {
        if (resp.lastErrorObject.updatedExisting) {
          return MongoService.collectionDetails("user").then((obj) => {
            return obj.connection.insertOne({
              ...adminDetail,
              assignedBranch: {
                ...adminDetail.assignedBranch,
                id: new ObjectId(adminDetail.assignedBranch.id)
              },
              password: "12345678",
              userGroup: metaData.userGroup.admin,
              isActive: true,
              profileColor: HelperController.getRandomColor()
            }).finally(() => {
              obj.client.close();
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            reject("Branch Not Available")
          })
        }
      })
    })

  }

  static getReservedAdminKeys(bodyContent: any) {
    let details: any = {}
    const reservedkey = ["firstName", "lastName", "email", "mobileNumber"]
    const keys = Object.keys(bodyContent);
    for (const key of keys) {
      const value = bodyContent[key];
      if (reservedkey.includes(key)) {
        details[key] = value
      }
    }
    return details
  }

  static updateAdminDetail(id: string, adminDetail: IAdminDetails) {
    let reservedKeyDetails = this.getReservedAdminKeys(adminDetail)
    if (Object.keys(reservedKeyDetails).length > 0) {
      return MongoService.collectionDetails("user").then((obj) => {
        return obj.connection
          .updateOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.admin }, { $set: adminDetail })
          .finally(() => {
            obj.client.close();
          });
      });
    } else {
      return new Promise((res, rej) => {
        rej({
          message: "Please check the payload,you can only change firstName,lastName,email and mobileNumber"
        })
      })

    }
  }
  static deleteAdminDetail(id: string) {

    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection.findOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.admin }).then((adminData: any) => {
        const branchId = adminData.assignedBranch.id;
        return MongoService.collectionDetails("branch").then((branchObj) => {
          branchObj.connection.findOneAndUpdate({ _id: new ObjectId(branchId) }, { $set: { isAssigned: false } }).then((resp: any) => {
            if (resp.lastErrorObject.updatedExisting) {
              return obj.connection.deleteOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.admin }).finally(() => {
                obj.client.close();
              });
            } else {
              return new Promise((resolve, reject) => {
                reject("Branch Not Available")
              })
            }
          })
        })
      })
    });
  }
  static postApprovalDetails(approvalDetails: IApprovalDetails[]) {
    return MongoService.collectionDetails("approval").then((obj) => {
      return obj.connection.insertOne(approvalDetails).finally(() => {
        obj.client.close();
      });
    });
  }
  static getApprovalDetails() {
    return MongoService.collectionDetails("approval").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteApprovalDetails(id: any) {
    return MongoService.collectionDetails("approval").then((obj) => {
      return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }
  static postUploadDetails(postUploadDetails: IUploadDetails[]) {
    return MongoService.collectionDetails("upload").then((obj) => {
      return obj.connection.insertMany(postUploadDetails).finally(() => {
        obj.client.close();
      });
    });
  }

}
