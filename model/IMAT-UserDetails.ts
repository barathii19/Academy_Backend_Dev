// export interface IMAT_UserDetails {
//   email: String;
//   name: String;
//   contact: Number;
//   isCompleted: Boolean;
// }

export interface IMAT_QUIZ {
  question: String;
  options: [String];
  answer: String;
  type: String;
  typeId: String;
}

export interface IMAT_ANSWERS {
  id: any;
  answers: [
    {
      id: String;
      answer: String;
    }
  ];
}

export interface IMAT_USER_PAYLOAD {
  email: String;
  contact: Number;
  name: String;
}
