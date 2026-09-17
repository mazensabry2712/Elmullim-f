export interface ILessonContent {
  id: number;
  title: string;
  description: string;
}

export interface ILessonContentRes {
  status: boolean;
  message: null | string;
  data: ILessonContent[];
}

export interface ILessonContentsRes {
  status: boolean;
  message: null | string;
  data: ILessonContent[];
}

export interface ICreateLessonContent {
  lessonId: string;
  title: string;
  description: string;
}

export interface IUpdateLessonContent extends ICreateLessonContent {
  id: string;
}
