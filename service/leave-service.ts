import { MongoService } from "./mongo-service";
import { ObjectId } from "mongodb";
import { ILeaveDetails } from "../model/ILeaveDetails";

export class LeaveService {
    static postLeaveDetail(leaveDetails: ILeaveDetails[]) {
        return MongoService.collectionDetails("leave").then((obj) => {
          return obj.connection.insertMany(leaveDetails).finally(() => {
            obj.client.close();
          });
        });
      }
      static getApplyLeave(_sDate:any,_eDate:any,userId:any,organisationId:any) {      
        return MongoService.collectionDetails("leave").then((obj) => {
          return obj.connection.find({
            requestorId:userId,
            organisationId,
            leaveDates:{$elemMatch:{
              $gte:new Date(_sDate).toISOString(),$lte:new Date(_eDate).toISOString()
            }},
          }).toArray()
          .finally(()=>{obj.client.close();})
        });
      }
      static getLeaveDetails(organisationId:string,branch:string) {
        return MongoService.collectionDetails("leave").then((obj) => {
          return obj.connection
            .find({organisationId,branch})
            .toArray()
            .finally(() => {
              obj.client.close();
            });
        });
      }
      static updateApplyLeaves(id: string, bodyContent: any) {
        return MongoService.collectionDetails("leave").then((obj) => {
          return obj.connection
            .updateOne({ _id: new ObjectId(id) },{$set: { status : bodyContent.status,approverComments:bodyContent.approverComments}} )
            .finally(() => {
              obj.client.close();
            });
        });
      }
}