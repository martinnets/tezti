export type AdminUser = {
  id: number;
  name: string;
  lastname: string;
  role: string;
  document_type: string;
  document_number: string;
  phone?: string;
  email: string;
  is_active: boolean;
  organization_id?: number;
  is_active_label: string;
  document_type_label: string;
  role_label: string;
};

export type Role = {
  id: string;
  name: string;
};
