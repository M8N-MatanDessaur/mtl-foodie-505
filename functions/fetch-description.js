const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const restaurantName = event.queryStringParameters.name;

    const response = await axios.post("https://api.openai.com/v1/engines/text-davinci-002/completions", 
      {
        prompt: `Créez une anecdote drole et amusante pour dans un restaurant nommé "${restaurantName}" en quebecois sans trop décrire le restaurant ou les plats.`,
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`,
        },
      }
    );

    const data = response.data;

    if (data && data.choices && data.choices.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ description: " "+data.choices[0].text.trim() }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ description: `Asteur écoute icitte, j'ai des spots de bouffe qui vont t'en faire glousser dans ton p'tit bedon! T'as l'estomac qui crie pour une poutine à te faire baver dans ton hoodie? Pas d'soucis, mon chum! Y'a des places pour ça, j'te dis! Pis si t'es plutôt d'humeur pour du smoked meat tendre à te faire fondre l'coeur, y'a des endroits pour ça aussi, crissement! Et pour ceux qui aiment les fruits de mer, y'a un coin qui va te faire décoller le palais, osti! J'te dis pas où, mais ça vaut la peine d'explorer! Ah, pis pour les amateurs de burgers, y'a un spot qui va te faire saliver comme un loup affamé! J'te laisse découvrir par toi-même, mon pote! Faque là, mon chum, prends ton hoodie, ton sens de l'humour et vas-y découvrir ces spots où tu risques de baver et de rire en même temps!` }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};