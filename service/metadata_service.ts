import { MongoService } from "./mongo-service";
export class MetadataService {
  static getMetadataDetails() {
    return MongoService.collectionDetails("metadata").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
}