void SDCardSetup()
{
  // Open serial communications and wait for port to open:
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  
  Serial.print("Initializing SD card...");
  // make sure that the default chip select pin is set to
  // output, even if you don't use it:
  pinMode(10, OUTPUT);

  // see if the card is present and can be initialized:
  if (!SD.begin(chipSelect)) {
    Serial.println("Card failed, or not present");
    // don't do anything more:
    return;
  }
  Serial.println("card initialized.");
}

void WriteToFile()
{
  // open the file. note that only one file can be open at a time,
  // so you have to close this one before opening another.
  File dataFile = SD.open("datalog.txt", FILE_WRITE);

  // if the file is available, write to it:
  if (dataFile) {
    String dataString = getSensorData();
    dataFile.println(dataString);
    dataFile.close();
    // print to the serial port too:
    Serial.println(dataString);
  }
  // if the file isn't open, pop up an error:
  else {
    Serial.println("error opening datalog.txt");
  }
}

String getSensorData()
{
  // make a string for assembling the data to log:
  String dataString = "";  
  // Store temp data
  dataString += "Temperature is ";
  dataString += String(TemperatureC);
  dataString += " C (";
  dataString += String(TemperatureF);
  dataString += " F)\n";
  // Store lux data
  dataString += "Light level is ";
  dataString += String(LightLevel);
  dataString += " lux\n";
  // Store sound data
  dataString += "Noise level is ";
  dataString += String(SoundLevel);
  dataString += " dB\n";  
  // Store BPM data
  dataString += "Heart Rate is ";
  dataString += String(BPM);
  dataString += " bpm\n";
  // Store respiratory data
  dataString += "RespiratoryRate is ";
  dataString += String(RespiratoryRate);
  dataString += " breaths/min\n";
  return dataString;
}

void printSensorData()
{
  String s = getSensorData();
  Serial.println(s);
}

