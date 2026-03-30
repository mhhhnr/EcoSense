# EcoSense
EcoSense is a web-based platform that monitors real-time air quality across locations worldwide. It leverages predictive models to forecast future air conditions, helping users stay informed and make environmentally conscious decisions.
## Inspiration
More people die because of air pollution rather than AIDS, Malaria combined, yet it is invisible. Most of the people donot know what air they are breathing. I wanted to build something that anyone from anywhere can access on any device such as mobile phones, laptopes and tablets. For this i built EcoSense that make you feel check air quality as important as checking wheather before making plans.

## What it does
It is Real time **AI-powered Intelligence Platform** that gives you enhanced picture of the air you are breathing anywhere in thw world.

## How we built it
We built it using three focused libraries named as: 
- **Leaflet.js** for World map feature in our website
- **Chart.js** for the forecast and trends visualisation pattern
- **Open-Meteo** Air Quality API For real Time air pollutant data
- **OpenStreetMap** for city search and reverse geocoding

The AQI scoring used in the website, uses a multiagent pollutant model that is normalized against WHO thresholds.
## Challenges we ran into
Following are some of the major challenges I ran into while building this web based software:
- **Globe Hoveron Map** Making every point on the map, interactive i-e when user hover anywhere on map, it shows the air quality and its major components on that specified point. For this i used geocoding and reverse geocoding.

- **Live Data** Showing the live Air Quality Data with 280ms on average and careful async of data between all the tabs.

## Accomplishments that we're proud of
- A truly globally interactive air quality website where hovering over New York city returns Air Quality data as easy as hovering over the ocean off the coast Japan.
- A system that feels like made truly for layman and really adaptable rather than only understandable to professionals.
- Health advisories that adapt according to the Air Quality.
## What we learned
Building this project taught me alot of things, from learning the minimum difference of timezone can change whole perspective to how real time data can be converted into really helpful source for others.
## What's next for EcoSense
- **Push Alerts:** Notify users when air quality index passes the threshold.
- ** Personalized Health Sections:** Users enter their health conditions (such as Asthma, heart disease etc) and our health advisories advices them according to their condition.
- **Mobile App:** Mobile integrated app of this website.
