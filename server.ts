import express, { Request, Response, NextFunction, response } from "express";
import bodyParser from "body-parser";
import { StudentController } from "./controller/student-controller";
import { BatchController } from "./controller/batch-controller";
import { CourseController } from "./controller/course-controller";
import { BranchController } from "./controller/branch-controller";
import { metaData } from "./environment/meta-data";
import { paymentController } from "./controller/payment-controller";
import { reportController } from "./controller/report-controller";
import { staffController } from "./controller/staff-controller";
import { LoginController } from "./controller/login-controller";
import { NotificationController } from "./controller/notification-controller";
import cors from "cors";
import { AdminController } from "./controller/admin-controller";
import { DocumentController } from "./controller/document-controller";
import { HomeController } from "./controller/home-controller";
import { MetadataController } from "./controller/metadata_controller";
import { UserController } from "./controller/user-controller";
import { AttendanceController } from "./controller/attendance-controller";
import { AdvertisementController } from "./controller/advertisement_controller";
import { request } from "http";
import { LeaveController } from "./controller/leave-controller";
import { HolidayController } from "./controller/holiday-controller";
import { ApplyController } from "./controller/apply-controller";
import { EmailController } from "./controller/email-controller";
import { OrganisationController } from "./controller/new-organisation-controller";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./environment/swagger-spec";
import v1router from "./routes/v1";
import { MiddleWare } from "./common/middleware";
import { ProfileController } from "./controller/profile-controller";
import { ExpenseController } from "./controller/Expense-controller";
import { AssessmentController } from "./controller/assessment-controller";
import { EventController } from "./controller/Event-controller";
import { QuizContoller } from "./controller/quiz-controller";
import { MATExamController } from "./controller/matExam-controller";
import multer from "multer";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

// swagger UI
// app.use("/academy/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// app.use((req, res, next) => {
//   if (
//     req.url &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.loginDetails.toLocaleLowerCase() &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.newUserRegistrationDetails.toLocaleLowerCase() &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.forgotPassword.toLocaleLowerCase() &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.confirmOtp.toLocaleLowerCase() &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.confirmOtp.toLocaleLowerCase() &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.getSpecificOrganisation.toLocaleLowerCase() &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.getSpecificOrganisationFileDetail.toLocaleLowerCase() &&
//     req.url.toLocaleLowerCase() !=
//       metaData.url.resetPassword.toLocaleLowerCase()
//   ) {
//     var token = req.headers["authorization"] as string;
//     if (!token)
//       return res
//         .status(401)
//         .send({ auth: false, message: "No token provided." });
//     LoginController.verifyAuthentication(
//       token.split("Bearer ")[1],
//       () => {
//         next();
//       },
//       (desc: string) => {
//         return res.status(500).send({
//           auth: false,
//           message: "Failed to authenticate token. " + desc,
//         });
//       }
//     );
//   } else {
//     next();
//   }
// });

// app.use("/api/v1", MiddleWare.loggerMiddleware, v1router);

//multer
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

//login
app.post(metaData.url.getCredentials, (req, res) => {
  LoginController.getCredentials(req, res);
});

app.post(metaData.url.loginDetails, (req, res) => {
  LoginController.getLoginDetails(req, res);
});

app.post(metaData.url.forgotPassword, (req, res) => {
  LoginController.forgotPassword(req, res);
});

app.post(metaData.url.confirmOtp, (req, res) => {
  LoginController.confirmOtp(req, res);
});

app.post(metaData.url.changePassword, (req, res) => {
  LoginController.changePasswordDetail(req, res);
});

app.post(metaData.url.resetPassword, (req, res) => {
  LoginController.resetPasswordDetail(req, res);
});

app.post(metaData.url.newUserRegistrationDetails, (req, res) => {
  LoginController.postLoginDetail(req, res);
});
//get specific user
app.get(metaData.url.getSpecificUser, (req, res) => {
  LoginController.getSpecificUserDetail(req, res);
});
app.get(metaData.url.getUsersOfOrganisationDetails, (req, res) => {
  UserController.getUsersOfOrganisationDetails(req, res);
});

app.put(metaData.url.userUpdate, (req, res) => {
  LoginController.updateLoginDetails(req, res);
});

app.get(metaData.url.getStudentDetails, (req, res) => {
  StudentController.getStudentDetails(req, res);
});
app.get(metaData.url.getStudentBranchDetails, (req, res) => {
  StudentController.getStudentBranchDetails(req, res);
});

