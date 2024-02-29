export interface IAdminDetails {}

export interface IPostAdminDetils{
    firstName:string;
    lastName:string;
    mobileNumber:string;
    email:string;
    assignedBranch:{
        id:string;
        name:string
    }
}