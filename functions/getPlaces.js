const axios = require('axios');

exports.handler = async function(event, context) {
    const { latitude, longitude, radius, type, key } = event.queryStringParameters;
    const types = "restaurant|cafe|bar|bakery|bistro|buffet|diner|food_court|pizza|ice_cream|fast_food|fine_dining|breakfast|brunch|lunch|dinner|pub|taco|steakhouse|sushi|bbq|vegetarian|food_truck|haitian|creole|indian|chinese|italian|mexican|greek|thai|seafood|burger|dessert|ramen|french|spanish|mediterranean|korean|vietnamese|american|german|middle_eastern|caribbean|peruvian|brazilian|ethiopian|vegan|gluten_free|japanese"; 


    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${types}&opennow&key=${key}`;

    try {
        const { data } = await axios.get(url);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from Google Places API' }),
        };
    }
};
