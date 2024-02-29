export interface IUpdateProfileDetails {
    firstName: String,
    lastName: String,
    dob: String,
    email: String,
    mobileNumber: String,
    address: String,
    city: String,
    state: String,
    educationInfo: [{
        schoolOrCollege: String,
        classOrDegree: String,
        location: String,
        percentage: String,
        year: String
    }],
    experienceInfo: [{
        companyOrInstitute: String,
        Designation: String,
        location: String,
        year: String
    }]

}