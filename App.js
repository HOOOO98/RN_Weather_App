import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location'
import { View, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13"

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city);
    const { list } = await (
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
    ).json();
    const filteredList = list.filter(({ dt_txt }) => dt_txt.endsWith("00:00:00"));
    setDays(filteredList);
  };

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.dateYM}>
          {(days[0].dt_txt).substring(0, 4) + '년' + (days[0].dt_txt).substring(5, 7) + '월'}
        </Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator="false"
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }} />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index}>
              <View style={styles.dateD}>
                <Text style={{ fontSize: 30 }}>
                  {(day.dt_txt).substring(8, 10) + '일'}
                </Text>
              </View>
              <View style={styles.day}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp - 273.15).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                />
                <Text style={styles.description}>
                  {day.weather[0].main}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: 'bold'
  },
  dateYM: {
    marginTop: 20,
    fontSize: 20,
  },
  dateD: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 110,
    fontWeight: 700
  },
  description: {
    marginTop: -10,
    fontSize: 30,
  },
})

