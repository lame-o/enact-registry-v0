export type Author = {
  name: string;
};

export type InputConfig = {
  type: string;
  description: string;
  default?: any;
};

export type TaskDefinition = {
  id: string;
  type: string;
  language?: string;
  code?: string;
  description?: string;
};

export type FlowStep = {
  task: string;
  dependencies?: string[];
};

export type ProtocolDetails = {
  enactVersion: string;
  id: string;
  name: string;
  description: string;
  version: string;
  authors: Author[];
  inputs: Record<string, InputConfig>;
  tasks: TaskDefinition[];
  flow: {
    steps: FlowStep[];
  };
  outputs: {
    type: string;
    properties: Record<string, { type: string; description?: string }>;
  };
};

export type Task = {
  id: number;
  name: string;
  description: string;
  version: string;
  teams: string[];
  isAtomic: boolean;
  protocolDetails: ProtocolDetails;
};
