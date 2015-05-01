float TempSenseC()
{
  // read from analog pin 1
  float reading = analogRead(sensorPin1); 
  float voltage = reading * 5.0;
  voltage /= 1024.0;
  float temperatureC = (voltage - 0.5) * 100;
  return(temperatureC);  
}

float TempSenseF()
{
  float temperatureF = TempSenseC() * (9.0/5.0) + 32.0;
  return(temperatureF);  
}
