#include <LiquidCrystal.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);
const int sensorPin = A1;
const int relayPin = 11;

unsigned long lastTime = 0;
unsigned long samplingInterval = 30000; // 30 seg (Nota: tu backend espera cada 20s, aquí es 30s)
bool bombaEncendida = false;
unsigned long tiempoEncendido = 0;

void setup() {
  lcd.begin(16, 2);
  lcd.print("Iniciando...");

  pinMode(sensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);   // Apagado (activo-bajo)

  Serial.begin(9600);
}

void loop() {
  unsigned long ahora = millis();

  // Si la bomba está encendida y pasaron 10 segundos, apagarla
  if (bombaEncendida && (ahora - tiempoEncendido >= 10000)) {
    digitalWrite(relayPin, HIGH);
    bombaEncendida = false;
    // Serial.println("Bomba apagada después de 10 segundos"); // ELIMINADO: No enviar este mensaje al serial
  }

  // Leer humedad cada 30 seg (samplingInterval)
  if (ahora - lastTime >= samplingInterval) {
    lastTime = ahora;

    int sensorValue = analogRead(sensorPin);
    float humedad = map(sensorValue, 1020, 230, 0, 100);
    humedad = constrain(humedad, 0, 100);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Humedad:");
    lcd.setCursor(0, 1);
    lcd.print(humedad);
    lcd.print(" %");

    // SOLAMENTE enviamos el valor numérico de la humedad al puerto serial
    Serial.println(humedad);

    // Activar bomba si humedad < 10%
    if (humedad < 10 && !bombaEncendida) {
      digitalWrite(relayPin, LOW); // Encender bomba
      bombaEncendida = true;
      tiempoEncendido = ahora;
      // Serial.println("Bomba encendida"); // ELIMINADO: No enviar este mensaje al serial
    }
  }
}
