export interface IMAT_OTP_DETAILS {
  email: String;
  name: String;
  otp: Number;
  contact: Number;
  createdAt: Date;
}

export interface IMAT_OTP_PAYLOAD {
  otp: Number;
  id: any;
}
