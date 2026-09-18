export interface ICreateLecture {
  title: string;
  description: string;
  contentId: string;
  courseId: string;
}

export interface IUpdateLecture extends ICreateLecture {
  id: string;
}
