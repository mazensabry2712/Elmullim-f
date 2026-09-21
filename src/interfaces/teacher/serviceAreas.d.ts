export interface IServiceArea {
  id: number;
  teacher_id?: number;
  name: string;
  latitude: string | number;
  longitude: string | number;
  radius_km: string | number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IServiceAreaInput {
  name: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  is_active?: boolean;
}

export interface IServiceAreasRes {
  status: boolean;
  message: string | null;
  data: IServiceArea[];
}

export interface IServiceAreaRes {
  status: boolean;
  message: string | null;
  data: IServiceArea;
}

export interface IServiceAreaListItem {
  id: number;
  name: string;
  radius_km: string | number;
  is_active?: boolean;
}
