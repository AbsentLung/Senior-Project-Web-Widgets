float SoundSense()
{
  float dB = 0.0;
  unsigned long startMillis = millis(); // Start of sample
  unsigned int peakToPeak = 0; // pk-pk level
  unsigned int signalMax = 0;
  unsigned int signalMin = 1024;
  
  // collect data within sample window 
  while (millis() - startMillis < sampleWindow)
  {
    sample = analogRead(sensorPin2);
    if (sample < 1024)
    {
      if (sample > signalMax)
      {
        signalMax = sample;
      }
      else if (sample < signalMin)
      {
        signalMin = sample;
      }
    }
  }
  peakToPeak = signalMax - signalMin;
  double volts = (peakToPeak*3.3) / 1024;
  dB = 20*log10(volts);
  // return reading in units of dB
  return(dB);  
}
