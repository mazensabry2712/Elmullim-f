export interface ICreateLecture {
  title: string;
  description: string;
  contentId: string;
  lessonId?: string;
  courseId?: string;
}

export interface IUpdateLecture extends ICreateLecture {
  id: string;
}
