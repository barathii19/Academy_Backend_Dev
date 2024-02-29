export interface IBranchDetails {
  branch: string;
  address: string;
  city: string;
  state: String;
}

export interface IReassignAdmin {
  branchId:string,
  branchName:string;
  adminId:string;
}