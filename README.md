# Feature Engineering and Machine Learning Framework for DDoS Attack Detection in the Standardized Internet of Things
NOTE : WORKS ONLY IN LINUX (UBUNTU)
## Drive link
Full Project avalable on [ns-ddos](https://drive.google.com/file/d/1_M12cc4rVFs_8B1AikrZbKmQRvEEExx-/view?usp=sharing)
## Project Overview
This project implements a feature engineering and machine learning framework for detecting Distributed Denial of Service (DDoS) attacks in the Internet of Things (IoT) environment. The framework utilizes sFlow, Floodlight, and Mininet for real-time detection.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Dataset](#dataset)
- [Real-Time Detection](#real-time-detection)

## Features
- Real-time DDoS detection using machine learning algorithms.
- Traffic sampling with sFlow.
- Network emulation with Mininet.
- Centralized control with Floodlight SDN controller.
- Feature extraction from network traffic data.

## Technologies Used
- Python 3.6+
- Mininet
- Floodlight SDN Controller
- sFlow-RT
- Scikit-learn
- Pandas
- NumPy

## Installation

1. **Download File :**
   [ns-ddos](https://drive.google.com/file/d/1_M12cc4rVFs_8B1AikrZbKmQRvEEExx-/view?usp=sharing)
3. **Set up Mininet:**
   Follow the instructions on the [Mininet website](http://mininet.org/download/) to install Mininet.

4. **Set up Floodlight:**
   Follow the instructions in the Floodlight configuration file (Floodlight Installation Steps) to configure Flood Light.

5. **Set up sFlow-RT:**
   Follow the instructions on the [sFlow-RT website](https://sflow-rt.com/download.php) to install and configure sFlow-RT.

## Usage
   Follow the instructions in the Command.txt file (Commands.txt) .

## Dataset
The dataset used for training and testing the machine learning models consists of network traffic data generated in the Mininet environment. The traffic data includes normal traffic as well as DDoS attack traffic.

## Real-Time Detection
The `ns-ddos` file utilizes the trained machine learning model to detect DDoS attacks in real-time. It processes the incoming network traffic data and predicts whether it is normal or attack traffic.

