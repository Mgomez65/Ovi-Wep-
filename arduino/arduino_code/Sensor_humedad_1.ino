#include <LiquidCrystal.h>

// Configuración de pines para el LCD Keypad Shield
LiquidCrystal lcd(8, 9, 4, 5, 6, 7);

// Pin donde se conecta el sensor HW-80 (A1 en tu caso)
const int sensorPin = A1;

// Variables para temporización
unsigned long lastTime = 0;
unsigned long samplingInterval = 10000;  // 10 segundos

void setup() {
  lcd.begin(16, 2);
  lcd.print("Iniciando...");

  pinMode(sensorPin, INPUT);
  Serial.begin(9600);  // Iniciar la comunicación serial
}

void loop() {
  if (millis() - lastTime >= samplingInterval) {
    lastTime = millis();

    // Leer el valor del sensor
    int sensorValue = analogRead(sensorPin);

    // Ajustar el rango de los valores leídos al rango de 0 a 100% de humedad
    float humedad = map(sensorValue, 950, 250, 0, 100);

    // Limitar el valor de humedad al rango 0-100%
    humedad = constrain(humedad, 0, 100);

    // Limpiar el LCD
    lcd.clear();

    // Mostrar el mensaje si la humedad es menor al 10%
    if (humedad < 10) {
      lcd.setCursor(0, 0);
      lcd.print("Humedad baja!");
      lcd.setCursor(0, 1);
      lcd.print(humedad);
      lcd.print(" %");
    } else {
      // Mostrar el valor de humedad si es mayor o igual a 10%
      lcd.setCursor(0, 0);
      lcd.print("Humedad:");
      lcd.setCursor(0, 1);
      lcd.print(humedad);
      lcd.print(" %");
    }

    // Enviar el valor de humedad por Serial
    Serial.println(humedad);  // Esto envía el valor de la humedad por el puerto serial
  }
}

