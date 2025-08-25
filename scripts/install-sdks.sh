#!/bin/bash

set -euo pipefail

echo "🚀 Installing Java SDK for Spring Boot development..."

# Update package lists
echo "📦 Updating package lists..."
sudo apt-get update

# Install essential build tools
echo "🔧 Installing essential build tools..."
sudo apt-get install -y curl wget unzip build-essential

# Install Java 17 (LTS recommended for Spring Boot)
echo "☕ Installing OpenJDK 17..."
sudo apt-get install -y openjdk-17-jdk openjdk-17-jre

# Set JAVA_HOME
echo "🔧 Setting up JAVA_HOME..."
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc

# Verify installation
echo "✅ Verifying Java installation..."
echo "Java version:"
java -version

echo ""
echo "🎉 Installation complete!"
echo "📝 Please run 'source ~/.bashrc' or restart your terminal to apply environment changes."
echo ""
echo "🚀 You can now use Maven Wrapper (./mvnw) for your Spring Boot projects."