export interface ICourseDetails {

}

interface ITopics {
    topic: string;
    description: string;
}

interface IModules {
    moduleName: string;
    description: string;
    topics: ITopics[];
}
export interface IPostCourseDetails {
    courseName: string;
    description: string;
    actualPrice: number;
    offeredPrice: number;
    modules: IModules[]
}