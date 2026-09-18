export interface IServiceArea {
  id: number;
  teacher_id: number;
  area_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IServiceAreasResponse {
  status: boolean;
  message: string | null;
  data: IServiceArea[];
}
