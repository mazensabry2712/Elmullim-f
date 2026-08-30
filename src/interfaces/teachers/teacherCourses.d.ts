export interface ICreateCourse {
  title: string;
  description: string;
  price: number;
  image: File | null;
  sub_category_id: string;
  level: string;
}

export interface IUpdateCourse extends ICreateCourse {
  id: number;
  image?: File | null;
}

export interface IDeleteCourseLecture {
  token: string;
  id: string;
  courseId: string;
  contentId: string;
}

export interface IUploadCourseVideo {
  lectureId: string;
  courseId: string;
  contentId: string;
  video: File;
}
