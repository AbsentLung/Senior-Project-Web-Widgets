// Respiratory Rate Sensor code
float temp = 0.0;
float ambient_Temp = 0.0;
int BreathsPerMinute = 0;

int RespRateSense() {
  BreathsPerMinute = 0; // reset BreathsPerMinute
  for ( int i = 0; i < 59;  i++){
    int reading = analogRead(sensorPin2);
    float voltage = reading*5.0;
    voltage /= 1024.0;
    ambient_Temp = (voltage - 0.5) * 100;
    delay(1000);
    reading = analogRead(sensorPin2);
    
    voltage = reading*5.0;
    voltage /= 1024.0;
    temp = (voltage - 0.5) * 100;
    if( temp > ambient_Temp){
      BreathsPerMinute++;
    } 
  }
  //Serial.print("Respiratory Rate: ");
  //Serial.println(BreathsPerMinute); 
  return BreathsPerMinute;
}
