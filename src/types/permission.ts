export interface PermissionType {
  children: PermissionType[] | null;
  code: string;
  icon: string;
  name: string;
  type: number;
  url: string;
}
