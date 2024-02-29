import * as mongoDB from "mongodb";
import { metaData } from "../environment/meta-data";
export class MongoService {
  static collectionDetails(type: string): Promise<{
    client: mongoDB.MongoClient;
    connection: mongoDB.Collection;
  }> {
    let client: mongoDB.MongoClient = new mongoDB.MongoClient(
      metaData.db.connectionURL
    );
    return client.connect().then(() => {
      let db: mongoDB.Db = client.db(metaData.db.databaseName);
      let collection = db.collection(metaData.db.collectionDetails.user);
      switch (type) {
        case "user":
          collection = db.collection(metaData.db.collectionDetails.user);
          break;
        case "branch":
          collection = db.collection(metaData.db.collectionDetails.branch);
          break;
        case "batch":
          collection = db.collection(metaData.db.collectionDetails.batch);
          break;
        case "student":
          collection = db.collection(metaData.db.collectionDetails.student);
          break;
        case "course":
          collection = db.collection(metaData.db.collectionDetails.course);
          break;
        case "payment":
          collection = db.collection(metaData.db.collectionDetails.payment);
          break;
        case "staff":
          collection = db.collection(metaData.db.collectionDetails.staff);
          break;
        case "notification":
          collection = db.collection(
            metaData.db.collectionDetails.notification
          );
          break;
        case "admin":
          collection = db.collection(metaData.db.collectionDetails.admin);
          break;
        case "otp":
          collection = db.collection(metaData.db.collectionDetails.otp);
          break;
        case "approval":
          collection = db.collection(metaData.db.collectionDetails.approval);
          break;
        case "metadata":
          collection = db.collection(metaData.db.collectionDetails.metadata);
          break;
        case "document":
          collection = db.collection(metaData.db.collectionDetails.document);
          break;
        case "advertisement":
          collection = db.collection(
            metaData.db.collectionDetails.advertisement
          );
          break;
        case "attendance":
          collection = db.collection(metaData.db.collectionDetails.attendance);
          break;
        case "leave":
          collection = db.collection(metaData.db.collectionDetails.leave);
          break;
        case "holiday":
          collection = db.collection(metaData.db.collectionDetails.holiday);
          break;
        case "email":
          collection = db.collection(metaData.db.collectionDetails.email);
          break;
        case "organisation":
          collection = db.collection(
            metaData.db.collectionDetails.organisation
          );
          break;
        case "credential":
          collection = db.collection(metaData.db.collectionDetails.credential);
          break;
        case "expense":
          collection = db.collection(metaData.db.collectionDetails.expense);
          break;
        case "assessment":
          collection = db.collection(metaData.db.collectionDetails.assessment);
          break;
        case "event":
          collection = db.collection(metaData.db.collectionDetails.event);
          break;
        case "interview":
          collection = db.collection(metaData.db.collectionDetails.interview);
          break;
        case "quiz":
          collection = db.collection(metaData.db.collectionDetails.quiz);
          break;
        case "matExam":
          collection = db.collection(metaData.db.collectionDetails.matExam);
          break;
        case "matOtp":
          collection = db.collection(metaData.db.collectionDetails.matOtp);
          break;
        case "matQuiz":
          collection = db.collection(metaData.db.collectionDetails.matQuiz);
          break;
        default:
          break;
      }
      return {
        client: client,
        connection: collection,
      };
    });
  }
}
