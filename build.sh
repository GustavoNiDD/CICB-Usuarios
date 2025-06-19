#!/bin/bash
echo "Iniciando build da aplicação..."
mvn clean package -DskipTests
echo "Build concluído!" 