app.post(metaData.url.postStudentDetail, (req, res) => {
  StudentController.postStudentDetails(req, res);
});
app.put(metaData.url.updateStudentDetail, (req, res) => {
  StudentController.updateStudentDetails(req, res);
});
app.put(metaData.url.updateNewCourseDetails, (req, res) => {
  StudentController.updateNewCourseDetails(req, res);
});

app.get(metaData.url.getSpecificTeacherDetails, (req, res) => {
  BatchController.getSpecificTeacherDetails(req, res);
});
app.get(metaData.url.getCourseDetails, (req, res) => {
  CourseController.getCourseDetails(req, res);
});
// getCourseAndDouments
app.get(metaData.url.getCourseAndDouments, (req, res) => {
  CourseController.getCourseAndDouments(req, res);
});

app.get(metaData.url.getSpecificCourseDetails, (req, res) => {
  CourseController.getSpecificCourseDetail(req, res);
});
app.post(metaData.url.postCourseDetails, (req, res) => {
  CourseController.postCourseDetails(req, res);
});

// document
app.post(metaData.url.uploadFileDetail, (req, res) => {
  DocumentController.uploadFileDetail(req, res);
});
app.post(metaData.url.updateUploadFileDetail, (req, res) => {
  DocumentController.updateUploadFileDetail(req, res);
});
app.delete(metaData.url.deleteCourseDetail, (req, res) => {
  CourseController.deleteCourseDetails(req, res);
});

app.get(metaData.url.getBatchDetails, (req, res) => {
  BatchController.getBatchDetails(req, res);
});
app.post(metaData.url.postBatchDetails, (req, res) => {
  BatchController.postBatchDetails(req, res);
});
app.put(metaData.url.updateCompletedStatus, (req, res) => {
  BatchController.updateCompletedStatus(req, res);
});
//payment

app.get(metaData.url.getPaymentDetails, (req, res) => {
  paymentController.getPaymentDetails(req, res);
});

app.post(metaData.url.postPaymentDetails, (req, res) => {
  paymentController.postPaymentDetail(req, res);
});

app.get(metaData.url.getSpecificPaymentDetails, (req, res) => {
  paymentController.getSpecificPaymentDetails(req, res);
});
app.put(metaData.url.updatePaymentDetails, (req, res) => {
  paymentController.updatePaymentDetails(req, res);
});
app.post(metaData.url.updatePaymentTransactionDetails, (req, res) => {
  paymentController.updatePaymentTransactionDetails(req, res);
});
//report

app.get(metaData.url.getReportDetails, (req, res) => {
  reportController.getReportDetails(req, res);
});

//teacher

app.get(metaData.url.getStaffDetails, (req, res) => {
  staffController.getStaffDetails(req, res);
});
app.get(metaData.url.getOrganisationsStaffs, (req, res) => {
  staffController.getOrganisationsStaffs(req, res);
});
app.get(metaData.url.getSpecificStaffDetails, (req, res) => {
  staffController.getSpecificStaffDetails(req, res);
});

app.post(metaData.url.postStaffDetails, (req, res) => {
  staffController.postStaffDetails(req, res);
});
app.put(metaData.url.updateStaffDetails, (req, res) => {
  staffController.updateStaffDetails(req, res);
});

// notification

app.get(metaData.url.getNotificationDetails, (req, res) => {
  NotificationController.getNotificationDetails(req, res);
});
app.post(metaData.url.postNotificationDetail, (req, res) => {
  NotificationController.postNotificationDetail(req, res);
});
app.delete(metaData.url.deleteNotificationDetail, (req, res) => {
  NotificationController.deleteNotificationDetails(req, res);
});
app.put(metaData.url.updateNotificationDetail, (req, res) => {
  NotificationController.updateNotificationDetails(req, res);
});
//admin
app.get(metaData.url.getAdminDetails, (req, res) => {
  AdminController.getAdminDetails(req, res);
});
app.get(metaData.url.getSpecificAdminDetails, (req, res) => {
  AdminController.getSpecificAdminDetail(req, res);
});
app.post(metaData.url.postAdminDetails, (req, res) => {
  AdminController.postAdminDetails(req, res);
});
app.post(metaData.url.postAdminDetail, (req, res) => {
  AdminController.postAdminDetail(req, res);
});
app.put(metaData.url.updateAdminDetail, (req, res) => {
  AdminController.updateAdminDetails(req, res);
});
app.delete(metaData.url.deleteAdminDetail, (req, res) => {
  AdminController.deleteAdminDetails(req, res);
});
app.post(metaData.url.postApprovalDetails, (req, res) => {
  AdminController.postApprovalDetails(req, res);
});
app.get(metaData.url.getApprovalDetails, (req, res) => {
  AdminController.getApprovalDetails(req, res);
});
app.delete(metaData.url.deleteApprovalDetails, (req, res) => {
  AdminController.deleteApprovalDetails(req, res);
});

