export interface IAssessmentPayload {
    totalMark: number
    title: string
    batch: string
    date: string
    "timings": {
        "from": string,
        "to": string,
        "totalHours": number
    }
}