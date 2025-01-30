import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TEMPLATE = `enact: 1.0.0
id: "HelloWorldCapability"
description: "A simple hello world example"
version: "1.0.0"
type: "atomic"
authors:
  - name: "Example Author"

inputs:
  name:
    type: "string"
    description: "Name to greet"
    default: "World"

tasks:
  - id: sayHello
    type: "script"
    language: "python"
    code: |
      name = inputs.get('name', 'World')
      print(f"Hello, {name}!")

flow:
  steps:
    - task: sayHello

outputs:
  type: "object"
  properties:
    message:
      type: "string"`;

const TaskTemplate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111828] text-white">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Enact Protocol Template</h1>
            <Button 
              onClick={() => navigate("/add-task")}
              className="bg-enact-accent hover:bg-enact-accent/90 text-white"
            >
              Back to Add Task
            </Button>
          </div>
          
          <div className="bg-[#1a1f2c] rounded-lg p-6">
            <Tabs defaultValue="structured" className="space-y-4">
              <TabsList className="bg-[#1a1f2c]">
                <TabsTrigger 
                  value="structured" 
                  className="data-[state=active]:bg-enact-accent data-[state=active]:text-white text-gray-300"
                >
                  Structured View
                </TabsTrigger>
                <TabsTrigger 
                  value="raw" 
                  className="data-[state=active]:bg-enact-accent data-[state=active]:text-white text-gray-300"
                >
                  Raw YAML
                </TabsTrigger>
              </TabsList>

              <TabsContent value="structured">
                <Card className="bg-[#1a2234] border-gray-700">
                  <CardHeader className="pb-5">
                    <div className="flex items-start gap-2">
                      <Icon icon="lucide:file-text" className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-xl text-white">Hello World</CardTitle>
                        <CardDescription className="mt-1 text-gray-300 -ml-6">A simple hello world example</CardDescription>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="border-gray-600 text-gray-300 -ml-7">ENACT v1.0.0</Badge>
                          <Badge variant="secondary" className="bg-gray-700 text-gray-200">atomic</Badge>
                          <Badge variant="secondary" className="bg-gray-700 text-gray-200">Example Author</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Inputs Section */}
                      <div>
                        <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                          <Icon icon="mdi:input" className="w-4 h-4 text-gray-400" />
                          Inputs
                        </h3>
                        <div className="space-y-2">
                          <div className="bg-[#1f2937] rounded-md p-2">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">name</span>
                                  <Badge variant="outline" className="border-gray-600 text-gray-300">string</Badge>
                                </div>
                                <p className="text-sm text-gray-300">Name to greet</p>
                                <p className="text-sm text-gray-400">Default: World</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tasks Section */}
                      <div>
                        <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                          <Icon icon="lucide:code" className="w-4 h-4 text-gray-400" />
                          Tasks
                        </h3>
                        <div className="space-y-2">
                          <div className="bg-[#1f2937] rounded-md p-2">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">sayHello</span>
                                  <Badge variant="outline" className="border-gray-600 text-gray-300">python</Badge>
                                </div>
                                <pre className="mt-2 p-2 bg-[#111828] rounded text-sm text-gray-300 overflow-x-auto">
                                  <code>{`name = inputs.get('name', 'World')
print(f"Hello, {name}!")`}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flow Section */}
                      <div>
                        <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                          <Icon icon="lucide:git-branch" className="w-4 h-4 text-gray-400" />
                          Flow
                        </h3>
                        <div className="space-y-2">
                          <div className="bg-[#1f2937] rounded-md p-2">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">1</span>
                              <Icon icon="lucide:arrow-right" className="w-4 h-4 text-gray-400" />
                              <span className="text-white">sayHello</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Outputs Section */}
                      <div>
                        <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                          <Icon icon="mdi:output" className="w-4 h-4 text-gray-400" />
                          Outputs
                        </h3>
                        <div className="space-y-2">
                          <div className="bg-[#1f2937] rounded-md p-2">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">message</span>
                                  <Badge variant="outline" className="border-gray-600 text-gray-300">string</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="raw">
                <Card className="bg-[#1a2234] border-gray-700">
                  <CardContent className="pt-6">
                    <pre className="bg-[#1f2937] p-4 rounded-md overflow-x-auto">
                      <code className="text-gray-300">{TEMPLATE}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTemplate;