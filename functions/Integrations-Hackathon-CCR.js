/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
var request = require("request-promise");

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const dateOptions = {
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric',
  hour12: false,
  calendar: 'gregory',
  timeZone: 'America/Sao_Paulo'
};

const locale = 'pt-BR';

async function main(params) {


  if (params.type === "jh-api") {
    /*
     * Use of the 'Johns Hopkins CSSE' resource
     */
    try {
      const summary = await request({
        method: "GET",
        uri: "https://api.covid19api.com/summary",
        json: true
      });

      if (params.country) {
        for (var i = 0; i < summary.Countries.length; i++) {
          if (
            summary.Countries[i].Country.toLowerCase() ===
            params.country.toLowerCase()
          ) {

            const data = {
              NewConfirmed: new Intl.NumberFormat(locale).format(summary.Countries[i].NewConfirmed),
              TotalConfirmed: new Intl.NumberFormat(locale).format(summary.Countries[i].TotalConfirmed),
              NewDeaths: new Intl.NumberFormat(locale).format(summary.Countries[i].NewDeaths),
              TotalDeaths: new Intl.NumberFormat(locale).format(summary.Countries[i].TotalDeaths),
              NewRecovered: new Intl.NumberFormat(locale).format(summary.Countries[i].NewRecovered),
              TotalRecovered: new Intl.NumberFormat(locale).format(summary.Countries[i].TotalRecovered),
              Date: new Intl.DateTimeFormat(locale, dateOptions).format(new Date(summary.Countries[i].Date))
            };
            return {
              result: data
            };
          }
        }
        return { error: `Não consegui encontrar o país informado: ${params.country}` };
      }

      let NewConfirmed = 0;
      let TotalConfirmed = 0;
      let NewDeaths = 0;
      let TotalDeaths = 0;
      let NewRecovered = 0;
      let TotalRecovered = 0;
      let DateUpdate = new Date(Date.UTC(2019, 11, 20, 0, 0, 0));

      for (var i = 0; i < summary.Countries.length; i++) {
        NewConfirmed += summary.Countries[i].NewConfirmed;
        TotalConfirmed += summary.Countries[i].TotalConfirmed;
        NewDeaths += summary.Countries[i].NewDeaths;
        TotalDeaths += summary.Countries[i].TotalDeaths;
        NewRecovered += summary.Countries[i].NewRecovered;
        TotalRecovered += summary.Countries[i].TotalRecovered;
        if (summary.Countries[i].Date && new Date(summary.Countries[i].Date).getTime() > DateUpdate.getTime()) {
          DateUpdate = new Date(summary.Countries[i].Date);
        }
      }

      const data = {
        NewConfirmed: new Intl.NumberFormat(locale).format(NewConfirmed),
        TotalConfirmed: new Intl.NumberFormat(locale).format(TotalConfirmed),
        NewDeaths: new Intl.NumberFormat(locale).format(NewDeaths),
        TotalDeaths: new Intl.NumberFormat(locale).format(TotalDeaths),
        NewRecovered: new Intl.NumberFormat(locale).format(NewRecovered),
        TotalRecovered: new Intl.NumberFormat(locale).format(TotalRecovered),
        Date: new Intl.DateTimeFormat(locale, dateOptions).format(DateUpdate)
      };

      return {
        result: data
      };
    } catch (err) {
      return { error: "Ops! Desculpe, mas não consegui consultar os números atualizados" };
    }
  } else if (params.type === "weather") {
    if (params.latitude && params.longitude) {
      try {
        const response = await request({
          method: "GET",
          uri: `http://api.openweathermap.org/data/2.5/weather?lat=${params.latitude}&lon=${params.longitude}&appid=${params.weatherAPI}&lang=pt_br&units=metric`,
          json: true
        });
        return {
          result: response
        };
      } catch (err) {
        return { error: "Ops! Desculpe, mas não consegui a previsão do tempo para a localização enviada" };
      }
    } else {
      return { error: "Preciso que você me envie sua localização ou a localização de um município para consultar a previsão do tempo" };
    }
  } else if (params.type === "discovery") {
  } else {
    return { error: "Tipo inválido!" };
  }
}