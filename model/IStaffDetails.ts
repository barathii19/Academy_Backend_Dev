export interface IStaffDetails {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
}

export interface IPostStaffDetails {
    creater: any;
    assignedIn: any[];
    userGroup: string;
    password: string;
    branch: any;
    isActive: boolean;
    name: string;
    mobileNumber: string;
    email: string;
    field: any[];
    profileColor: string
}