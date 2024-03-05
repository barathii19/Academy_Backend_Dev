import { ObjectId } from "mongodb";
import { MongoService } from "./mongo-service";
import { metaData } from "../environment/meta-data";

export class AssessmentService {
    static getAssessmentService(batchId: any) {
        return MongoService.collectionDetails("assessment").then(obj => {
            return obj.connection.find({ batch: new ObjectId(batchId) }).toArray().finally(() => {
                obj.client.close()
            })
        })
    }
    static postAssessmentService(bodyData: any, createrId: any) {
        return MongoService.collectionDetails("batch").then(batchObj => {
            return batchObj.connection.findOne({ _id: new ObjectId(bodyData.batch), "inCharge.id": createrId }).then((batchData) => {
                console.log(batchData, "batchData");
                
                if (batchData) {
                    const studentList = batchData.studentList.map((id: any) => {
                        return {
                            id,
                            attendance: null,
                            mark: 0
                        }
                    })
                    const assessment = {
                        ...bodyData,
                        batch: new ObjectId(bodyData.batch),
                        assessment: studentList
                    }
                    return MongoService.collectionDetails("assessment").then((testObj) => {
                        return testObj.connection.insertOne(assessment).finally(() => {
                            testObj.client.close()
                        })
                    })
                } else {
                    return new Promise((_, reject) => {
                        reject("invalid batch")
                    })
                }
            }).finally(() => {
                batchObj.client.close()
            })
        })
    }
    static getAssessmentInfoService(id: any) {
        console.log(id, "id");
        return MongoService.collectionDetails("assessment").then(obj => {
            return obj.connection.aggregate([
                { $match: { _id: new ObjectId(id) } },
                {
                    "$unwind": {
                        "path": "$assessment"
                    }
                },
                {
                    "$lookup": {
                        "from": metaData.db.collectionDetails.user,
                        "foreignField": "_id",
                        "localField": "assessment.id",
                        "let": {
                            "tId": "$assessment.id",
                            "tmark": "$assessment.mark",
                            "tattendance": "$assessment.attendance",
                            "tRoot": "$$ROOT"
                        },
                        "pipeline": [
                            {
                                "$project": {
                                    "mark": "$$tmark",
                                    "attendance": "$$tattendance",
                                    "totalMark": "$$tRoot.totalMark",
                                    "date": "$$tRoot.date",
                                    "timings": "$$tRoot.timings",
                                    "title": "$$tRoot.title",
                                    "firstName": "$$ROOT.firstName",
                                    "lastName": "$$ROOT.lastName",
                                    "email": "$$ROOT.email",
                                    "mobileNumber": "$$ROOT.mobileNumber",
                                    "profileColor": "$$ROOT.profileColor",

                                }
                            }
                        ],
                        "as": "assessmentList"
                    }
                },
                {
                    "$unwind": {
                        "path": "$assessmentList"
                    }
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "assessmentList": {
                            "$push": "$assessmentList"
                        }
                    }
                }
            ]).toArray().finally(() => {
                obj.client.close()
            })
        })
    }
    static postAssessmentInfoService(id: any, bodyData: any[]) {
        return MongoService.collectionDetails("assessment").then(obj => {
            return obj.connection.findOne({ _id: new ObjectId(id) }).then(data => {
                if (data) {
                    const updatedAssessment = []
                    for (const info of data.assessment) {
                        const avaData = bodyData.find((doc: any) => doc.id === info.id.toString())
                        if (avaData) {
                            updatedAssessment.push({
                                id: info.id,
                                attendance: avaData.attendance,
                                mark: avaData.mark
                            })
                        } else {
                            updatedAssessment.push(info)
                        }
                    }
                    return obj.connection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { assessment: updatedAssessment } })
                } else {
                    return new Promise((_, reject) => {
                        reject("Invalid Id")
                    })
                }
            }).finally(() => {
                obj.client.close()
            })
        })
    }
    static deleteAssessmentService(id: any, createrId: any) {
        return MongoService.collectionDetails("assessment").then(obj => {
            return obj.connection.findOne({ _id: new ObjectId(id) }).then((data) => {
                if (data) {
                    const batchId = data.batch;
                    return MongoService.collectionDetails("batch").then((batchobj) => {
                        return batchobj.connection.findOne({ _id: new ObjectId(batchId), "inCharge.id": createrId }).then(batchData => {
                            if (batchData) {
                                return obj.connection.deleteOne({ _id: new ObjectId(id) })
                            } else {
                                return new Promise((_, reject) => {
                                    reject("Invalid user")
                                })
                            }
                        }).finally(() => {
                            batchobj.client.close()
                        })
                    })
                } else {
                    return new Promise((_, reject) => {
                        reject("Assessment not available")
                    })
                }
            }).finally(() => {
                obj.client.close()
            })
        })
    }
}