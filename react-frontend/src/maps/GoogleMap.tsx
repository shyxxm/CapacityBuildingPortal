import React from "react";
import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function Intro() {
  const locations = [
    { lat: 28.7041, lng: 77.1025, label: "Delhi" },
    { lat: 9.0949, lng: 76.4896, label: "Amritapuri" },
    { lat: 8.5241, lng: 76.9366, label: "Trv" },
    { lat: 28.4089, lng: 77.3178, label: "Faridabad" },

  ];
  const [infoWindowProps, setInfoWindowProps] = useState(null);

  const handleMarkerClick = (location, index) => {
    setInfoWindowProps({ position: location, index });
  };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "40vh", width: "100%" }}>
        <Map zoom={9} center={locations[0]} mapId={process.env.REACT_APP_MAP_ID}>
          {locations.map((location, index) => (
            <AdvancedMarker
              key={index}
              position={location}
              onClick={() => handleMarkerClick(location, index)}
            >
              <Pin
                background={"grey"}
                borderColor={"green"}
                glyphColor={"purple"}
              />
            </AdvancedMarker>
          ))}

          {infoWindowProps && (
            <InfoWindow
              position={infoWindowProps.position}
              onCloseClick={() => setInfoWindowProps(null)}
            >
              <p>{locations[infoWindowProps.index].label}</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
