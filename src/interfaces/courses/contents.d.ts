export interface IContent {
  id: number;
  title: string;
  description: string;
}

export interface IContentRes {
  status: boolean;
  message: null | string;
  data: IContent[];
}

export interface IContentsRes {
  status: boolean;
  message: null | string;
  data: IContent[];
}

export interface ICreateCourseContent {
  courseId: string;
  title: string;
  description: string;
}
export interface ICreateLessonContent {
  lessonId: string;
  title: string;
  description: string;
}

export interface IUpdateCourseContent extends ICreateCourseContent {
  id: string;
}
export interface IUpdateLessonContent extends ICreateLessonContent {
  id: string;
}
