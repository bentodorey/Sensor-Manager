#include <Bridge.h>
#include <Process.h>
#include <DHT.h>
// Configuração do Sensor de Temperatura no Pino 4
#define DHTPIN 4
#define DHTTYPE DHT11 
DHT dht(DHTPIN, DHTTYPE);

const int pinoEntrada = 2;
const int pinoSaida = 3;

int estadoEntradaAnterior = HIGH; 
int estadoSaidaAnterior = HIGH;

int in_count = 0;
int out_count = 0;

void setup() {
  Serial.begin(115200);
  
  // Inicia o sensor de temperatura
  dht.begin();

  delay(5000); 

  Serial.println("\n\n===================================");
  Serial.println("1. ARDUINO LIGADO.");
  Serial.println("2. A INICIAR A BRIDGE (LINUX)...");
  Serial.println("===================================");
  
  Bridge.begin();
  
  pinMode(pinoEntrada, INPUT);
  pinMode(pinoSaida, INPUT);
  
  Serial.println("3. SUCESSO! SISTEMA PRONTO PARA CONTAR.");
}

void loop() {
  int leituraEntrada = digitalRead(pinoEntrada);
  int leituraSaida = digitalRead(pinoSaida);

  // Deteta Entrada
  if (leituraEntrada == LOW && estadoEntradaAnterior == HIGH) {
    in_count++;
    sendData();
    delay(500); // Um pouco mais de delay para evitar contagens duplas
  }
  estadoEntradaAnterior = leituraEntrada; 

  // Deteta Saída
  if (leituraSaida == LOW && estadoSaidaAnterior == HIGH) {
    if (in_count > out_count) {
      out_count++;
      sendData();
      delay(500);
    }
  }
  estadoSaidaAnterior = leituraSaida; 
}

void sendData() {
  int current = in_count - out_count;
  
  // Lê a temperatura no momento do envio
  float t = dht.readTemperature();
  if (isnan(t)) t = 0; // Se falhar, envia 0

  // Monta o JSON com os nomes de variáveis corretos
  String jsonStr = "{";
  jsonStr += "\"in\":" + String(in_count) + ",";
  jsonStr += "\"out\":" + String(out_count) + ",";
  jsonStr += "\"current\":" + String(current) + ",";
  jsonStr += "\"temp\":" + String(t);
  jsonStr += "}";

  Serial.print("A enviar: ");
  Serial.println(jsonStr);

  Process p;
  p.begin("curl");
  p.addParameter("-H");
  p.addParameter("Content-Type: application/json");
  p.addParameter("-X");
  p.addParameter("POST");
  p.addParameter("-d");
  p.addParameter(jsonStr);
  
  // O teu IP atualizado
p.addParameter("http://192.168.1.152:8888/PROJETOWEBSENSOR/salvar.php");
  p.run();

  Serial.print("Resposta do Servidor: ");
  while (p.available() > 0) {
    char c = p.read();
    Serial.print(c);
  }
  Serial.println(); 
  Serial.println("-------------------------");
}