// app.post(metaData.url.postUploadDetails, (req, res) => {
//   AdminController.postUploadDetails(req, res);
// });
app.get(metaData.url.getCardDetails, (req, res) => {
  HomeController.getCardDetails(req, res);
});
app.get(metaData.url.getChartDetails, (req, res) => {
  HomeController.getCardDetails(req, res);
});
app.get(metaData.url.getPaymentCardDetails, (req, res) => {
  HomeController.getPaymentDetails(req, res);
});
app.get(metaData.url.getBatchCardDetails, (req, res) => {
  HomeController.getBatchDetails(req, res);
});

// branch details

app.post(metaData.url.reAssign, (req, res) => {
  BranchController.reassignBranchAdmin(req, res);
});

app.post(metaData.url.postBranchDetails, (req, res) => {
  BranchController.postBranchDetails(req, res);
});

app.get(metaData.url.getBranchDetails, (req, res) => {
  BranchController.getBranchDetails(req, res);
});
app.get(metaData.url.getSpecificBranchDetails, (req, res) => {
  BranchController.getSpecificBranchDetails(req, res);
});

app.delete(metaData.url.deleteBranchDetail, (req, res) => {
  BranchController.deleteBranchDetail(req, res);
});

app.put(metaData.url.updateBranchDetail, (req, res) => {
  BranchController.updateBranchDetail(req, res);
});
app.get(metaData.url.metaData, (req, res) => {
  MetadataController.getMetadataDetails(req, res);
});
// user
app.get(metaData.url.getAllUserDetails, (req, res) => {
  UserController.getUserAllDetails(req, res);
});
app.get(metaData.url.getAllUsersOfOrganisation, (req, res) => {
  UserController.getAllUsersOfOrganisation(req, res);
});

app.delete(metaData.url.deleteAdvertisementDetails, (req, res) => {
  AdvertisementController.deleteAdvertisementDetails(req, res);
});
app.put(metaData.url.updateAdvertisementDetail, (req, res) => {
  AdvertisementController.updateAdvertisementDetail(req, res);
});

//attendance
app.post(metaData.url.postAttendanceDetails, (req, res) => {
  AttendanceController.postAttendanceDetails(req, res);
});

app.get(metaData.url.attendanceRange, (req, res) => {
  AttendanceController.getAttendanceRange(req, res);
});

app.get(metaData.url.getcheckindetails, (req, res) => {
  AttendanceController.getcheckindetails(req, res);
});

app.get(metaData.url.getWeeklyDateByQuery, (req, res) => {
  AttendanceController.getWeeklyDateByQuery(req, res);
});

app.put(metaData.url.putcheckindetails, (req, res) => {
  AttendanceController.putcheckindetails(req, res);
});

//leave
app.post(metaData.url.postApplyLeave, (req, res) => {
  LeaveController.postApplyLeave(req, res);
});

app.get(metaData.url.getApplyLeave, (req, res) => {
  LeaveController.getApplyLeave(req, res);
});

app.get(metaData.url.getLeaveDetails, (req, res) => {
  LeaveController.getLeaveDetails(req, res);
});
app.put(metaData.url.updateApplyLeave, (req, res) => {
  LeaveController.updateApplyLeaves(req, res);
});

// Holiday

app.get(metaData.url.getHolidayDetails, (req, res) => {
  HolidayController.getHolidayDetails(req, res);
});
app.post(metaData.url.postHolidayDetails, (req, res) => {
  HolidayController.postHolidayDetails(req, res);
});
app.get(metaData.url.holidayDetails, (req, res) => {
  HolidayController.holidayDetails(req, res);
});
app.delete(metaData.url.deleteHolidayDetails, (req, res) => {
  HolidayController.deleteHoliday(req, res);
});
app.put(metaData.url.putHolidayDetails, (req, res) => {
  HolidayController.putHolidayDetails(req, res);
});
// apply leave

app.get(metaData.url.getApplyDetails, (req, res) => {
  ApplyController.getApplyDetails(req, res);
});
app.post(metaData.url.postApplyDetails, (req, res) => {
  ApplyController.postApplyDetails(req, res);
});

// email

