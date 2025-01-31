import { useState, useMemo } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/store/taskStore";
import type { Task } from "@/types/protocol";
import { Icon } from "@iconify/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <Card className="mb-4 bg-[#1a2234] border-gray-700">
      <Collapsible>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-2">
            <Icon icon="lucide:file-text" className="w-5 h-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-xl text-white">
                  {task.name}
                </CardTitle>
                <CollapsibleTrigger className="p-1 hover:bg-white/10 rounded-md transition-colors">
                  <Icon icon="lucide:chevron-down" className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                </CollapsibleTrigger>
              </div>
              <CardDescription className="mt-1 text-gray-300 -ml-6">{task.description}</CardDescription>
              <div className="flex items-center gap-2 mt-3 -ml-7">
                <Badge variant="secondary" className="bg-gray-700/90 text-gray-200 font-medium border border-gray-600/50 shadow-sm">ENACT v{task.version}</Badge>
                {task.isAtomic && (
                  <Badge variant="secondary" className="bg-purple-900/60 text-purple-200 border border-purple-500/30">atomic</Badge>
                )}
                {task.teams.map((team) => (
                  <Badge key={team} variant="outline" className="border-white/20 text-gray-300 backdrop-blur-sm">@{team}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CollapsibleContent className="space-y-6">
            <div className="h-px bg-gray-300 mt-4" />
            {/* Inputs Section */}
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Icon icon="mdi:input" className="w-4 h-4 text-gray-400" />
                Inputs
              </h3>
              <div className="space-y-2">
                {Object.entries(task.protocolDetails.inputs).map(([key, input]) => (
                  <div key={key} className="bg-[#1f2937] rounded-md p-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{key}</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 rounded border-0 px-2 py-0.5 text-xs font-medium">{input.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-300">{input.description}</p>
                        {input.default && (
                          <p className="text-sm text-gray-400">Default: {input.default}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Icon icon="lucide:code" className="w-4 h-4 text-gray-400" />
                Tasks
              </h3>
              <div className="space-y-2">
                {task.protocolDetails.tasks.map((t) => (
                  <div key={t.id} className="bg-[#1f2937] rounded-md p-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{t.id}</span>
                          {t.language && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 rounded border-0 px-2 py-0.5 text-xs font-medium">{t.language}</Badge>
                          )}
                        </div>
                        {t.description && (
                          <p className="text-sm text-gray-300">{t.description}</p>
                        )}
                        {t.code && (
                          <pre className="mt-2 p-2 bg-[#111828] rounded text-sm text-gray-300 overflow-x-auto">
                            <code>{t.code}</code>
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flow Section */}
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Icon icon="lucide:git-branch" className="w-4 h-4 text-gray-400" />
                Flow
              </h3>
              <div className="space-y-2">
                {task.protocolDetails.flow.steps.map((step, index) => (
                  <div key={index} className="bg-[#1f2937] rounded-md p-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/50 text-gray-300 text-sm border border-gray-600/30">{index + 1}</span>
                      <Icon icon="lucide:arrow-right" className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{step.task}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outputs Section */}
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Icon icon="mdi:output" className="w-4 h-4 text-gray-400" />
                Outputs
              </h3>
              <div className="space-y-2">
                {Object.entries(task.protocolDetails.outputs.properties).map(([key, output]) => (
                  <div key={key} className="bg-[#1f2937] rounded-md p-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{key}</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 rounded border-0 px-2 py-0.5 text-xs font-medium">{output.type}</Badge>
                        </div>
                        {output.description && (
                          <p className="text-sm text-gray-300">{output.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const tasks = useTaskStore((state) => state.tasks);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    
    const query = searchQuery.toLowerCase().trim();
    return tasks.filter((task) => {
      const nameMatch = task.name.toLowerCase().includes(query);
      const idMatch = task.protocolDetails.id.toLowerCase().includes(query);
      const descriptionMatch = task.description.toLowerCase().includes(query);
      return nameMatch || idMatch || descriptionMatch;
    });
  }, [tasks, searchQuery]);

  return (
    <div className="min-h-screen bg-[#111828] text-white">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/globe-bit.png" alt="Enact Globe" className="h-10 w-auto rotate-180" />
              <h1 className="text-4xl font-bold text-white">Enact Registry</h1>
            </div>
            <Button 
              onClick={() => navigate("/add-task")}
              className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-md backdrop-blur-sm border border-white/20 shadow-lg transition-all"
            >
              <Icon icon="lucide:plus" className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="mb-6">
            <SearchBar 
              placeholder="Search by name, ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1f2c] border-gray-700 text-white placeholder-gray-400 focus:border-enact-accent focus:ring-0"
            />
          </div>

          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No tasks found matching "{searchQuery}"
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
