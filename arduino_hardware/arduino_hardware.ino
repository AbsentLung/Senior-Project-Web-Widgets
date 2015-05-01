// Yashen Sleep Monitoring Firmware
// Revision 1.0
// Authors: Max Tibbetts and Kieffer Quitayen

// Setup Program
//***************************************************************
#include <math.h>
#include <Wire.h>
#include "TSL2561.h"
#include <SPI.h>
#include <SD.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <Servo.h>
//#include <Firmata.h>

//  VARIABLES
int pulsePin = 3;                 // Pulse Sensor purple wire connected to analog pin 0
int blinkPin = 13;                // pin to blink led at each beat
int fadePin = 5;                  // pin to do fancy classy fading blink at each beat
int fadeRate = 0;                 // used to fade LED on with PWM on fadePin
const int chipSelect = 4;         // On the Ethernet Shield, CS is pin 4
                      // the hardware CS pin (10 on most Arduino boards, 53 on the Mega)

// these variables are volatile because they are used during the interrupt service routine!
volatile int BPM;      // used to hold the pulse rate
                       // Normal resting heart rate for adults = 60 to 100 beats a minute
volatile int Signal;                // holds the incoming raw data
volatile int IBI = 600;             // holds the time between beats, must be seeded! 
volatile boolean Pulse = false;     // true when pulse wave is high, false when it's low
volatile boolean QS = false;        // becomes true when Arduoino finds a beat.

int sensorPin0 = 0; // Analog Pin A0 for Temperature
int sensorPin1 = 1; // Analog Pin A1 for Sound Level
int sensorPin2 = 2; // Analog Pin A2 for Respiratory Rate
const int sampleWindow = 50; // 50 mS sample window
unsigned int sample;

TSL2561 tsl(TSL2561_ADDR_FLOAT);
String dataString;
float TemperatureC, TemperatureF;  // Room temperature is about 20 to 26° Celsius (68 to 78.9° Fahrenheit)
float SoundLevel; // Average residence, normal private office noise = 40 dB
uint16_t LightLevel; // Office lighting = 320–500 lux
int RespiratoryRate; // Normal adult respiration rate at rest = 12-20 breaths per minute
              // Normal adult resting heart rate = 60 to 100 bpm

void setup()
{
  // Open serial communications
  Serial.begin(115200); // begin debug serial connection
  //SDCardSetup(); // initializes SD card
  //ClientSetup(); // initializes web client to server connection
  //StandardFirmataSetup(); // initializes standard firmata for Plotly graphing of data
  InterruptSetup(); // initializes interrupt for pulse-sensor
  
  if(tsl.begin()) // checks for lux sensor
  {
    //Serial.println("Found lux sensor");
  }
  else
  {
    Serial.println("Could not find lux sensor");
    while (1);
  }
  // You can change the gain on the fly, to adapt to brighter/dimmer light situations
  //tsl.setGain(TSL2561_GAIN_0X);         // set no gain (for bright situtations)
  tsl.setGain(TSL2561_GAIN_16X);      // set 16x gain (for dim situations)
  
  // Changing the integration time gives you a longer time over which to sense light
  // longer timelines are slower, but are good in very low light situtations!
  tsl.setTiming(TSL2561_INTEGRATIONTIME_13MS);  // shortest integration time (bright light)
  //tsl.setTiming(TSL2561_INTEGRATIONTIME_101MS);  // medium integration time (medium light)
  //tsl.setTiming(TSL2561_INTEGRATIONTIME_402MS);  // longest integration time (dim light)
  
}

//***************************************************************
// Main Program Loop
//***************************************************************
void loop()
{
  // read in environmental and biological sensor data
  TemperatureC = TempSenseC();  // obtain temperature (C)
  TemperatureF = TempSenseF();  // obtain temperature (F)
  LightLevel = LightSense();  // obtain light level (lux)
  SoundLevel = SoundSense();  // obtain sound level (Db)
  RespiratoryRate = RespRateSense(); // obtain respiratory rate (breath/min)
  
  // write sensor data to datalogger file
  //WriteToFile();
  // connect to web server and send datalog file
  //ClientConnect();
  //StandardFirmataLoop();
  
  // make a string for assembling the data to log:
  dataString = getSensorData(); //(TemperatureC, TemperatureF, LightLevel, SoundLevel, RespiratoryRate);  
  Serial.println(dataString);
  //printSensorData();
  
  // delay before next loop iteration
  delay(5000);
}

