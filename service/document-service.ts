import { MongoService } from "./mongo-service";
export class DocumentService {

    //used while signin without token
  static getSpecificFileDetail(bodyContent:any) {
    const {organisationId}=bodyContent
    if(!organisationId){
      return Promise.resolve({
        file:"",
        message:""
      })
    }
    return MongoService.collectionDetails("document").then((obj) => {
      return obj.connection.findOne({uniqueId:organisationId}).finally(() => {
        obj.client.close();
      });
    });
  }

  static uploadFileDetail( bodyData: any) {

      return MongoService.collectionDetails("document").then((obj) => {          
        return obj.connection
          .insertOne({...bodyData })
          .finally(() => {
            obj.client.close();
          });
      });
  }
  static updateUploadFileDetail(id: any, type:any,bodyData: any) {
    const {chunks}=bodyData
    return MongoService.collectionDetails("document").then((obj) => {          
      return obj.connection
      .findOne({uniqueId:id,type}).then((data)=>{
        return obj.connection.updateOne({ uniqueId : id,type }, { $set: {file:data?.file+chunks} })
      })
      .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteDocumentAndProfileImg(uniqueId: any) {
    return MongoService.collectionDetails("document").then((obj) => {          
      return obj.connection
      .deleteMany({ uniqueId })
      .finally(() => {
          obj.client.close();
        });
    });
  }
  static deleteSpecificDocumentByTypeAndUniqueId(type:string,uniqueId:string) {
    return MongoService.collectionDetails("document").then((obj) => {          
      return obj.connection
      .deleteOne({ uniqueId,type })
      .finally(() => {
          obj.client.close();
        });
    });
  }
}
