export const metaData = {
  base: {
    apiPort: 8000,
    key: "4686acba-e8b4-4348-b125-c2994a1b0cdb",
    expire: 86400,
  },
  userGroup: {
    superAdmin: "super_admin",
    admin: "admin",
    staff: "staff",
    student: "student",
    recruiter: "recruiter",
  },
  url: {
    // user
    getschedule: "/interview",
    schedule: "/interview/:id",
    taguser: "/tagUser",
    event: "/event",
    attendanceRange: "/attendanceRange/:id",
    batchEvent: "/event/:id",
    batchAttendance: "/batch/attendance/:id",
    updateBatchModule: "/update/module/:id",
    assessment: "/assessment",
    getAssessment: "/assessment/:id",
    getAssessmentInfo: "/assessment/info/:id",
    getChartData: "/finance/report",
    unpaidStudent: "/unpaid/student",
    postExpense: "/expense",
    updateExpenseStatus: "/update/expensestatus",
    getBatchByQuery: "/batch",
    batchDetails: "/batchinfo/:batchId",
    getPermission: "/getPermission",
    getUsersOfOrganisationDetails: "/userdetails/:organisationId/:branch",
    deleteUserDetails: "/d/userdetails/:id",
    getSpecificStudentDetails: "/studentdetails/:id",
    postStudentDetails: "/studentdetails",
    postStudentDetail: "/studentdetail",
    postNewCourse: "/enrollcourse/payment",
    updateStudentDetail: "/update/studentdetails/:id",
    getStudentBranchDetails: "/studentdetailsbybranch",
    getCourseDetails: "/coursedetails",
    getCourseAndDouments: "/getcourseanddouments/:organisationId/:branch",
    getSpecificCourseDetails: "/coursedetails/:id",
    postCourseDetails: "/coursedetails",
    postCourseDetail: "/coursedetail",
    getBatchDetails: "/batchdetails",
    postBatchDetails: "/batchdetails",
    updateBatchDetails: "/update/batchdetail/:id",
    postBatchDetail: "/batchdetail",
    getPaymentDetails: "/paymentdetails",
    postPaymentDetails: "/paymentdetails",
    updatePaymentDetails: "/update/paymentdetails/:id",
    updateNewCourseDetails: "/update/newcoursedetails/:id",
    getSpecificPaymentDetails: "/specificPayment/:id",
    getSpecificStudentPaymentDetails: "/specificStudentPayment/:id",
    getReportDetails: "/reportdetails",
    getStaffDetails: "/staffdetails",
    getSpecificStaffDetails: "/specificstaff/:staffId",
    loginDetails: "/login",
    newUserRegistrationDetails: "/register",
    userUpdate: "/userUpdate/:id",
    forgotPassword: "/forgotPassword",
    getSpecificUser: "/register/:id",
    confirmOtp: "/confirmOtp",
    changePassword: "/changePassword/:id",
    resetPassword: "/resetPassword",
    getNotificationDetails: "/notification",
    postNotificationDetail: "/notification",
    deleteNotificationDetail: "/d/notification/:id",
    updateNotificationDetail: "/update/notification/:id",
    getAdminDetails: "/admindetails",
    getSpecificAdminDetails: "/admindetails/:id",
    postAdminDetails: "/admindetails",
    postAdminDetail: "/admindetail",
    updateAdminDetail: "/update/admindetails/:id",
    deleteAdminDetail: "/d/admindetails/:id",
    getCardDetails: "/home/card",
    getBatchCardDetails: "/home/batch",
    getPaymentCardDetails: "/home/payment",
    getChartDetails: "/home/chart",
    getSpecificTeacherDetails: "/specificteacherdetails/:id",
    postBranchDetails: "/addbranch",
    deleteBranchDetail: "/d/branchdetails/:id",
    updateBranchDetail: "/update/branchdetails/:id",
    metaData: "/metadata",
    postApprovalDetails: "/approvaldetails",
    deleteApprovalDetails: "/d/approvaldetails/:id",
    getApprovalDetails: "/getapprovaldetails",
    deleteAdvertisementDetails: "/d/advertisement/:id",
    postAttendanceDetails: "/attendancedetails/:id",
    getcheckindetails: "/attendancedetails/:id",
    getWeeklyDateByQuery: "/getWeeklyDatedetails",
    putcheckindetails: "/update/putattendancedetails/:id",
    getApplyLeave: "/getleavedetails",
    updateApplyLeave: "/update/leavedetails/:id",
    postHolidayDetails: "/postholidaydetails",
    getHolidayDetails: "/getholidaydetails",
    holidayDetails: "/holidaydetails",
    deleteHolidayDetails: "/holidaydetails/:id",
    putHolidayDetails: "/update/holidaydetails/:id",
    getApplyDetails: "/getapplydetails",
    postApplyDetails: "/postapplydetails",
    postLeaveDetails: "/postleavedetails",
    getEmailDetails: "/getemaildetails",
    postEmailDetails: "/postemaildetails",

    // organisation
    newOrganisationRegisteration: "/neworganisationregisteration",
    getSpecificOrganisation: "/organisation",
    // staff
    getOrganisationsStaffs: "/getorganisationsstaffs/:organisationId/:branch",
    postStaffDetails: "/staffdetail",
    deleteStaffDetail: "/d/staffdetail/:id",
    deleteStaffDocumentByDocumentName:
      "/d/deletestaffdocument/:id/:documentName",
    updateStaffDetails: "/update/staffdetails/:id",
    // document
    getSpecificOrganisationFileDetail: "/specificOrganisationFileDetail",
    deleteDocumentAndProfileImg: "/d/deletefiledetail/:uniqueId",
    deleteSpecificDocumentByTypeAndUniqueId:
      "/d/deletefiledetail/:uniqueId/:type",
    uploadFileDetail: "/update/uploadfiledetail",
    updateUploadFileDetail: "/update/updateuploadfiledetail/:id/:type",
    // course
    getSpecificOrganisationCourseDetail:
      "/getspecificorganisationcoursedetail/:organisationId/:branch",
    updateCourseDetail: "/update/coursedetail/:id",
    deleteCourseDetail: "/d/coursedetails/:id",
    updateCompletedStatus: "/update/batchmodule/:batchid",
    // payment
    getMonthwiseRevenueOfOrganisation:
      "/getmonthwiserevenueoforganisation/:organisationId/:branch",
    getOrganisationRevenueDetails:
      "/gettotalrevenueoforganisation/:organisationId",
    getOrganisationBranchPayments:
      "/getorganisationbranchpayments/:organisationId/:branch",
    deletePaymentDetails: "/d/paymentdetails/:id",
    updatePaymentTransactionDetails:
      "/update/paymenttransactiondetails/:organisationId/:branch/:studentId/:courseId",
    approveRejectTransaction:
      "/update/transaction/:paymentScheduleUniqueId/:transactionUniqueId",
    // students
    getStudentDetails: "/studentdetails",
    getOrganisationStudentDetails:
      "/organisation/studentdetails/:organisationId/:branch",
    deleteStudentDetail: "/d/studentdetails/:id/:studentId",
    // batch
    deActivateBatch: "/deactivate/batchdetails/:id",
    deleteBatchDetail: "/d/batchdetails/:id",
    delicateBatch: "/update/batchdetails/delicate/:id",
    addStudentToBatch: "/update/addstudent/batchdetails/:id",
    removeStudentFromBatch: "/update/removestudent/batchdetails/:id",
    getSpecificBatchOfStudent:
      "/batchdetails/:organisationId/:branch/:studentId",
    // user
    getAllUserDetails: "/getalluserdetails/:organisationId/:branch",
    getAllUsersOfOrganisation: "/allusersoforganisation/:organisationId",
    // advertisement
    getAdvertisementDetails: "/getAdvertisementDetails",
    postAdvertisementDetails: "/postAdvertisementDetails",
    updateAdvertisementDetail: "/update/advertisement/:id",
    // leave
    getLeaveDetails: "/leavedetails/:organisationId/:branch",
    postApplyLeave: "/applyleavedetails",
    // branch
    getBranchDetails: "/branchdetails",
    getSpecificBranchDetails: "/branchdetail/:organisationId",
    getSpecificBranchByOrganisationId: "/branchdetails/:id",
    getCredentials: "/credentialdetails",
    reAssign: "/reassign",
    updateProfileDetails: "/update/profileDetails",
    updateStudentPayment: "/update/payment/:id",
    enrollCourse: "/enrollNewCourse",
    // Quiz
    addQuiz: "/add/quiz/assessment",
    getQuiz: "/get/quiz/:id",
    submitQuizAssesment: "/quiz",
    // MAT Exam
    registerExam: "/registermat",
    otpLogin: "/verify",
    addMatQuiz: "/matQuiz",
    getMatQuiz: "/matQuiz",
    submitQuiz: "/submitQuiz",
    blockuser: "/block",
  },

  db: {
    connectionURL:
      "mongodb+srv://crud-operation:crud2020@cluster0.6ojps7e.mongodb.net/",
    // "mongodb+srv://crudoperations:CrudOper@cluster0.ee6aa.mongodb.net/",
    // "mongodb+srv://academy:academy123@academy.3hlakke.mongodb.net/",
    databaseName: "Crud-academy-dev1",
    collectionDetails: {
      interview: "interview_details",
      event: "event_details",
      student: "student_details",
      course: "course_details",
      batch: "batch_details",
      payment: "payment_details",
      staff: "staff_details",
      user: "user_details",
      notification: "notification_details",
      admin: "admin_details",
      otp: "otp_details",
      branch: "branch_details",
      approval: "approval_details",
      metadata: "meta_data",
      document: "document_details",
      advertisement: "advertisement_details",
      attendance: "attendance_details",
      leave: "leave_details",
      holiday: "holiday_details",
      email: "email_details",
      organisation: "organisation_details",
      credential: "credential_details",
      expense: "expense_details",
      assessment: "assessment_details",
      quiz: "quiz_details",
      matExam: "mat_user_details",
      matOtp: "mat_otp_details",
      matQuiz: "mat_quiz_details",
    },
  },
  message: {
    serverError: "Server ecxeption. Please contact administrator!",
    notExist: "Not Exist",
  },
  email: {
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    requireTLS: false,
    fromEmail: "19barathi@gmail.com",
    password: "udcx etwk cxau obub",
    template: {
      otp: `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
      <div style='margin:50px auto;width:70%;padding:20px 0'>
        <div style='border-bottom:1px solid #eee'>
          <a href='' style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>companyName</a>
        </div>
        <p style='font-size:1.1em'>Hi,</p>
        <p>Please use the following OTP to reset your password. OTP is valid for 15 minutes</p>
        <h2 style='background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>$otp</h2>
        <p style='font-size:0.9em;'>Regards,<br />companyName</p>
        <hr style='border:none;border-top:1px solid #eee' />
        <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
          <p>companyName</p>
          <p>India</p>
        </div>
      </div>
    </div>`,
      matOtp: `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
    <div style='margin:50px auto;width:70%;padding:20px 0'> <div style='border-bottom:1px solid #eee'>
    <a href='' style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>CRUD Academy</a>
  </div>
      <p style='font-size:1.1em'>Hi,</p>
      <p>Please use the following OTP to your registration. OTP is valid for 15 minutes</p>
      <h2 style='background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>$otp</h2>
      <p style='font-size:0.9em;'>Regards,<br />CRUD Academy</p>
      <hr style='border:none;border-top:1px solid #eee' />
    </div>
  </div>`,
      newUser: `<div
    style="
      font-family: Helvetica, Arial, sans-serif;
      min-width: 1000px;
      overflow: auto;
      line-height: 2;
    "
  >
    <div style="margin: 50px auto; width: 70%; padding: 20px 0">
      <div style="border-bottom: 1px solid #eee">
        <a
          href=""
          style="
            font-size: 1.4em;
            color: #00466a;
            text-decoration: none;
            font-weight: 600;
          "
          >companyname</a
        >
      </div>
      <p style="font-size: 1.1em">Hi,</p>
      <p>Your user id:$userid</p>
      <p>
        Thank you for joining in companyname. 
        Please use the following temporary password to sign in.
      </p>
      <h2
        style="
          background: #00466a;
          margin: 0 auto;
          width: max-content;
          padding: 0 10px;
          color: #fff;
          border-radius: 4px;
        "
      >
        $pwd
      </h2>
      <p style="font-size: 0.9em">Regards,<br />companyname</p>
      <hr style="border: none; border-top: 1px solid #eee" />
      <div
        style="
          float: right;
          padding: 8px 0;
          color: #aaa;
          font-size: 0.8em;
          line-height: 1;
          font-weight: 300;
        "
      >
        <p>companyname</p>
        <p>India</p>
      </div>
    </div>
  </div>`,
      request: `<div
      style="
        font-family: Helvetica, Arial, sans-serif;
        min-width: 1000px;
        overflow: auto;
        line-height: 2;
      "
    >
      <div style="margin: 50px auto; width: 70%; padding: 20px 0">
        <div style="border-bottom: 1px solid #eee">
          <a
            href=""
            style="
              font-size: 1.4em;
              color: #00466a;
              text-decoration: none;
              font-weight: 600;
            "
            >CRUD Academy</a
          >
        </div>
        <p style="font-size: 1.1em">Hi Admin,</p>
        <p>
          You have received approval request. Please review and respond<h4>$type - $id</h4>
        </p>        
        <p style="font-size: 0.9em">Regards,<br />CRUD Academy</p>
        <hr style="border: none; border-top: 1px solid #eee" />
        <div
          style="
            float: right;
            padding: 8px 0;
            color: #aaa;
            font-size: 0.8em;
            line-height: 1;
            font-weight: 300;
          "
        >
          <p>CRUD Academy</p>
          <p>India</p>
        </div>
      </div>
    </div>`,
      pendingNotification: `<div
    style="
      font-family: Helvetica, Arial, sans-serif;
      min-width: 1000px;
      overflow: auto;
      line-height: 2;
    "
  >
    <div style="margin: 50px auto; width: 70%; padding: 20px 0">
      <div style="border-bottom: 1px solid #eee">
        <a
          href=""
          style="
            font-size: 1.4em;
            color: #00466a;
            text-decoration: none;
            font-weight: 600;
          "
          >CRUD Academy</a
        >
      </div>
      <p style="font-size: 1.1em">Hi,</p>
      <p>
        This is the reminder for your pending amount. Please check and pay<h4>$course</h4>
      </p>
      Pending amount:
      <h3>
          $amt
      </h3>        
      <p style="font-size: 0.9em">Regards,<br />CRUD Academy</p>
      <hr style="border: none; border-top: 1px solid #eee" />
      <div
        style="
          float: right;
          padding: 8px 0;
          color: #aaa;
          font-size: 0.8em;
          line-height: 1;
          font-weight: 300;
        "
      >
        <p>CRUD Academy</p>
        <p>India</p>
      </div>
    </div>
  </div>`,
      leave: `<div
  style="
    font-family: Helvetica, Arial, sans-serif;
    min-width: 1000px;
    overflow: auto;
    line-height: 2;
  "
>
  <div style="margin: 50px auto; width: 70%; padding: 20px 0">
    <div style="border-bottom: 1px solid #eee">
      <a
        href=""
        style="
          font-size: 1.4em;
          color: #00466a;
          text-decoration: none;
          font-weight: 600;
        "
        >companyname</a
      >
    </div>
    <p style="font-size: 1.1em">Hi,</p>
    <p>Requestor id:$userid</p>
    <p>
      Leave - $status
    </p>
    <h2
      style="
        background: #00466a;
        margin: 0 auto;
        width: max-content;
        padding: 0 10px;
        color: #fff;
        border-radius: 4px;
      "
    >
      $date
     </h2>
     <p style="margin: 5px 0; width: 100%; padding: 10px 0">$comment</p>
    <hr style="border: none; border-top: 1px solid #eee" />
    <div
      style="
        float: right;
        padding: 8px 0;
        color: #aaa;
        font-size: 0.8em;
        line-height: 1;
        font-weight: 300;
      "
    >
      <p>companyname</p>
      <p>India</p>
    </div>
  </div>
</div>`,
    },
  },
  responseType: {
    Success: "Success",
    Failed: "Failed",
  },
  info: {
    courseDetails: {
      whatYouWillLearn: [
        "Over 3 hours of quality video content teach you the best coding technique",
        "Basics to advanced",
        "Lifetime access for course videos",
      ],
      span: "3 months",
    },
  },
};
