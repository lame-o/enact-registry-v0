import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '@/types/protocol';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
}

// Initial tasks
const weatherTask: Task = {
  id: 1,
  name: "Get Weather Data Task",
  description: "Fetches weather data for a specified location.",
  version: "1.0.0",
  teams: ["Liam"],
  isAtomic: true,
  protocolDetails: {
    enactVersion: "1.0.0",
    id: "GetWeatherCapability",
    name: "Get Weather Data",
    description: "Fetches weather data for a specified location.",
    version: "1.0.0",
    authors: [
      {
        name: "Liam"
      }
    ],
    inputs: {
      location: {
        type: "string",
        description: "Location to fetch weather for",
        default: "New York"
      },
      api_key: {
        type: "string",
        description: "API key for weather service",
        default: "your_api_key_here"
      }
    },
    tasks: [
      {
        id: "getWeather",
        type: "script",
        language: "python",
        code: `import requests
def get_weather(location, api_key):
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={location}"
    response = requests.get(url)
    data = response.json()
    return {
        "temperature": data["current"]["temp_c"],
        "conditions": data["current"]["condition"]["text"]
    }
result = get_weather(inputs.get('location'), inputs.get('api_key'))
print(result)`
      }
    ],
    flow: {
      steps: [
        { task: "getWeather" }
      ]
    },
    outputs: {
      type: "object",
      properties: {
        temperature: {
          type: "float"
        },
        conditions: {
          type: "string"
        }
      }
    }
  }
};

const tweetTask: Task = {
  id: 2,
  name: "Create a Tweet",
  description: "Posts a tweet to Twitter.",
  version: "1.0.0",
  teams: ["Keerthi"],
  isAtomic: true,
  protocolDetails: {
    enactVersion: "1.0.0",
    id: "CreateTweetCapability",
    name: "Create a Tweet",
    description: "Posts a tweet to Twitter.",
    version: "1.0.0",
    authors: [
      {
        name: "Keerthi"
      }
    ],
    inputs: {
      content: {
        type: "string",
        description: "Text of the tweet",
        default: "Hello, Twitter!"
      },
      api_key: {
        type: "string",
        description: "Twitter API key",
        default: "your_api_key_here"
      },
      api_secret: {
        type: "string",
        description: "Twitter API secret",
        default: "your_api_secret_here"
      }
    },
    tasks: [
      {
        id: "createTweet",
        type: "script",
        language: "python",
        code: `import tweepy
def create_tweet(content, api_key, api_secret):
    auth = tweepy.OAuth1UserHandler(api_key, api_secret)
    api = tweepy.API(auth)
    tweet = api.update_status(content)
    return {"tweet_id": tweet.id_str}
result = create_tweet(inputs.get('content'), inputs.get('api_key'), inputs.get('api_secret'))
print(result)`
      }
    ],
    flow: {
      steps: [
        { task: "createTweet" }
      ]
    },
    outputs: {
      type: "object",
      properties: {
        tweet_id: {
          type: "string"
        }
      }
    }
  }
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [weatherTask, tweetTask],
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, { ...task, id: state.tasks.length + 1 }] 
      })),
    }),
    {
      name: 'task-store',
    }
  )
);
