const fetch = require('node-fetch');

const { AUTH_TOKEN } = process.env;

exports.handler = function(event, context, callback) {

  // return fetch(`https://api.football-data.org/v2/competitions/2021/matches`,
  return fetch(`https://api.football-data.org/v2/competitions/PL/matches`, 
    {headers : {'X-Auth-Token': AUTH_TOKEN, 'Access-Control-Allow-Origin': '*' } } )
      .then(response => response.json())
      .then(response => {
        return callback(null, {
          statusCode: 200,
          body: response.body
        });
      })
      .catch(error => {
        return callback(null, {
          statusCode: error.status,
          body: error.body
        });
      });
}
