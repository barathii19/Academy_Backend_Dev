import { MongoService } from "./mongo-service";
import { IUserDetails } from "../model/IUserDetails";
import { IPasswordUpdateDetails } from "../model/IPasswordUpdateDetails";
import { sign, verify } from "jsonwebtoken";
import { hashSync } from "bcryptjs";
import { metaData } from "../environment/meta-data";
import { IOTPDetails } from "../model/IOTPDetails";
import { ObjectId } from "mongodb";
import { OrganisationService } from "./new-organisation-service";
import { IOrganisationDetails } from "../model/IOrganisationDetails";
import btoa from "btoa"

export class LoginService {
  static postLoginDetail(userDetails: any) {
    let userExist: Boolean = false;
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .findOne<IUserDetails>({
          email: userDetails?.email,
        })
        .then((data) => {
          if (data) {
            userExist = true;
          }
          if (!userExist) {
            userDetails.isActive = true;
            return MongoService.collectionDetails("user").then((obj2) => {
              return obj2.connection.insertOne(userDetails).finally(() => {
                obj2.client.close();
              });
            });
          } else {
            return new Promise((resolve, reject) => {
              reject({ auth: false, message: "User exist" });
            });
          }
        })
        .catch(() => {
          return new Promise((resolve, reject) => {
            reject({ auth: false, token: "" });
          });
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static updateLoginDetail(id: string, userDetails: IUserDetails) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: userDetails })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteLoginDetail(id: string) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .deleteOne({ _id: new ObjectId(id) })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static updatePasswordDetail(
    id: string,
    passwordDetails: IPasswordUpdateDetails
  ) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: passwordDetails })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static getLoginDetails(userName: string, password: string) {
    let flag: Boolean = true;
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .findOne<IUserDetails>({
          $or: [{ id: userName }, { email: userName }]
        })
        .then((data) => {
          if (!data) {
            flag = false;
          }
          if (data && data.password) {
            if (!data.isActive) {
              return new Promise((resolve, reject) => {
                reject({
                  auth: false,
                  message: "User not active",
                  data: {
                    token: "",
                    userGroup: "",
                    id: "",
                    branch: "",
                    firstName: "",
                    lastName: "",
                    changePassword: "",
                  },
                });
              });
            } else if (data.password != password) {
              return new Promise((resolve, reject) => {
                reject({
                  auth: false,
                  message: "Password not correct",
                  data: {
                    token: "",
                    userGroup: "",
                    id: "",
                    branch: "",
                    firstName: "",
                    lastName: "",
                    changePassword: "",
                  },
                });
              });
            }
          }
          let token = "";
          if (flag) {
            token = sign({ id: data?._id }, metaData.base.key, {
              expiresIn: metaData.base.expire, // expires in 24 hours
            });
          } else {
            flag = false;
          }
          return new Promise((resolve, reject) => {
            if (flag) {
              resolve({
                auth: true,
                message: "Valid user",
                data: {
                  token: token,
                  id: data?.id,
                  branch: data?.branch,
                  firstName: data?.firstName,
                  lastName: data?.lastName,
                  changePassword: data?.changePassword,
                  _id: data?._id,
                  organisationId: data?.organisationId,
                  organizationName: data?.organizationName,
                  orgCreaterName: data?.name,
                  email: data?.email,
                  dob: data?.dob,
                  mobileNumber: data?.mobileNumber,
                  address: data?.address,
                  city: data?.city,
                  educationInfo: data?.educationInfo,
                  experienceInfo: data?.experienceInfo,
                  state: data?.state,
                  profileColor: data?.profileColor,
                  userGroup: btoa(JSON.stringify({ group: data?.userGroup }))
                },
              });
            } else {
              reject({
                auth: false,
                message: "Not a valid user",
                data: {
                  token: "",
                  userGroup: "",
                  id: "",
                  branch: "",
                  firstName: "",
                  lastName: "",
                  changePassword: "",
                },
              });
            }
          });
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

  static verifyToken(
    token: string,
    successCallback: Function,
    failiureCallback: Function
  ) {
    try {
      verify(token, metaData.base.key, function (err) {
        if (err) {
          failiureCallback(err.name);
        } else {
          successCallback();
        }
      });
    } catch (e) {
      failiureCallback();
    }
  }
  static getUserDetails(id: string) {
    return MongoService.collectionDetails("user").then((obj) => {
      let flag: Boolean = true;
      return obj.connection
        .findOne<IUserDetails>({
          $or: [{ id: id }, { email: id }],
        })
        .then((data) => {
          if (!data) {
            flag = false;
          }
          return new Promise((resolve, reject) => {
            if (flag) {
              resolve(data);
            } else {
              reject(data);
            }
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

  static changePasswordDetail(id: string, bodyContent: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      const { currentPassword, newPassword, confirmPassword } = bodyContent;
      return obj.connection
        .findOne({
          _id: new ObjectId(id),
          password: currentPassword,
          isActive: true,
        })
        .then((data) => {
          if (data) {
            return obj.connection.updateOne(
              { _id: new ObjectId(id) },
              { $set: { password: newPassword } },
            )
          } else {
            return new Promise((resolve, reject) => {
              reject({
                message: "Old password not valid.Please check!",
              });
            });
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

  static resetPasswordDetail(bodyContent: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      const { password, email } = bodyContent;
      return obj.connection
        .findOne({
          $or: [{ id: email }, { email: email }],
          isActive: true,
        })
        .then((data) => {
          if (data) {
            return MongoService.collectionDetails("user").then((obj2) => {
              obj2.connection.updateOne(
                { email: email },
                { $set: { password: password } }
              );
              return new Promise((resolve, reject) => {
                resolve({
                  auth: true,
                  message: "Password changed succesfully!",
                });
              });
            });
          } else {
            return new Promise((resolve, reject) => {
              reject({
                auth: true,
                message: "Old password not valid.Please check!",
              });
            });
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

  static getSpecificUserDetails(id: string) {
    return MongoService.collectionDetails("user").then((obj) => {
      let flag: Boolean = true;
      return obj.connection
        .findOne({
          _id: new ObjectId(id),
        })
        .then((data) => {
          if (!data) {
            flag = false;
          }
          return new Promise((resolve, reject) => {
            if (flag) {
              resolve(data);
            } else {
              reject(data);
            }
          });
        })
        .catch((err) => {
          return new Promise((resolve, reject) => {
            reject(err);
          });
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postOTPDetails(userName: string, otp: number) {
    return MongoService.collectionDetails("otp").then((obj) => {
      return obj.connection
        .findOneAndUpdate({
          id: userName
        },
          {
            $set: {
              otp: otp,
              generatedTime: new Date(new Date().toUTCString()),
              isActive: true
            }
          },
          { upsert: true }
        )
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static confirmOtpDetails(userName: string, otp: any) {
    return MongoService.collectionDetails("otp").then((obj) => {
      console.log("user", userName, otp);

      let flag: Boolean = true;
      let message = "";
      return obj.connection
        .findOne({
          id: userName,
          otp: parseInt(otp),
          isActive: true
        })

        .then((data: any) => {
          console.log("data", data);

          if (!data) {
            flag = false;
          }

          // if (flag) {
          //   let generatedTime = data.generatedTime;
          //   var currentTime = new Date();
          //   var minuties =
          //     (currentTime.getTime() - generatedTime.getTime()) / 1000 / 60;
          //   if (minuties > 15) {
          //     flag = false;
          //     message = "OTP got expiried !";
          //   }
          // } else {
          //   flag = false;
          //   console.log("fail")
          //   message = "Not a valid !";
          // }
          return new Promise((resolve, reject) => {
            if (flag) {
              resolve({
                auth: true,
                message: "OTP got verified successfully",
              });
            } else {
              reject({ auth: true, message: message });
            }
          });
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

  static generateUserID(bodyContent: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      let flag = true;
      return obj.connection
        .find<IUserDetails>({
          organisationId: bodyContent?.organisationId
        })
        .toArray()
        .then((data) => {
          if (!data) {
            flag = false;
          }
          return OrganisationService.getSpecificOrganisationDetails(bodyContent).then((orgData: any) => {
            if (orgData) {
              return new Promise((resolve, reject) => {
                let randomNum = Math.round(Math.random() * 10)
                let userID =
                  orgData?.organisationName +
                  new Date().getFullYear().toString()[2] +
                  new Date().getFullYear().toString()[3];
                if (flag) {
                  resolve(userID + (data.length + 1) + randomNum);
                } else {
                  resolve(userID + 1 + randomNum);
                }
              });
            } else {
              Promise.reject({
                message: "your organisation not found"
              })
            }
          }).catch(() => {
            return new Promise((resolve, reject) => {
              reject();
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

  static generatePassword() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  // update studentAvailabitityToJoinBatch
  static updateAvailabilityToJoinBatch(id: string, availabilityToJoinBatch: any) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: availabilityToJoinBatch })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static getCredentials(email: string, password: string) {
    let flag: Boolean = true;
    return MongoService.collectionDetails("credential").then((obj) => {
      return obj.connection
        .findOne({
          email: email
        })
        .then((data) => {
          console.log(data)
          if (!data) {
            flag = false;
          }
          if (data && data.password) {
            if (!data.isActive) {
              return new Promise((resolve, reject) => {
                reject({
                  auth: false,
                  message: "User not active",
                });
              });
            } else if (data.password != password) {
              return new Promise((resolve, reject) => {
                reject({
                  auth: false,
                  message: "Password not correct",
                });
              });
            }
          }
          return new Promise((resolve, reject) => {
            if (flag) {
              resolve({
                auth: true,
                message: "Valid user",
              });
            } else {
              reject({
                auth: false,
                message: "Not a valid user",
              });
            }
          });
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
  static getUserGroup(id: string) {

    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .findOne({
          _id: new ObjectId(id)
        })
    });

  }
  static getStaffData() {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .find({
          userGroup: metaData.userGroup.staff
        }).toArray().finally(() => {
          obj.client.close()
        })
    });
  }
}