app.get(metaData.url.getEmailDetails, (req, res) => {
  EmailController.getEmailDetails(req, res);
});
app.post(metaData.url.postEmailDetails, (req, res) => {
  EmailController.postEmailDetails(req, res);
});
// organisation
// app.post(metaData.url.newOrganisationRegisteration, (req, res) => {
//   OrganisationController.postOrganisationDetails(req, res);
// });
app.post(metaData.url.getSpecificOrganisation, (req, res) => {
  OrganisationController.getSpecificOrganisationDetails(req, res);
});
// branch
app.get(metaData.url.getSpecificBranchByOrganisationId, (req, res) => {
  BranchController.getSpecificBranchByOrganisationId(req, res);
});
// course
app.post(metaData.url.postCourseDetail, (req, res) => {
  CourseController.postCourseDetail(req, res);
});
app.get(metaData.url.getSpecificOrganisationCourseDetail, (req, res) => {
  CourseController.getSpecificOrganisationCourseDetail(req, res);
});
app.put(metaData.url.updateCourseDetail, (req, res) => {
  CourseController.updateCourseDetails(req, res);
});
// staff
app.delete(metaData.url.deleteStaffDetail, (req, res) => {
  staffController.deleteStaffDetail(req, res);
});
app.delete(metaData.url.deleteStaffDocumentByDocumentName, (req, res) => {
  staffController.deleteStaffDocumentByDocumentName(req, res);
});
// document
app.delete(metaData.url.deleteDocumentAndProfileImg, (req, res) => {
  DocumentController.deleteDocumentAndProfileImg(req, res);
});
app.delete(metaData.url.deleteSpecificDocumentByTypeAndUniqueId, (req, res) => {
  DocumentController.deleteSpecificDocumentByTypeAndUniqueId(req, res);
});
app.post(metaData.url.getSpecificOrganisationFileDetail, (req, res) => {
  DocumentController.getSpecificFileDetail(req, res);
});
// user
app.delete(metaData.url.deleteUserDetails, (req, res) => {
  LoginController.deleteLoginDetail(req, res);
});
// payment getMonthwiseRevenueOfOrganisation and branch
app.get(metaData.url.getMonthwiseRevenueOfOrganisation, (req, res) => {
  paymentController.getMonthwiseRevenueOfOrganisation(req, res);
});
// payment getOrganisationRevenueDetails
app.get(metaData.url.getOrganisationRevenueDetails, (req, res) => {
  paymentController.getOrganisationRevenueDetails(req, res);
});
app.get(metaData.url.getOrganisationBranchPayments, (req, res) => {
  paymentController.getOrganisationBranchPayments(req, res);
});
app.put(metaData.url.approveRejectTransaction, (req, res) => {
  paymentController.approveRejectTransaction(req, res);
});

app.get(metaData.url.getSpecificStudentPaymentDetails, (req, res) => {
  paymentController.getSpecificStudentPaymentDetails(req, res);
});

app.delete(metaData.url.deletePaymentDetails, (req, res) => {
  paymentController.deletePaymentDetails(req, res);
});

// batch

app.post(metaData.url.postBatchDetail, (req, res) => {
  BatchController.postBatchDetail(req, res);
});
app.put(metaData.url.deActivateBatch, (req, res) => {
  BatchController.deActivateBatch(req, res);
});
app.delete(metaData.url.deleteBatchDetail, (req, res) => {
  BatchController.deleteBatchDetails(req, res);
});
app.post(metaData.url.addStudentToBatch, (req, res) => {
  BatchController.addStudentToBatch(req, res);
});
app.post(metaData.url.removeStudentFromBatch, (req, res) => {
  BatchController.removeStudentFromBatch(req, res);
});
app.post(metaData.url.delicateBatch, (req, res) => {
  BatchController.delicateBatch(req, res); //delicate batch
});
app.get(metaData.url.getSpecificBatchOfStudent, (req, res) => {
  BatchController.getSpecificBatchOfStudent(req, res); //delicate batch
});
// student
app.get(metaData.url.getOrganisationStudentDetails, (req, res) => {
  StudentController.getOrganisationStudentDetails(req, res);
});
app.get(metaData.url.getSpecificStudentDetails, (req, res) => {
  StudentController.getSpecificStudentDetail(req, res);
});
app.delete(metaData.url.deleteStudentDetail, (req, res) => {
  StudentController.deleteStudentDetails(req, res);
});
// advertisement
app.post(metaData.url.postAdvertisementDetails, (req, res) => {
  AdvertisementController.postAdvertisementDetails(req, res);
});
app.get(metaData.url.getAdvertisementDetails, (req, res) => {
  AdvertisementController.getAdvertisementDetails(req, res);
});
app.get(metaData.url.getPermission, (req, res) => {
  LoginController.getPermission(req, res);
});

