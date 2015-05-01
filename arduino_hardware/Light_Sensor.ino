int LightSense()
{
  uint32_t lum = tsl.getFullLuminosity();
  uint16_t ir, full;
  ir = lum >> 16;
  full = lum & 0xFFFF;
  uint16_t Lux = tsl.calculateLux(full, ir);
  return(Lux); 
}
