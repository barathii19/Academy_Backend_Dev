import { MongoService } from "./mongo-service";
import { IUpdateProfileDetails } from "../model/IProfileDetails";
import { ObjectId } from "mongodb";
import { metaData } from "../environment/meta-data";
import { profile } from "console";
export class ProfileService {
    static updateProfileDetail(id: string, profileDetail: IUpdateProfileDetails) {
        return MongoService.collectionDetails("user").then((obj) => {
            return obj.connection
                .updateOne({ _id: new ObjectId(id) }, { $set: profileDetail }).then((data) => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            message: "Profile Updated succesfully!",
                        });
                    });
                })
                .finally(() => {
                    obj.client.close();
                });
        });

    }
}