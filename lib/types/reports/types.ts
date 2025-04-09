export type EvaluatedRanking = {
  order: number;
  position: string;
  name: string;
  quantitative_result: number;
  qualitative_result: string;
  is_observed: string;
  observed_comments: string;
};

export type ResultBySkill = {
  order: number;
  name: string;
  average: number;
  comments: string;
  results: Record<string, number>;
};

export type IndividualReport = {
  user: {
    id: number;
    name: string;
    lastname: string;
    role: string;
    document_type?: string;
    document_number?: string;
    phone?: string;
    email?: string;
    is_active: number;
    organization_id: number | null;
    is_active_label: string;
    document_type_label: string;
    role_label: string;
  };
  position: {
    id: number;
    hierarchical_level: {
      id: number;
      name: string;
    };
    hierarchical_level_id: number;
    name: string;
    from: string;
    to: string;
    status: number;
    user_id: number;
    organization_id: number;
    status_label: string;
    organization: {
      id: number;
      name: string;
    };
  };
  result: {
    average: number;
    average_code: string;
    average_text: string;
    comments: string;
    by_skills?: Record<string, any>;
    by_behaviors?: Record<
      string,
      {
        text: string;
        is_present: boolean;
      }[]
    >;
  };
};

export type PdiReport = {
  user: {
    id: 0;
    name: string;
    lastname: string;
    role: string;
    document_type: string;
    document_number: string;
    phone?: string;
    email: string;
    is_active: number;
    organization_id?: number;
    is_active_label: string;
    document_type_label: string;
    role_label: string;
  };
  position: {
    id: number;
    hierarchical_level_id: number;
    name: string;
    from: string;
    to: string;
    status: number;
    user_id: number;
    organization_id?: number;
    status_label: string;
    organization?: {
      id: number;
      name: string;
    };
    hierarchical_level: {
      id: number;
      name: string;
    };
  };
  result: {
    average: number;
    average_text: string;
    average_code: string;
    comments: string;
    by_skills?: Record<string, any>;
    skill_actions?: Record<string, any>;
  };
};
