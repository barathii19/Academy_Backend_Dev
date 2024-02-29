import { MongoService } from "./mongo-service";
import { ObjectId } from "mongodb";
import { IHolidayDetails } from "../model/IHolidayDetails";

export class HolidayService {

      static getHolidayDetails(_sDate:any,_eDate:any) {
        return MongoService.collectionDetails("holiday").then((obj) => {
          return obj.connection.find({
            date:{$gte:new Date(_sDate),$lte:new Date(_eDate)}
          }
          )
          .toArray().finally(()=>{obj.client.close();})
        });
      }
      static postHolidayDetails(holidayDetails: IHolidayDetails) {
        return MongoService.collectionDetails("holiday").then((obj) => {
          return obj.connection.insertOne(holidayDetails).finally(() => {
            obj.client.close();
          });
        });
      }
      static holidayDetails() {
        return MongoService.collectionDetails("holiday").then((obj) => {
          return obj.connection
            .find({})
            .toArray()
            .finally(() => {
              obj.client.close();
            });
        });
      }
      static deleteHoliday(id: any) {
        return MongoService.collectionDetails("holiday").then((obj) => {
          return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
            obj.client.close();
          });
        });
      }
      static putHolidayDetails(id: string, holidayDetails: IHolidayDetails) {
        return MongoService.collectionDetails("holiday").then((obj) => {
          return obj.connection
            .updateOne({ _id: new ObjectId(id) }, {$set:holidayDetails})
            .finally(() => {
              obj.client.close();
            });
        });
      }
}