import { MongoService } from "./mongo-service";
import { INotificationDetails } from "../model/INotificationDetails";
import { ObjectId } from "mongodb";

export class NotificationService {
  static getNotificationDetails(email:any, branch:any, organisationId:any) {
    return MongoService.collectionDetails("notification").then((obj) => {
      return obj.connection
        .find({receiverEmail:email,organisationId,branch})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postNotificationDetail(notificationDetail: INotificationDetails) {
    return MongoService.collectionDetails("notification").then((obj) => {
      return obj.connection.insertOne(notificationDetail).finally(() => {
        obj.client.close();
      });
    });
  }
  static deleteNotificationDetails(id: any) {
    return MongoService.collectionDetails("notification").then((obj) => {
      return obj.connection
        .deleteOne({
          _id: new ObjectId(id),
        })
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static updateNotificationDetail(
    id: any,
    notificationDetail: INotificationDetails
  ) {
    return MongoService.collectionDetails("notification").then((obj) => {
      return obj.connection
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: notificationDetail },
          { upsert: true }
        )
        .finally(() => {
          obj.client.close();
        });
    });
  }
}