import { ObjectId } from "mongodb";
import { MongoService } from "./mongo-service";
import { metaData } from "../environment/meta-data";
import { EventPayload } from "../controller/Event-controller";
import { HelperController } from "../controller/Helper-controller";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { LogController } from "../controller/log-controller";

export class EventService {
    static postEventService(createrId: any, bodyData: EventPayload) {
        return MongoService.collectionDetails("user").then(userObj => {
            const query = { _id: new ObjectId(createrId), $or: [{ userGroup: metaData.userGroup.admin }, { userGroup: metaData.userGroup.superAdmin }] }
            return userObj.connection.findOne(query).then(userData => {
                if (userData) {
                    const userGroup = userData.userGroup;
                    return MongoService.collectionDetails("event").then(eventObj => {
                        const eventData = {
                            ...bodyData,
                            date: new Date(bodyData.date),
                            creater: new ObjectId(createrId),
                            color: HelperController.getRandomColor(),
                            tag: typeof bodyData.tag === "string" && bodyData.tag === "all" ? (userGroup === metaData.userGroup.superAdmin ? "super-all" : "all-" + createrId) : bodyData.tag,
                            eventId: uuidv4()
                        }
                        return eventObj.connection.insertOne(eventData).finally(() => {
                            eventObj.client.close()
                        })
                    })
                } else {
                    return new Promise((_, reject) => {
                        reject("admin and superadmin only can create a event")
                    })
                }
            }).finally(() => {
                userObj.client.close()
            })
        })
    }
    static getEventService(Id: any, paramsQuery: any) {
        return MongoService.collectionDetails("user").then(userObj => {
            return userObj.connection.findOne({ _id: new ObjectId(Id) }).then(userData => {

                if (userData) {
                    const userGroup = userData.userGroup;
                    const query: any = {
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1,
                    }

                    if (paramsQuery && paramsQuery.month && paramsQuery.year) {
                        query.month = Number(paramsQuery.month)
                        query.year = Number(paramsQuery.year)
                    }
                    if (userGroup === metaData.userGroup.superAdmin) {
                        query.creater = new ObjectId(Id)
                    } else if (userGroup === metaData.userGroup.admin) {
                        query["$or"] = [{ creater: new ObjectId(Id) }, { tag: "super-all" }]
                    } else if (userGroup === metaData.userGroup.staff || userGroup === metaData.userGroup.student) {
                        query["$or"] = [{ "tag.id": Id }, { tag: "all-" + userData.creater }, { tag: "super-all" }]
                    }

                    return MongoService.collectionDetails("event").then(eventObj => {
                        return eventObj.connection.aggregate([
                            { $project: { year: { $year: "$date" }, month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, date: 1, eventName: 1, eventDescripition: 1, creater: 1, tag: 1, color: 1, eventId: 1 } },
                            { $match: query },
                            {
                                $group: {
                                    _id: {
                                        year: "$year",
                                        month: "$month",
                                        day: "$day"
                                    },
                                    events: {
                                        $push: {
                                            color: "$color",
                                            eventName: "$eventName",
                                            eventDescripition: "$eventDescripition",
                                            date: "$date",
                                            eventId: "$eventId",
                                            creater: "$creater"
                                        }
                                    }
                                }
                            },
                        ]).toArray().finally(() => {
                            eventObj.client.close()
                        })
                    })

                } else {
                    return new Promise((_, reject) => {
                        reject("Invalid User")
                    })
                }
            }).finally(() => {
                userObj.client.close()
            })
        })
    }

