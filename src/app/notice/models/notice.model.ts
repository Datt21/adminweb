export interface Notice {
  id: number;
  startTime: string;
  endTime: string;
  userDomain: number;
  displayPlace: number;
  title: string;
  notificationType: string;
  status: number;
  isPublic: number;
  createdAt: string;
  updatedAt: string;
  state: number;
  switch_public_value?: boolean;
}
