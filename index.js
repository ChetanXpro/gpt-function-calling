import { OpenAIApi, Configuration } from "openai";
import dotenv from "dotenv";
import { getLocationLatituteAndLongitude, getWeather } from "./functions.js";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const functionDescriptions = [
  {
    name: "getLocationLatituteAndLongitude",
    description: "get the Latitude and Longitude for a given location",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "The name of the location",
        },
      },
      required: ["address"],
    },
    //   example: "Get the Latitude and Longitude of paris",
  },
  {
    name: "getWeather",
    description:
      "Fetches the weather conditions of a given latitude and longitude",
    parameters: {
      type: "object",
      properties: {
        latitude: {
          type: "string",
          description: "latitude of a location",
        },
        longitude: {
          type: "string",
          description: "longitude of a location",
        },
      },
      required: ["latitude", "longitude"],
    },
    // example: "Get the weather conditions of paris",
  },
];

const functionCalls = async (response) => {
  console.log(
    "Function To call",
    response.data.choices[0].message.function_call.name
  );
  try {
    if (
      response.data.choices[0].message.function_call.name ===
      "getLocationLatituteAndLongitude"
    ) {
      const resp = await getLocationLatituteAndLongitude(
        JSON.parse(response.data.choices[0].message.function_call.arguments)
          .address
      );

      return resp;
    } else if (
      response.data.choices[0].message.function_call.name === "getWeather"
    ) {
      const resp = await getWeather(
        JSON.parse(response.data.choices[0].message.function_call.arguments)
          .latitude,
        JSON.parse(response.data.choices[0].message.function_call.arguments)
          .longitude
      );
      return resp;
    }
  } catch (error) {
    console.log("Error from functioncalls\n", error);
  }
};

const askfunctionCall = async (query) => {
  try {
    const messages = [{ role: "user", content: query }];

    console.log("Initial Messages\n================\n", messages);
    let response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages,
      //   functionCall: "auto",
      functions: functionDescriptions,
    });

    console.log(response.data.choices[0].message);

    while (response.data.choices[0].finish_reason === "function_call") {
      const resp = await functionCalls(response);
      messages.push({
        role: "function",
        name: response.data.choices[0].message.function_call.name,
        content: JSON.stringify(resp),
      });

      response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages,
        functions: functionDescriptions,
      });

      console.log(response.data.choices[0].message);
    }

    if (response.data.choices[0].finish_reason !== "function_call") {
      console.log(
        "Final Response \n==============\n",
        response.data.choices[0].message.content
      );
    }
  } catch (error) {
    console.log("Error from askFunctioncall\n", error);
  }
};

askfunctionCall("What are the weather conditions in muzaffarnagar?");
