const axios = require('axios');

exports.handler = async function(event, context) {
    const { latitude, longitude, radius, type, key } = event.queryStringParameters;

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${key}`;

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
