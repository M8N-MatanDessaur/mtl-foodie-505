const axios = require('axios');
const ISO6391 = require('iso-639-1');

function getLanguageName(languageCode) {
  const code = languageCode.split('-')[0]; // get the language part of the code, ignoring the region
  const name = ISO6391.getName(code);
  return name ? name : 'Unknown';
}

exports.handler = async function(event, context) {
  try {
    const language = event.queryStringParameters.language;

    const response = await axios.post("https://api.openai.com/v1/engines/text-davinci-003/completions", 
      {
        prompt: `rewrite "You're in for a culinary adventure! From quick bites at bustling fast food joints to gourmet experiences at upscale establishments, a vast selection of dining delights await to satisfy your every craving!" in ${getLanguageName(language)}. Only return the translated text.`,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const data = response.data;

    if (data && data.choices && data.choices.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ subText: " "+data.choices[0].text.trim() }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ subText: `There's an abundance of food here! There are all kinds of restaurants and snack bars that will make you drool to the point of holding back the drool from your chin!` }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
