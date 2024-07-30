/*


Exam Programming Practice Question

Make min temperature and max temperaturre range in color from very very blue at -60 to very 
very red at 60. 

Add horizontal buttons at the time to limit the view to the day of interest 

If the total rain is more than a certain threshold for consecutive days,
show a rain warning box for the user. 



Exam Theory Practice Questions

If your componenets requires data X from Promise returning service A. X is then used
to get Y from Promise returning service B. Both X and Y are passed on to service C, 
which returns an observable. They are used to find Z and latch it in RAM for display
in HTML. Write the code. 

    myZ: any;
    //C depends on B and A, and B depends on A 
    A().then((X)=>{
        B(X).then((Y)={
            // I have both X and Y 
            C(X,Y).subscribe((Z)=>{
                this.myZ = Z;
            })
        })
    });
    {{myZ}}


We get our location from the navigator service. We  use this location to get the address and the weather. 

A().then((X)=>{
    B(X).then((Y)=>{
        this.myY = Y; 
    })
    C(X).then((Z)=>{
        this.myZ = Z; 
    });
});
*/

import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from '../../data/WeatherData';
import { MCardComponent } from "../../m-framework/components/m-card/m-card.component";
import { MWeatherComponent } from "../../m-framework/components/m-weather/m-weather.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MContainerComponent,
    MCardComponent,
    MWeatherComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  address: string;
  lat: number; // Latitude 
  lng: number; // Longitude
  weatherList: WeatherData[];
  constructor(public httpClient: HttpClient){
    this.address = "";
    this.lat = 0; 
    this.lng = 0; 
    this.weatherList = [];
  }
  // design a javascript function that will take the date as a string in this format YYYY-MM-DD and return
  // the day of the week in full name 
  getAddressFromGPS(lat:number, lng: number){
    this.httpClient
    .get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyAvdbNyMkWpcMBKRwghEShYjD4lFFKKo68')
    .subscribe((data:any)=>{
      this.address = data.results[0].formatted_address;
    });
    
  }
  getDayFromDate(date: string){
    return new Date(date).toLocaleDateString('en-Us',{weekday: 'long'});
  }
  getImageFromRain(weatherDay: any){
    if(weatherDay.precipitation < 1)
      return 'https://t4.ftcdn.net/jpg/01/00/34/13/360_F_100341373_Pq7QzOJOLAvZaJysSYYbeZ9uqEIQV7bk.jpg';
    else 
      return 'https://thumb.photo-ac.com/4a/4a4cc2e8a59a1c3efba7942697858d96_t.jpeg';
  }
  getLocationWeather(){
    navigator.geolocation.getCurrentPosition((locationData)=>{
      this.getWeatherData(locationData.coords.latitude, locationData.coords.longitude);
      this.getAddressFromGPS(locationData.coords.latitude, locationData.coords.longitude);
    })
  }
  getNYCWeather(){
    this.getWeatherData(40.7484, -73.9857);
    this.getAddressFromGPS(40.7484, -73.9857);
  }
  getWeatherData(lat:number, lng: number){
    this.httpClient
    .get("https://my.meteoblue.com/packages/basic-day?apikey=PGHRiq1IYubvtFMN&lat="+lat+"&lon="+lng+"&asl=6&format=json")
    .subscribe((data: any)=>{
      this.weatherList.splice(0,this.weatherList.length);
      for(let i = 0 ; i < 7; i++)
      {
        let todaysWeather = {
          time:                 data.data_day.time[i],
          precipitation:        data.data_day.precipitation[i],
          temperatureMax:       data.data_day.temperature_max[i],
          temperatureMin:       data.data_day.temperature_min[i],
          windDirection:        data.data_day.winddirection[i],
          windspeedMean:        data.data_day.windspeed_mean[i],
          rainSpot:             data.data_day.rainspot[i],
          relativeHumidityMean: data.data_day.relativehumidity_mean[i],
        }
        let weatherDay = new WeatherData(todaysWeather);
        this.weatherList.push(weatherDay);

      }
     
    });
  }
}
