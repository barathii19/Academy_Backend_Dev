export interface IAssessmentPayload {
    totalMark: String
    title: string
    batch: any
    startTime: String
    endTime: String
    attachment: Object
    description: String
    module: any
}

export interface ISubmitAssessment {
    assessmentId: any
    studentId: any
    githubLink: String
    mark: Number
    remarks: String
    status: String
}