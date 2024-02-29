import { ObjectId } from "mongodb";
import { HelperController } from "../controller/Helper-controller";
import { metaData } from "../environment/meta-data";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { IPostStaffDetails } from "../model/IStaffDetails";
import { MongoService } from "./mongo-service";

export class staffService {
  static getStaffDetails(id: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      const projecter: any = { password: 0, userGroup: 0, assignedIn: 0, creater: 0, branch: 0 }
      return obj.connection
        .find({
          userGroup: metaData.userGroup.staff,
          creater: new ObjectId(id)
        }).project(projecter)
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postStaffDetails(data: any) {
    console.log("service", data)
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection.insertOne(data).finally(() => {
        obj.client.close();
      });
    });
  }
  static deleteStaffDetails(id: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection.findOne({ _id: new ObjectId(id) }).then((data) => {
        if (data && (!data.assignedIn || (data.assignedIn && data.assignedIn.length === 0))) {
          return obj.connection.deleteOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.staff })
        } else {
          return new Promise((resolve, reject) => {
            reject("This staff is already assign to the batch")
          })
        }
      }).finally(() => {
        obj.client.close()
      })
    });
  }

  static getStaffDetailsByStaffId(staffId: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .findOne({
          id: staffId
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static getReservedStaffData(data: any) {
    const validData: any = {}
    const validKeys = ["firstName", "lastName", "mobileNumber", "email", "field"]

    for (const key of Object.keys(data)) {
      const value = data[key];
      if (validKeys.includes(key)) {
        validData[key] = value
      }
    }
    return validData
  }

  static updateStaffDetails(id: string, data: any) {
    const staffData = this.getReservedStaffData(data);
    if (Object.keys(staffData).length > 0) {
      return MongoService.collectionDetails("user").then((obj) => {
        return obj.connection
          .updateOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.staff }, { $set: staffData })
          .finally(() => {
            obj.client.close();
          });
      });
    } else {
      return new Promise((res, rej) => {
        rej({
          message: "Check the Payload. You can only update name,mobileNumber,email and field "
        })
      })
    }

  }
  static getOrganisationsStaffs(organisationId: string, branch: string) {
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection
        .find({ organisationId, branch })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteStaffDocumentByDocumentName(id: string, documentName: string) {
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection.updateOne({ _id: new ObjectId(id) }, { $pull: { documents: documentName } }).finally(() => {
        obj.client.close();
      });
    });
  }
  static createStaff(staffDetails: IPostStaffDetails, request: Request) {
    const createrdecode: any = decodeJwt(request);
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection.findOne({ _id: new ObjectId(createrdecode?.id) }).then((createrData: any) => {
        const branchId = createrData.assignedBranch.id;
        if (branchId) {
          let userExist: Boolean = false;
          return obj.connection
            .findOne({
              email: staffDetails?.email,
            }).then((data) => {
              if (data) {
                userExist = true;
              }
              if (!userExist) {
                staffDetails.isActive = true;
                staffDetails.branch = branchId;
                staffDetails.password = "12345678";
                staffDetails.userGroup = metaData.userGroup.staff;
                staffDetails.assignedIn = [];
                staffDetails.creater = new ObjectId(createrdecode?.id);
                staffDetails.profileColor = HelperController.getRandomColor()
                return MongoService.collectionDetails("user").then((obj2) => {
                  return obj2.connection.insertOne(staffDetails).finally(() => {
                    obj2.client.close();
                  });
                });
              } else {
                return new Promise((resolve, reject) => {
                  reject({ auth: false, message: "User exist" });
                });
              }
            })
        } else {
          return new Promise((_, reject) => {
            reject("Branch Not Available")
          })
        }
      })
    })

  }
}