app.put(metaData.url.updateBatchDetails, (req, res) => {
  BatchController.updateBatch(req, res);
});

app.put(metaData.url.updateProfileDetails, (req, res) => {
  ProfileController.updateProfileDetails(req, res);
});

app.post(metaData.url.updateStudentPayment, (req, res) => {
  StudentController.updateStudentPayment(req, res);
});

app.post(metaData.url.enrollCourse, (req, res) => {
  StudentController.enrollNewCourse(req, res);
});

app.get(metaData.url.batchDetails, (req, res) => {
  BatchController.getCourseAndStudent(req, res);
});

app.get(metaData.url.getBatchByQuery, (req, res) => {
  BatchController.getBatchByQuery(req, res);
});

app.post(metaData.url.postExpense, (req, res) => {
  ExpenseController.postExpense(req, res);
});

app.get(metaData.url.postExpense, (req, res) => {
  ExpenseController.getExpense(req, res);
});

app.put(metaData.url.updateExpenseStatus, (req, res) => {
  ExpenseController.updateExpenseStatus(req, res);
});

app.get(metaData.url.unpaidStudent, (req, res) => {
  paymentController.getUnpaidStudent(req, res);
});

app.get(metaData.url.getChartData, (req, res) => {
  ExpenseController.getChartData(req, res);
});

// Assessment
app.post(metaData.url.assessment, upload.single('attachment'), (req, res) => {
  AssessmentController.postAssessment(req, res);
});

app.get(metaData.url.getAssessment, (req, res) => {
  AssessmentController.getAssessment(req, res);
});

app.get(metaData.url.getAssessmentInfo, (req, res) => {
  AssessmentController.getAssessmentInfo(req, res);
});

app.post(metaData.url.getAssessmentInfo, (req, res) => {
  AssessmentController.postAssessmentInfo(req, res);
});

app.delete(metaData.url.getAssessment, (req, res) => {
  AssessmentController.deleteAssessment(req, res);
});

app.get(metaData.url.getStudentAssessment, (req, res) => {
  AssessmentController.getStudentAssessment(req, res)
})

app.put(metaData.url.submitAssessment, (req, res) => {
  AssessmentController.submitAssessment(req, res)
})


app.post(metaData.url.updateBatchModule, (req, res) => {
  BatchController.updateBatchModules(req, res);
});

app.post(metaData.url.batchAttendance, (req, res) => {
  AttendanceController.postBatchStudentAttendance(req, res);
});

app.get(metaData.url.batchAttendance, (req, res) => {
  AttendanceController.GetBatchAttendance(req, res);
});

app.post(metaData.url.event, (req, res) => {
  EventController.postEvent(req, res);
});

app.post(metaData.url.batchEvent, (req, res) => {
  EventController.postBatchEvent(req, res);
});

app.delete(metaData.url.batchEvent, (req, res) => {
  EventController.deleteEvent(req, res);
});

app.put(metaData.url.batchEvent, (req, res) => {
  EventController.updateEvent(req, res);
});

app.get(metaData.url.event, (req, res) => {
  EventController.getEvent(req, res);
});

app.get(metaData.url.taguser, (req, res) => {
  EventController.getTaggedUser(req, res);
});

app.post(metaData.url.schedule, (req, res) => {
  EventController.scheduleInterview(req, res);
});
app.get(metaData.url.getschedule, (req, res) => {
  EventController.getInterviewList(req, res);
});

// Quiz
app.post(metaData.url.addQuiz, (req, res) => {
  QuizContoller.addQuizToBatch(req, res);
});
app.get(metaData.url.getQuiz, (req, res) => {
  QuizContoller.getQuizList(req, res);
});
app.put(metaData.url.submitQuizAssesment, (req, res) => {
  QuizContoller.submitQuiz(req, res);
});

// MAT EXAM
app.post(metaData.url.registerExam, (req, res) => {
  MATExamController.RegisterForExam(req, res);
});
app.post(metaData.url.otpLogin, (req, res) => {
  MATExamController.LoginForExam(req, res);
});
app.post(metaData.url.addMatQuiz, (req, res) => {
  MATExamController.PostMatQuiz(req, res);
});
app.get(metaData.url.getMatQuiz, (req, res) => {
  MATExamController.GetMatQuiz(req, res);
});
app.post(metaData.url.submitQuiz, (req, res) => {
  MATExamController.SubmitQuiz(req, res);
});
app.put(metaData.url.blockuser, (req, res) => {
  MATExamController.BlockUser(req, res);
});

const port = metaData.base.apiPort;
app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});
