## Feature Engineering and Machine Learning Framework for DDoS Attack Detection in the Standardized Internet of Things
NOTE : WORKS ONLY IN LINUX (UBUNTU)

[`Installation Guide`](Installation%20Guide.pdf)


## Drive link
Full Project avalable on [`ns-ddos`](https://drive.google.com/file/d/1ZZW5ZXRkD0Hb7kgpU7pNp3NSgwJSViHw/view?usp=sharing)

## Project Overview
This project implements a feature engineering and machine learning framework for detecting Distributed Denial of Service (DDoS) attacks in the Internet of Things (IoT) environment. The framework utilizes sFlow, Floodlight, and Mininet for real-time detection.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Design ](#system-design)
- [File Structure](#file-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Dataset](#dataset)
- [Real-Time Detection](#real-time-detection)
- [Results](#results)


## Features
- Real-time DDoS detection using machine learning algorithms.
- Traffic sampling with sFlow.
- Network emulation with Mininet.
- Centralized control with Floodlight SDN controller.
- Feature extraction from network traffic data.

## Technologies Used
- `Python 3.6+`
- `Mininet`
- `Floodlight SDN Controller`
- `sFlow-RT`
- `Scikit-learn`
- `Pandas`
- `NumPy`

## System Design 
<table>
   <tr>
      <th> System Design </th>
   </tr>
   <tr>
      <td><img width="397" alt="image" src="https://github.com/user-attachments/assets/f167c121-3d77-4cf7-821b-c25aa5a9b871"></td>
   </tr>
</table>

## File Structure 
<table>
   <tr>
      <th> File Structure </th>
   </tr>
   <tr>
      <td><img width="400" alt="image" src="https://github.com/user-attachments/assets/8ddd90d1-7ae1-459b-90d5-447657938383"></td>
   </tr>
</table>

## Installation

1. **Download File :**
   [ns-ddos](https://drive.google.com/file/d/1ZZW5ZXRkD0Hb7kgpU7pNp3NSgwJSViHw/view?usp=sharing)
   
2. **Set up Mininet:**
   Follow the instructions on the [Mininet website](http://mininet.org/download/) to install Mininet.

3. **Set up Floodlight:**
   Follow the instructions in the Floodlight configuration file (Floodlight Installation Steps) to configure Flood Light.

4. **Set up sFlow-RT:**
   Follow the instructions on the [sFlow-RT website](https://sflow-rt.com/download.php) to install and configure sFlow-RT.

## Usage
   Follow the instructions in the [`Command.txt`](Commands.txt)

## Dataset
The dataset used for training and testing the `machine learning` models consists of network traffic data generated in the `Mininet` environment. The traffic data includes `normal traffic` as well as `DDoS attack traffic`.

## Real-Time Detection
The [`ns-ddos`](Commands.txt) file utilizes the trained machine learning model to detect DDoS attacks in real-time. It processes the incoming network traffic data and predicts whether it is normal or attack traffic.

## Results
### Project Snapshots
<table>
   <tr>
      <th>Dashboard</th>
      <th>DDoS Protect</th>
   </tr>
   <tr>
      <td><img width="397" alt="image" src="https://github.com/user-attachments/assets/8441ae89-b72a-4f68-8742-1937496cd8f1"></td>
      <td><img width="385" alt="image" src="https://github.com/user-attachments/assets/32ed02e9-bbea-41d3-aa03-a8405ed63da0"></td>
   </tr>
   <tr>
      <th>Metric Browser</th>
      <th>Data Flow Test</th>
   </tr>
   <tr>
      <td><img width="381" alt="image" src="https://github.com/user-attachments/assets/e36f5b85-cf2f-43a0-aab8-a0b0b76d2943"></td>
      <td><img width="387" alt="image" src="https://github.com/user-attachments/assets/aa953ea9-e505-4b40-b287-613bab14a5e1"></td>
   </tr>
   <tr>
      <th>Flow Trend</th>
      <th>DDoS Protect Settings</th>
   </tr>
   <tr>
      <td><img width="387" alt="image" src="https://github.com/user-attachments/assets/1d8b511e-8888-445d-ab39-f8435202b1eb"></td>
      <td><img width="385" alt="image" src="https://github.com/user-attachments/assets/9c8f8a0c-2209-4940-b191-3b499ee7309d"></td>
   </tr>
</table>



