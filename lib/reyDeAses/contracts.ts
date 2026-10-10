export type StartRequest = {
  landing_id: string;
  landing_slug: string;
  name: string;
  device_id: string;
  atrio_client_id: string;
  advisor_id: string;
  advisor_slug: string;
  promo_code: string;
  attribution?: Record<string, string>;
};

export type AssignedAdvisor = {
  atrioClientId: string;
  advisorId: string;
  advisorSlug: string;
};

export type ResolvedPlayer = {
  advisor_id: string;
  advisor_slug: string;
  player_id: string;
  created: boolean;
};

export type Api2ResolveAccountRequest = {
  external_user_id: string;
  name: string;
  advisor_id: string;
};

export type ReyAccount = {
  username: string;
  password: string;
  platform: "rey_de_ases";
  created: boolean;
};

export type HandoffResult = {
  handoff_url: string;
  expires_at: string;
  binding_created: boolean;
};
