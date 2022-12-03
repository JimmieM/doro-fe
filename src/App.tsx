import { FC, useEffect } from "react";
import "./App.css";
import { HomePage } from "./components/pages/home.page";
import { useCurrentPosition } from "./hooks/state/current-position.hook";
import { useTraffic } from "./hooks/state/traffic.hook";

function App() {
  return <AuthorizedContext />;
}

const AuthorizedContext: FC = () => {
  const { getByLatLng } = useTraffic();
  const { position, setPosition, setCity } = useCurrentPosition();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition((position) => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [setPosition]);

  useEffect(() => {
    if (!position) return;

    getByLatLng(position?.lat, position?.lng).then((trafficResult) => {
      if (!trafficResult) return;
      setCity(trafficResult.city);
    });
  }, [getByLatLng, position, setCity]);

  return <HomePage />;
};

export default App;
