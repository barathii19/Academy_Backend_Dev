export interface IStudentDetails {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
}

interface Payment {
    transactionMode: string;
    transactionId: string;
    paidAmount: number
}

interface Course {
    id: string;
    name: string;
    paymentMethod: string;
    payment: Payment[];
}

interface Batch {
    id: string;
    name: string;
}

export interface IStudentPayload {
    "firstName": string,
    "lastName": string,
    "mobileNumber": string,
    "email": string,
    "course": {
        "id": string,
        "name": string,
    },
    "batch": {
        "id": string,
        "name": string
    },
    "payment": {
        "paymentMethod": string,
        "paymentMode": string,
        "transactionId": string,
        "paidAmount": number
    }
}

export interface IPostStudentDetails {
    userGroup: string;
    branch: string;
    name: string;
    mobileNumber: string;
    email: string;
    course: Course[],
    batch: Batch[]

}