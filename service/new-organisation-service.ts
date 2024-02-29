import { MongoService } from "./mongo-service";
import { IOrganisationDetails } from "../model/IOrganisationDetails";
import { IUserDetails } from "../model/IUserDetails";
export class OrganisationService {
  //crud super admin can create new organisation owner
  static postOrganisationDetails(requestBody:any) {
    const {email}=requestBody
    let organisationExists: Boolean = false;
    return MongoService.collectionDetails("organisation").then((obj) => {
        return obj.connection
        .findOne({
          email,
        })    
        .then((data) => {
          if (data) {
            organisationExists = true;
          }
          if (!organisationExists) {
            return MongoService.collectionDetails("organisation").then((obj2) => {
              return obj2.connection.insertOne(requestBody).finally(() => {
                obj2.client.close();
              });
            });
          } else {
            return new Promise((resolve, reject) => {
              reject({ auth: false, message: "Organisation exist with this email" });
            });
          }
        })
        .catch((err) => {
          return new Promise((resolve, reject) => {
            reject({ auth: false, message: err });
          });
        })
        .finally(() => {
          obj.client.close();
        });
    }); 
  }
  //find user by email and get organisationid 
  static getSpecificOrganisationDetails(bodyContent: any) {
    const {organisationId}=bodyContent
    let flag:boolean=true
    return MongoService.collectionDetails("user").then((obj) => {
      return obj.connection.findOne<IUserDetails>(
       {
        $or:[{email:organisationId},{organisationId}]
       }
      ).then((data)=>{
        if(!data){
          flag=false
        }
        if(!flag){
          return new Promise((resolve,reject)=>{
            reject({
              message:"your organisation not found"
            })
          })
        }else{
          return MongoService.collectionDetails("organisation").then((obj2)=>{
            return obj2.connection.findOne<IOrganisationDetails>({organisationId:data?.organisationId})
            .catch((err)=>{
              return new Promise((resolve, reject) => {
                reject({ auth: false, message: err });
              });
            })
            .finally(()=>{
              obj2.client.close()
            })
          })
        }
      }).catch((err)=>{
        return new Promise((resolve, reject) => {
          reject({ auth: false, message: err });
        });
      }).finally(() => {
        obj.client.close();
      });
    });
  }

  // fine specific organisation by organisationId
  static getSpecificOrganisation(organisationId:string){
    return MongoService.collectionDetails("organisation").then((obj2) => {
      return obj2.connection.findOne({organisationId}).finally(() => {
        obj2.client.close();
      });
    });
  }
}
