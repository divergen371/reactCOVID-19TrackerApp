import "./App.css";
import TopPage from "./pages/TopPage";
import countriesJson from "./country.json";
import WorldPage from "./pages/WorldPage";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("japan");
  const [error, setError] = useState(false);
  const [countryData, setCountryData] = useState({
    date: "",
    newConfirmed: "",
    totalConfirmed: "",
    newRecovered: "",
    totalRecovered: "",
  });
  const [allCountriesData, setAllCountriesData] = useState([]);
  useEffect(() => {
    const getCountryData = () => {
      setLoading(true);
      axios
        .get(`https://api.covid19api.com/country/${country}`)
        .then((res) => {
          setCountryData({
            date: res.data[res.data.length - 1].Date,
            newConfirmed:
              res.data[res.data.length - 1].Confirmed -
              res.data[res.data.length - 2].Confirmed,
            totalConfirmed: res.data[res.data.length - 1].Confirmed,
            newRecovered:
              res.data[res.data.length - 1].Recovered -
              res.data[res.data.length - 2].Recovered,
            totalRecovered: res.data[res.data.length - 1].Recovered,
          });
          setLoading(false);
        })
        .catch((err) =>
          alert("An error has occurred. Please reload the page and try again.")
        );
    };
    getCountryData();
  }, [country]);
  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then((res) => setAllCountriesData(res.data.Countries))
      .catch((err) =>
        alert("An error has occurred. Please reload the page and try again.")
      );
  }, [country]);
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <TopPage
            countriesJson={countriesJson}
            setCountry={setCountry}
            countryData={countryData}
            loading={loading}
          />
        </Route>
        <Route exact path="/world">
          <WorldPage allCountriesData={allCountriesData} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
