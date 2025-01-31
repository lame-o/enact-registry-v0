import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Icon } from "@iconify/react";
import { useTaskStore } from "@/store/taskStore";
import { toast } from "sonner";
import { parse } from 'yaml';
import { Task, ProtocolDetails } from "@/types/protocol";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  teams: z.string().min(1, "Teams are required"),
  authorName: z.string().min(1, "Author name is required"),
  authorEmail: z.string().email("Invalid email").optional(),
  authorOrg: z.string().optional(),
  inputName: z.string().min(1, "Input name is required"),
  inputType: z.string().min(1, "Input type is required"),
  inputDescription: z.string().min(1, "Input description is required"),
  inputDefault: z.string().optional(),
  taskId: z.string().min(1, "Task ID is required"),
  taskType: z.string().min(1, "Task type is required"),
  taskLanguage: z.string().min(1, "Task language is required"),
  taskDescription: z.string().min(1, "Task description is required"),
  outputType: z.string().min(1, "Output type is required"),
  outputName: z.string().min(1, "Output name is required"),
  outputDescription: z.string().min(1, "Output description is required"),
});

const AddTask = () => {
  const navigate = useNavigate();
  const addTask = useTaskStore((state) => state.addTask);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      teams: "",
      authorName: "",
      authorEmail: "",
      authorOrg: "",
      inputName: "",
      inputType: "string",
      inputDescription: "",
      inputDefault: "",
      taskId: "",
      taskType: "script",
      taskLanguage: "python",
      taskDescription: "",
      outputType: "object",
      outputName: "",
      outputDescription: "",
    },
  });

  const handleYamlUpload = async (content: string) => {
    try {
      const yamlContent = parse(content);
      
      // Validate the YAML structure
      if (!yamlContent.enact || !yamlContent.id) {
        throw new Error('Invalid YAML: Missing required fields (enact, id)');
      }

      // Map YAML to our Task structure
      const taskData: Task = {
        id: 0, // This will be set by the backend
        name: yamlContent.id,
        description: yamlContent.description || "",
        version: yamlContent.version || "1.0.0",
        teams: [], // This can be set manually
        isAtomic: yamlContent.type === "atomic",
        protocolDetails: {
          enactVersion: yamlContent.enact,
          id: yamlContent.id,
          name: yamlContent.id,
          description: yamlContent.description || "",
          version: yamlContent.version || "1.0.0",
          authors: yamlContent.authors || [],
          inputs: yamlContent.inputs || {},
          tasks: (yamlContent.tasks || []).map(task => ({
            id: task.id,
            type: task.type,
            language: task.language,
            code: task.code,
            description: task.description
          })),
          flow: {
            steps: (yamlContent.flow?.steps || []).map(step => ({
              task: step.task,
              dependencies: step.dependencies
            }))
          },
          outputs: {
            type: yamlContent.outputs?.type || "object",
            properties: yamlContent.outputs?.properties || {}
          }
        }
      };

      // Set form values
      form.setValue('name', taskData.name);
      form.setValue('description', taskData.description);
      form.setValue('version', taskData.version);
      form.setValue('teams', taskData.teams);
      form.setValue('isAtomic', taskData.isAtomic);
      form.setValue('protocolDetails', taskData.protocolDetails);

      // Set individual form fields for the form UI
      if (taskData.protocolDetails.authors?.[0]) {
        form.setValue('authorName', taskData.protocolDetails.authors[0].name);
        form.setValue('authorEmail', taskData.protocolDetails.authors[0].email || '');
        form.setValue('authorOrg', taskData.protocolDetails.authors[0].organization || '');
      }

      // Set first input if exists
      const firstInputKey = Object.keys(taskData.protocolDetails.inputs)[0];
      if (firstInputKey) {
        const firstInput = taskData.protocolDetails.inputs[firstInputKey];
        form.setValue('inputName', firstInputKey);
        form.setValue('inputType', firstInput.type);
        form.setValue('inputDescription', firstInput.description);
        form.setValue('inputDefault', firstInput.default);
      }

      // Set first task if exists
      if (taskData.protocolDetails.tasks?.[0]) {
        const firstTask = taskData.protocolDetails.tasks[0];
        form.setValue('taskId', firstTask.id);
        form.setValue('taskType', firstTask.type);
        form.setValue('taskLanguage', firstTask.language || '');
        form.setValue('taskDescription', firstTask.description || '');
        form.setValue('taskCode', firstTask.code || '');
      }

      // Set first output if exists
      const firstOutputKey = Object.keys(taskData.protocolDetails.outputs.properties)[0];
      if (firstOutputKey) {
        const firstOutput = taskData.protocolDetails.outputs.properties[firstOutputKey];
        form.setValue('outputName', firstOutputKey);
        form.setValue('outputType', firstOutput.type);
        form.setValue('outputDescription', firstOutput.description || '');
      }

      toast.success('YAML loaded successfully');
    } catch (error) {
      console.error('Error parsing YAML:', error);
      toast.error('Failed to parse YAML file. Please check the format.');
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newTask = {
      name: values.name,
      description: values.description,
      version: "1.0.0",
      teams: values.teams.split(",").map(t => t.trim()),
      isAtomic: true,
      protocolDetails: {
        enactVersion: "1.0.0",
        id: values.taskId,
        name: values.name,
        description: values.description,
        version: "1.0.0",
        authors: [
          {
            name: values.authorName,
            email: values.authorEmail,
            organization: values.authorOrg
          }
        ],
        inputs: {
          [values.inputName]: {
            type: values.inputType,
            description: values.inputDescription,
            default: values.inputDefault || undefined,
            required: !values.inputDefault
          }
        },
        tasks: [
          {
            id: values.taskId,
            type: values.taskType,
            language: values.taskLanguage,
            description: values.taskDescription
          }
        ],
        flow: {
          steps: [
            { task: values.taskId }
          ]
        },
        outputs: {
          type: values.outputType,
          properties: {
            [values.outputName]: {
              type: values.outputType,
              description: values.outputDescription
            }
          }
        }
      }
    };

    addTask(newTask);
    toast.success("Task created successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#111828] text-white">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/globe-bit.png" alt="Enact Globe" className="h-10 w-auto rotate-180" />
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-white">Add Task</h1>
                <button 
                  onClick={() => navigate("/task-template")}
                  className="flex items-center gap-1 text-sm text-gray-300 hover:text-white group"
                >
                  <span className="border-b border-gray-600 group-hover:border-white">Template</span>
                  <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.yaml,.yml';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const content = e.target?.result as string;
                        handleYamlUpload(content);
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-md backdrop-blur-sm border border-white/20 shadow-lg transition-all"
              >
                <Icon icon="lucide:upload" className="w-4 h-4 mr-2" />
                Upload YAML
              </Button>
              <Button 
                onClick={() => navigate("/")}
                className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-md backdrop-blur-sm border border-white/20 shadow-lg transition-all"
              >
                <Icon icon="lucide:arrow-left" className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-[#1a1f2c] rounded-lg p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information Card */}
                  <Card className="bg-[#1a1f2c] border-white/20">
                    <Collapsible>
                      <CardHeader className="pb-2">
                        <CollapsibleTrigger className="flex justify-between items-center w-full">
                          <CardTitle className="text-white flex items-center gap-2">
                            <img src="/bubble-bit.webp" alt="Bubble" className="h-5 w-5" />
                            Basic Information
                          </CardTitle>
                          <Icon icon="lucide:chevron-down" className="w-5 h-5 text-gray-400" />
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Task Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter task name" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter task description" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="teams"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Teams</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter teams" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="authorName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Author Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter author name" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="authorEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Author Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter author email" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="authorOrg"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Author Organization</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter author organization" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Input Configuration Card */}
                  <Card className="bg-[#1a1f2c] border-white/20">
                    <Collapsible>
                      <CardHeader className="pb-2">
                        <CollapsibleTrigger className="flex justify-between items-center w-full">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Icon icon="mdi:input" className="h-5 w-5" />
                            Input Configuration
                          </CardTitle>
                          <Icon icon="lucide:chevron-down" className="w-5 h-5 text-gray-400" />
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="inputName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Input Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., name" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="inputType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Type</FormLabel>
                                <FormControl>
                                  <Input placeholder='e.g., "string"' {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="inputDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Description</FormLabel>
                                <FormControl>
                                  <Input placeholder='e.g., "Name to greet"' {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="inputDefault"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Default Value</FormLabel>
                                <FormControl>
                                  <Input placeholder='e.g., "World"' {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Task Configuration Card */}
                  <Card className="bg-[#1a1f2c] border-white/20">
                    <Collapsible>
                      <CardHeader className="pb-2">
                        <CollapsibleTrigger className="flex justify-between items-center w-full">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Icon icon="lucide:code" className="h-5 w-5" />
                            Task Configuration
                          </CardTitle>
                          <Icon icon="lucide:chevron-down" className="w-5 h-5 text-gray-400" />
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="taskId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Task ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., sayHello" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="taskType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Task Type</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., script" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="taskLanguage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Task Language</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., python" {...field} className="bg-[#2a2e3e] text-white border-white/20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="taskDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Task Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder={`e.g.,\nname = inputs.get('name', 'World')\nprint(f"Hello, {name}!")`}
                                    className="font-mono min-h-[200px] bg-[#2a2e3e] text-white border-white/20"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Output Configuration Card */}
                  <Card className="bg-[#1a1f2c] border-white/20">
                    <Collapsible>
                      <CardHeader className="pb-2">
                        <CollapsibleTrigger className="flex justify-between items-center w-full">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Icon icon="mdi:output" className="h-5 w-5" />
                            Output Configuration
                          </CardTitle>
                          <Icon icon="lucide:chevron-down" className="w-5 h-5 text-gray-400" />
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="outputType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Output Type</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder='e.g., "object"' 
                                    {...field} 
                                    className="bg-[#2a2e3e] text-white border-white/20" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="outputName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Output Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder='e.g., "greeting"' 
                                    {...field} 
                                    className="bg-[#2a2e3e] text-white border-white/20" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="outputDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Output Description</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder='e.g., "The greeting message"' 
                                    {...field} 
                                    className="bg-[#2a2e3e] text-white border-white/20" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-md backdrop-blur-sm border border-white/20 shadow-lg transition-all"
                    >
                      Create Task
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
