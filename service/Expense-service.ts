import { ObjectId } from "mongodb";
import { metaData } from "../environment/meta-data";
import { MongoService } from "./mongo-service";
import { v4 as uuidv4 } from 'uuid';
import { Request } from "express"
import { HelperController } from "../controller/Helper-controller";
import { LogController } from "../controller/log-controller";



export class ExpenseService {
    static postExpenseService(id: any, bodyData: any) {
        return MongoService.collectionDetails("user").then((userObj) => {
            return userObj.connection.findOne({ _id: new ObjectId(id), $or: [{ userGroup: metaData.userGroup.superAdmin }, { userGroup: metaData.userGroup.admin }] }).then((userData) => {
                if (userData) {
                    const userGroup = userData.userGroup;
                    const expenseData = { ...bodyData, doc: null, currencyType: "IND" }
                    expenseData.expenseId = "#" + uuidv4();
                    expenseData.createBy = new ObjectId(id);
                    expenseData.status = userGroup === metaData.userGroup.superAdmin ? "approved" : "pending"
                    expenseData.date = new Date(bodyData.date)
                    return MongoService.collectionDetails("expense").then((expenseObj) => {
                        return expenseObj.connection.insertOne(expenseData).finally(() => {
                            expenseObj.client.close()
                        })
                    })


                } else {
                    return new Promise((_, reject) => {
                        reject("super admin and admin only can create a expense")
                    })
                }
            }).finally(() => {
                userObj.client.close()
            })
        })
    }
    static getExpenseService(request: Request) {
        let query = {}
        const requestQuery = request.query;
        if (requestQuery && Object.keys(requestQuery).length > 0) {
            query = requestQuery
        }
        return MongoService.collectionDetails("expense").then(obj => {
            return obj.connection.find(query).toArray().finally(() => {
                obj.client.close()
            })
        })
    }
    static updateStatus(id: any, bodyData: any) {
        return MongoService.collectionDetails("user").then(obj => {
            return obj.connection.findOne({ _id: new ObjectId(id), userGroup: metaData.userGroup.superAdmin }).then(userData => {
                if (userData) {
                    return MongoService.collectionDetails("expense").then((expenseObj) => {
                        return expenseObj.connection.findOneAndUpdate({ _id: new ObjectId(bodyData.id), status: "pending" }, { $set: { status: bodyData.status } }).then((data: any) => {
                            if (data.lastErrorObject.updatedExisting) {
                                return new Promise((resolve) => {
                                    resolve("status updated")
                                })
                            } else {
                                return new Promise((_, reject) => {
                                    reject("Status already updated")
                                })
                            }
                        }).finally(() => {
                            expenseObj.client.close()
                        })
                    })
                } else {
                    return new Promise((_, reject) => {
                        reject("Super admin only can update the status")
                    })
                }
            }).finally(() => {
                obj.client.close()
            })
        })
    }
    static getChartDataService(year: any, type: string) {
        if (type === "income") {
            return MongoService.collectionDetails("payment").then(async (obj) => {
                try {
                    const report = await obj.connection.aggregate([
                        {
                            $group: {
                                _id: null,
                                payment: {
                                    $push: "$payment"
                                }
                            }
                        },
                        {
                            $project: {
                                data: {
                                    $reduce: {
                                        input: "$payment",
                                        initialValue: [],
                                        in: {
                                            "$concatArrays": [
                                                "$$value",
                                                "$$this"
                                            ]
                                        }
                                    }
                                },
                            }
                        },
                        { $unwind: "$data" },
                        { $project: { year: { $year: "$data.createAt" }, month: { $month: "$data.createAt" }, data: 1 } },
                        { $match: { year: Number(year) } },
                        { $group: { _id: "$month", monthData: { $push: "$$ROOT" } } }

                    ]).toArray().finally(() => {
                        obj.client.close()
                    })
                    const yearReport: any = []
                    if (report && report.length > 0) {
                        for (const monthReport of report) {
                            const monthlyIncome = monthReport.monthData.map((doc: any) => doc.data.amount).reduce((a: any, b: any) => a + b, 0)
                            const month = HelperController.getStringMonth(monthReport._id - 1)
                            yearReport.push({ monthlyIncome, month, year })
                        }
                    }
                    return new Promise((resolve) => {
                        resolve(yearReport)
                    })
                } catch (error) {
                    return new Promise((_, reject) => {
                        reject(LogController.errorMes("incomeserviceasyncerror-", error))
                    })
                }
            })
        } else {
            return MongoService.collectionDetails("expense").then(async (expenseObj) => {
                try {
                    const report = await expenseObj.connection.aggregate([
                        {
                            $project: { year: { $year: "$date" }, month: { $month: "$date" }, expense: 1, expenseCategory: 1, expenseDescription: 1, currencyType: 1, expenseId: 1, status: 1, date: 1 }
                        },
                        { $match: { year: Number(year) } },
                        { $group: { _id: "$month", data: { $push: "$$ROOT" } } }
                    ]).toArray().finally(() => {
                        expenseObj.client.close()
                    })
                    const yearReport: any = []
                    if (report.length > 0) {
                        for (const monthReport of report) {
                            const monthlyExpense = monthReport.data.map((doc: any) => doc.expense).reduce((a: any, b: any) => a + b, 0)
                            const month = HelperController.getStringMonth(monthReport._id - 1)
                            yearReport.push({ month, monthlyExpense, year })
                        }
                    }
                    return new Promise((resolve) => {
                        resolve(yearReport)
                    })
                } catch (error) {
                    return new Promise((_, reject) => {
                        reject(LogController.errorMes("expenseserviceasyncerror-", error))
                    })
                }
            })
        }
    }
}