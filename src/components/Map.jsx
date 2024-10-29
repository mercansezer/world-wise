import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import Button from "./Button";
import { useGeolocation } from "../hooks/useGeolocation";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams(); // url'deki query stringi okumamızı sağlar. setSearchParams({lat:52,lng:55}); bu fonksiyon useStateteki setState fonksiyonu gibi. Update işlemi yapmamızı sağlar.
  const [position, setPosition] = useState([
    38.727881642324164, -9.140900099907554,
  ]);

  const {
    isLoading: isLoadingGeo,
    position: positionGeo,
    error,
    getPosition,
  } = useGeolocation();

  const { cities } = useCities();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  //const navigate = useNavigate(); //react-router tarafından bize sağlanan bir hook. bu hook bir fonksiyon döndürür navigate diye aldık bu fonksiyonu ve aşağıda dive tıkladığında kullanıcı bir event handler ile bu fonksiyonu çağırıcaz ve bu fonksiyona girdiğimiz değer url'ye gönderilecek.

  //********************************************** */
  //********************************************** */
  //********************************************** */
  //********************************************** */
  //INCLUDEING A MAP WITH THE LEAFLET LIBRARY
  // Bu mapi bir 3rd part library sayesinde kullanacağız öncelikle terminalden bu 3rd party libraryi indiriyoruz.
  //npm i react-leaflet leaflet --> bunu yazıp kurulum yapmamız gerekiyor.
  //leaflet docs okuyup yönlendirmeler aldım okuyarak ilerledim. gerekli olan birkaç eklentiyi ekstra yapmam gerekti css linki gibi bunları docsden aldım ve kullandım.
  useEffect(
    function () {
      if (mapLat && mapLng) setPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (positionGeo.lat) {
        setPosition([positionGeo.lat, positionGeo.lng]);
      }
    },
    [positionGeo.lat, positionGeo.lng]
  );

  return (
    <div className={styles.mapContainer}>
      {!positionGeo.lat && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeo ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={true} //burası false iken maose ile scroll yapamıyordum true yaparak bunu sağladım.
        className={styles.map} //biz ekledik bunu aksi takdirde height vermediğimizde haritayı göremiyoruz.
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" //bu kısımı değiştererek harita görünümü sağaladım yani değiştirdim hoca böyle beğeniyor diye bu görüntüyü kullandık eskisinde fr yerinde başka bir şey vardı hot yoktu
        />

        {cities.map((city) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
                {/* haritadaki markerın (işaretleyici) üstünde tıkladığımızda gördüğümüz yazıdır. */}
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

//haritada kayma işlemi için bu library bu şekilde bizim kendimiz isim verip oluşturduğumuz ve içinde useMap kullandığımız bir componente ihtiyaç duyar.
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
export default Map;
