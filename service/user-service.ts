
import { ObjectId } from "mongodb";
import { MongoService } from "./mongo-service";

export class UserService {
static getUserAllDetails(organisationId:string,branch:string) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .find({organisationId,branch})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
static getAllUsersOfOrganisation(organisationId:string) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .find({organisationId})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
static getUsersOfOrganisationDetails(organisationId:string,branch:string) {
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection
        .find({organisationId,branch})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }  
static getUserDetailsByBranchAndGroup(branchId: string, userGroup: string) {
  return MongoService.collectionDetails("user").then((obj) => {
    return obj.connection
     .find({ branch: new ObjectId(branchId), userGroup: userGroup })
     .project({password:0, userGroup:0, isActive:0})
     .toArray()
     .finally(() => {
        obj.client.close();
      });
    });
 }
}