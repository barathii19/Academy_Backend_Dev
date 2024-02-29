import { MongoService } from "./mongo-service";
import { ObjectId } from "mongodb";
import { IHolidayDetails } from "../model/IHolidayDetails";

export class ApplyService {

      static getApplyDetails() {
        return MongoService.collectionDetails("apply").then((obj) => {
          return obj.connection
            .find({})
            .toArray()
            .finally(() => {
              obj.client.close();
            });
        });
      }
      static postApplyDetails(applyDetails: IHolidayDetails) {
        return MongoService.collectionDetails("apply").then((obj) => {
          return obj.connection.insertOne(applyDetails).finally(() => {
            obj.client.close();
          });
        });
      }
  
}