/*
 Basic MQTT example 
 
  - connects to an MQTT server
  - publishes "hello world" to the topic "outTopic"
  - subscribes to the topic "inTopic"
*/

// Update these with values suitable for your network.
/* if AWS was working......
byte mac[]    = { 0x12, 0x42, 0x98, 0x85, 0x49, 0x3A };
char server[] = "ec2-52-1-29-117.compute-1.amazonaws.com";
IPAddress ip(172, 31, 51, 13);
*/
//byte mac[]    = {0x90, 0xA2, 0xDA, 0x0D, 0x54, 0xCE};
byte mac[]    = {0x52, 0x54, 0x00, 0xEA, 0xBF, 0xE9};
char server[] = "sleepstdy.cs.unh.edu";
IPAddress ip(192, 168, 122, 57);

void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
}

EthernetClient ethClient;
PubSubClient client(server, 1883, callback, ethClient);

void ClientSetup() {
  // Open serial communications and wait for port to open:
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  Serial.print("ClientSetup() started");
  
  // start the Ethernet connection:
 if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip);
  }

  if (client.connect(server)) {
    Serial.print("Data sent/n");
    client.publish("hello/world", "hi");
    client.subscribe("hiWorld");
    
    // write sensor data
  }
  else {
    Serial.print("could not connect with MQTT client");
  }
}

void ClientConnect()
{
  client.loop();
}