    static getTaggedUserService(id: string) {
        return MongoService.collectionDetails("user").then(obj => {
            return obj.connection.find({
                creater: new ObjectId(id), $or: [{ userGroup: metaData.userGroup.staff }, { userGroup: metaData.userGroup.student }]
            }).project({ _id: 1, firstName: 1, lastName: 1, type: "$userGroup" }).toArray().finally(() => {
                obj.client.close()
            })
        })
    }
    static postBatchEvent(batchId: string, bodyData: any, createrId: any) {
        return MongoService.collectionDetails("üser").then(userObj => {
            return userObj.connection.findOne({ _id: new ObjectId(createrId), userGroup: metaData.userGroup.staff }).then(userData => {
                if (userData) {
                    const assignedBatchIds = userData.assignedIn.map((doc: any) => doc.batchId.toString())
                    if (!assignedBatchIds.includes(batchId)) {
                        return new Promise((_, reject) => {
                            reject("Only Batch Incharge can create events")
                        })
                    }
                    return MongoService.collectionDetails("batch").then(batchObj => {
                        return batchObj.connection.findOne({ _id: new ObjectId(batchId) }).then(batchData => {
                            if (batchData) {
                                const tag = batchData.studentList.map((id: any) => ({ id: id.toString(), type: metaData.userGroup.student }))
                                tag.push({
                                    id: createrId,
                                    type: metaData.userGroup.staff
                                })
                                return MongoService.collectionDetails("event").then(eventObj => {
                                    const eventData = {
                                        eventName: bodyData.eventName,
                                        eventDescripition: bodyData.eventDescripition,
                                        tag,
                                        date: new Date(bodyData.date),
                                        creater: new ObjectId(createrId),
                                        color: HelperController.getRandomColor(),
                                        eventId: uuidv4()
                                    }
                                    return eventObj.connection.insertOne(eventData).finally(() => {
                                        eventObj.client.close()
                                    })
                                })
                            } else {
                                return new Promise((_, reject) => {
                                    reject("Invalid batchid")
                                })
                            }
                        }).finally(() => {
                            batchObj.client.close()
                        })
                    })
                } else {
                    return new Promise((_, reject) => {
                        reject("Staff only can create batchEvent")
                    })
                }
            }).finally(() => {
                userObj.client.close()
            })
        })
    }
    static deleteEventService(eventId: string, creater: string) {
        return MongoService.collectionDetails("event").then(obj => {
            return obj.connection.deleteOne({ eventId, creater: new ObjectId(creater) }).finally(() => {
                obj.client.close()
            })
        })
    }
    static updateEvent(eventId: string, creater: string, bodyData: any) {
        return MongoService.collectionDetails("event").then(obj => {
            const updateEvent: any = {
                $set: {}
            }
            if (bodyData.eventName) {
                updateEvent["$set"].eventName = bodyData.eventName
            }
            if (bodyData.eventDescripition) {
                updateEvent["$set"].eventDescripition = bodyData.eventDescripition
            }
            if (bodyData.color) {
                updateEvent["$set"].color = bodyData.color
            }

            return obj.connection.findOneAndUpdate({ eventId, creater: new ObjectId(creater) }, updateEvent).finally(() => {
                obj.client.close()
            })
        })
    }
    static scheduleInterviewService(createrId: any, studentId: any, bodyData: any) {
        const data = {
            ...bodyData,
            date: new Date(bodyData.date),
            time: new Date(bodyData.time),
            creater: new ObjectId(createrId),
            isCompleted: false,
            status: "screening",
            student: new ObjectId(studentId)
        }
        const eventDescripition = "Interview Schedule for you at " + moment(new Date(bodyData.date)).format("dddd, MMMM Do YYYY") + "," + moment(new Date(bodyData.time)).format("h:mm a")
        const eventData = {
            "eventName": "Interview",
            "eventDescripition": eventDescripition,
            "tag": [{
                id: studentId,
                type: "student"
            }],
            "date": new Date(),
            "creater": new ObjectId(createrId),
            "color": HelperController.getRandomColor(),
            "eventId": uuidv4()
        }
        return MongoService.collectionDetails("user").then(obj => {
            return obj.connection.findOne({ _id: new ObjectId(createrId), userGroup: metaData.userGroup.recruiter }).then(async (userData) => {
                if (userData) {
                    try {
                        const collectionStatus = await MongoService.collectionDetails("interview").then(interviewObj => {
                            return interviewObj.connection.insertOne(data).finally(() => {
                                interviewObj.client.close()
                            })
                        })
                        if (collectionStatus.acknowledged) {
                            return MongoService.collectionDetails("event").then(eventObj => {
                                return eventObj.connection.insertOne(eventData).finally(() => {
                                    eventObj.client.close()
                                })
                            })
                        } else {
                            return new Promise((_, reject) => {
                                reject("Collection Error")
                            })
                        }
                    } catch (error) {
                        console.log(error);
                        return new Promise((_, reject) => {
                            reject(LogController.errorMes("Interview-", error))
                        })
                    }


                } else {
                    return new Promise((_, reject) => {
                        reject("Recruiter Only can schedule interview")
                    })
                }
            }).finally(() => {
                obj.client.close()
            })
        })
    }
    static getInterviewListService(id: any) {
        return MongoService.collectionDetails("interview").then(obj => {
            return obj.connection.aggregate([
                { $match: { creater: new ObjectId(id) } },
                {
                    $lookup: {
                        from: metaData.db.collectionDetails.user,
                        localField: 'student',
                        pipeline: [
                            { $project: { password: 0, userGroup: 0, course: 0, batch: 0, creater: 0, branch: 0 } }
                        ],
                        foreignField: '_id',
                        as: 'studentInfo'
                    },

                },
                { $project: { creater: 0, student: 0 } }
            ]).toArray().finally(() => {
                obj.client.close()
            })
        })
    }
}