const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const restaurantName = event.queryStringParameters.name;

    const preferredLanguage = getPreferredLanguageFromHeader(event.headers['Accept-Language']);

    const prompt = `Imagine a funny joke or pun that takes place in a restaurant named "${restaurantName}" in ${preferredLanguage}.`;

    const response = await axios.post("https://api.openai.com/v1/engines/text-davinci-003/completions", 
      {
        prompt,
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
        body: JSON.stringify({ description: data.choices[0].text.trim() }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ description: `I'm sorry, I couldn't generate a joke for the restaurant "${restaurantName}".` }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};

function getPreferredLanguageFromHeader(acceptLanguageHeader) {
  return acceptLanguageHeader.split(',')[0];
}
