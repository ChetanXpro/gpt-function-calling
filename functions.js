import axios from "axios";
export const getLocationLatituteAndLongitude = async (location) => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi",
      params: { address: location },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "address-from-to-latitude-longitude.p.rapidapi.com",
      },
    });
    console.log(response.data.Results[0]);
    return response.data.Results[0];
  } catch (error) {
    console.error(error);
  }
};

export const getWeather = async (Latitude, Longitude) => {
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/current.json",
    params: { q: `${Latitude},${Longitude}` },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
