interface IQuizInfo {
  total: number;
  mark: number;
  percentage: number;
}

interface IQuestions {
  questionId: any;
  questions: String;
  options: [String];
  answer: String;
}

interface IStudents {
  studentId: String;
  solved: Boolean;
  score: Number;
}

export interface IQuiz {
  topic: String;
  moduleId: String;
  moduleName: String;
  batchId: String;
  date: String;
  creator: String;
  questions: IQuestions[];
  quizInfo: IQuizInfo[];
  type: String;
  students: IStudents[];
}

interface IStudent_Answer {
  id: any;
  option: String;
}

export interface ISumbmit_Quiz {
  student_id: any;
  student_submit_answer: IStudent_Answer[];
}
