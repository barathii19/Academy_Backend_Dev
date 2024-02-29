export interface IBatchDetails {

}

export interface IBatchPayload {
    batchName: string;
    duration: {
        startDate: string,
        endDate: string;
        timings: {
            from: string;
            to: string;
        }
    },
    course: {
        name: string;
        id: string
    },
    inCharge: {
        name: string;
        id: string;
    }
}

export interface IPostBatchDetails {
    _id: any;
    studentList: any[];
    creater: string | any;
    branch: string;
    batchName: string;
    duration: {
        startDate: string,
        endDate: string;
        timings: {
            from: string;
            to: string;
        }
    },
    course: {
        name: string;
        id: any
    },
    inCharge: {
        name: string;
        id: string;
    }
    completed: Boolean
    info: any
}