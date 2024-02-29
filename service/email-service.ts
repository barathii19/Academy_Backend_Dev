import { MongoService } from "./mongo-service";
import { ObjectId } from "mongodb";
import { IEmailDetails } from "../model/IEmailDetails";

export class EmailService {

      static getEmailDetails() {
        return MongoService.collectionDetails("email").then((obj) => {
          return obj.connection
            .find({})
            .toArray()
            .finally(() => {
              obj.client.close();
            });
        });
      }
      static postEmailDetails(emailDetails: IEmailDetails) {
        return MongoService.collectionDetails("email").then((obj) => {
          return obj.connection.insertOne(emailDetails).finally(() => {
            obj.client.close();
          });
        });
      }
      static  generateUserID() {
        return MongoService.collectionDetails("user").then((obj) => {
          let flag = true;
          return obj.connection
            .find<IEmailDetails>({})
            .toArray()
            .then((data) => {
              if (!data) {
                flag = false;
              }
              return new Promise((resolve, reject) => {
                let userID =
                  "CRUD" +
                  new Date().getFullYear().toString()[2] +
                  new Date().getFullYear().toString()[3];
                if (flag) {
                  resolve(userID + (data.length + 1));
                } else {
                  resolve(userID + 1);
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
}