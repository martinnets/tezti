export type Creator = {
  id: number;
  name: string;
};

export type HierarchicalLevel = {
  id: number;
  name: string;
};

export type Process = {
  id: number;
  hierarchical_level_id: number;
  name: string;
  from: string;
  to: string;
  status: number;
  user_id: number;
  organization_id?: number;
  progress: number;
  status_label: string;
  organization?: string;
  hierarchical_level: HierarchicalLevel;
  creator: Creator;
  additionals?: number[];
  type: string;
  type_label?: string;
};

export type Status = {
  id: number;
  name: string;
};

export type Type = {
  id: string;
  name: string;
};

export type Additional = {
  id: number;
  name: string;
};

export type Skill = {
  id: number;
  name: string;
  description?: string;
  disabled?: boolean;
};

type ProcessIndicatorColorItem =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "destructive"
  | "dark-blue"
  | "default"
  | "white"
  | "dark";

export type ProcessIndicatorItem = {
  id: number;
  name: string;
  count: string;
  icon: React.ReactNode;
  color?: ProcessIndicatorColorItem;
  iconBgClasses?: string;
};

export type Evaluated = {
  id: number;
  user_id: number;
  name: string;
  lastname: string;
  email: string;
  current: number;
  total: number;
  status: number;
  status_label: string;
  deadline_at?: string;
  deadline_color?: string;
  user: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    document_number: string;
    document_type: string;
    is_active: number;
    is_active_label: string;
    document_type_label: string;
  };
  result?: number;
  progress?: number;
  position?: {
    id: number;
    name: string;
    hierarchical_level_id: number;
    status: number;
    status_label: string;
    hierarchical_level: {
      id: number;
      name: string;
    };
  };
  additionals?: {
    id: number;
    value: string;
    name?: string;
  }[];
  evaluations?: {
    percentage: string;
    result: number;
    skill: string;
    status: number;
  }[];
};
