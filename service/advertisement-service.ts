
import { IAdvertisementDetails } from "../model/IAdvertisementDetails";
import { MongoService } from "./mongo-service";
import { ObjectId } from "mongodb";


export class AdvertisementService {
  static getAdvertisementDetails(organisationId:any,branch:any) {

    return MongoService.collectionDetails("advertisement").then((obj) => {
      return obj.connection
        .find({
          organisationId,
          branch,
        })
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postAdvertisementDetails(advertisementDetails:any) {
    return MongoService.collectionDetails("advertisement").then((obj) => {
      return obj.connection.insertOne(advertisementDetails).finally(() => {
        obj.client.close();
      });
    });
  }
  static updateAdvertisementDetail(id: string, branchDetail: IAdvertisementDetails) {
    return MongoService.collectionDetails("advertisement").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, {$set:branchDetail})
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteAdvertisementDetails(id: any) {
    return MongoService.collectionDetails("advertisement").then((obj) => {
      return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }
}