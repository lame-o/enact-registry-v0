import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Author {
  name: string;
}

interface Input {
  type: string;
  description: string;
  default?: string;
}

interface Task {
  id: string;
  type: string;
  language: string;
  code: string;
}

interface Flow {
  steps: {
    task: string;
  }[];
}

interface Output {
  type: string;
  properties: {
    [key: string]: {
      type: string;
    };
  };
}

interface TaskCardProps {
  name: string;
  description: string;
  version: string;
  teams: string[];
  isAtomic: boolean;
  protocolDetails?: {
    enactVersion: string;
    id: string;
    authors: Author[];
    inputs: { [key: string]: Input };
    tasks: Task[];
    flow: Flow;
    outputs: Output;
  };
}

export const TaskCard = ({ 
  name, 
  description, 
  version, 
  teams, 
  isAtomic,
  protocolDetails 
}: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={cn(
        "bg-enact-muted rounded-lg p-6 transition-all duration-200",
        "hover:bg-opacity-80 cursor-pointer border border-transparent",
        "hover:border-enact-accent/20"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-enact-text">{name}</h3>
            <span className="px-2 py-1 text-xs rounded bg-enact-accent/20 text-enact-accent">
              v{version}
            </span>
            {isAtomic && (
              <span className="px-2 py-1 text-xs rounded bg-purple-500/20 text-purple-400">
                atomic
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
          <div className="flex gap-2">
            {teams.map((team) => (
              <span
                key={team}
                className="px-2 py-1 text-xs rounded bg-enact-accent/10 text-enact-accent/80"
              >
                {team}
              </span>
            ))}
          </div>
        </div>
        <button className="text-gray-400 hover:text-enact-accent transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && protocolDetails && (
        <div className="mt-6 space-y-6 border-t border-enact-accent/10 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-enact-text">Protocol Details</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Enact Version: <span className="text-enact-accent">{protocolDetails.enactVersion}</span></p>
                <p>Protocol ID: <span className="text-enact-accent">{protocolDetails.id}</span></p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-enact-text">Authors</h4>
              <ul className="space-y-1">
                {protocolDetails.authors.map((author, idx) => (
                  <li key={idx} className="text-sm text-gray-400">{author.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-enact-text flex items-center gap-2">
              <span className="i-lucide-input text-enact-accent" />
              Inputs
            </h4>
            <div className="space-y-3">
              {Object.entries(protocolDetails.inputs).map(([key, input]) => (
                <div key={key} className="bg-enact-bg/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-enact-accent">{key}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-enact-accent/10 text-enact-accent">
                      {input.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{input.description}</p>
                  {input.default && (
                    <p className="text-sm text-gray-400">
                      Default: <span className="text-enact-accent">{input.default}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-enact-text flex items-center gap-2">
              <span className="i-lucide-code text-enact-accent" />
              Tasks
            </h4>
            <div className="space-y-3">
              {protocolDetails.tasks.map((task) => (
                <div key={task.id} className="bg-enact-bg/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-enact-accent">{task.id}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-enact-accent/10 text-enact-accent">
                      {task.language}
                    </span>
                  </div>
                  <pre className="mt-3 p-4 bg-enact-bg rounded-lg text-xs text-gray-400 overflow-x-auto">
                    <code>{task.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-enact-text flex items-center gap-2">
              <span className="i-lucide-git-branch text-enact-accent" />
              Flow
            </h4>
            <div className="bg-enact-bg/50 p-4 rounded-lg">
              <div className="space-y-2">
                {protocolDetails.flow.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-enact-accent/10 text-enact-accent text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-400">{step.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-enact-text flex items-center gap-2">
              <span className="i-lucide-box text-enact-accent" />
              Outputs
            </h4>
            <div className="bg-enact-bg/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-3">Type: <span className="text-enact-accent">{protocolDetails.outputs.type}</span></p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-enact-text">Properties:</p>
                {Object.entries(protocolDetails.outputs.properties).map(([key, prop]) => (
                  <div key={key} className="flex items-center gap-2 pl-4">
                    <span className="text-sm text-enact-accent">{key}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-enact-accent/10 text-enact-accent">
                      {prop.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};