<div align="center">

  <img src="https://img.icons8.com/color/96/000000/network-cable.png" alt="Network Icon" width="80" />

  # DDoS-attack-in-IoT-Real-Time

  **Feature Engineering and Machine Learning Framework for DDoS Attack Detection in the Standardized Internet of Things**

  [![Status](https://img.shields.io/badge/Status-Real--Time-brightgreen?style=flat-square)](#)
  [![Platform](https://img.shields.io/badge/Platform-Linux_(Ubuntu)-orange?style=flat-square&logo=linux&logoColor=white)](#)
  [![Python](https://img.shields.io/badge/Python-3.6%2B-blue?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)

  *Full Project available on [Google Drive (ns-ddos)](https://drive.google.com/file/d/1ZZW5ZXRkD0Hb7kgpU7pNp3NSgwJSViHw/view?usp=sharing).*

</div>

---

## 🎯 Project Overview

This project implements a feature engineering and machine learning framework for detecting Distributed Denial of Service (DDoS) attacks in the Internet of Things (IoT) environment. The framework utilizes **sFlow**, **Floodlight**, and **Mininet** for real-time detection.

> [!WARNING]
> **NOTE:** This project works ONLY in LINUX (UBUNTU).

## 🚀 Features

- **Real-time DDoS detection** using machine learning algorithms.
- **Traffic sampling** with sFlow.
- **Network emulation** with Mininet.
- **Centralized control** with Floodlight SDN controller.
- **Feature extraction** from network traffic data.

## 💻 Technologies Used

| Category | Technologies |
| :--- | :--- |
| **Language** | `Python 3.6+` |
| **Networking** | `Mininet`, `Floodlight SDN Controller`, `sFlow-RT` |
| **Machine Learning** | `Scikit-learn` |
| **Data Processing** | `Pandas`, `NumPy` |

## 📐 System Design & File Structure

<table>
  <tr>
    <th align="center">System Design</th>
    <th align="center">File Structure</th>
  </tr>
  <tr>
    <td align="center"><img width="400" alt="System Design" src="https://github.com/user-attachments/assets/f167c121-3d77-4cf7-821b-c25aa5a9b871"></td>
    <td align="center"><img width="400" alt="File Structure" src="https://github.com/user-attachments/assets/8ddd90d1-7ae1-459b-90d5-447657938383"></td>
  </tr>
</table>

## ⚙️ Installation

1. **Download File**: [ns-ddos (Google Drive)](https://drive.google.com/file/d/1ZZW5ZXRkD0Hb7kgpU7pNp3NSgwJSViHw/view?usp=sharing)
2. **Set up Mininet**: Follow the instructions on the [Mininet website](http://mininet.org/download/) to install Mininet.
3. **Set up Floodlight**: Follow the instructions in the Floodlight configuration file ([`Installation Guide.pdf`](Installation%20Guide.pdf)) to configure Floodlight.
4. **Set up sFlow-RT**: Follow the instructions on the [sFlow-RT website](https://sflow-rt.com/download.php) to install and configure sFlow-RT.

## 🛠️ Usage

Follow the instructions in the [`Commands.txt`](Commands.txt) file to execute the real-time detection pipeline.

## 📊 Dataset

The dataset used for training and testing the `machine learning` models consists of network traffic data generated in the `Mininet` environment. The traffic data includes `normal traffic` as well as `DDoS attack traffic`.

## ⚡ Real-Time Detection

The [`Commands.txt`](Commands.txt) script utilizes the trained machine learning model to detect DDoS attacks in real-time. It processes the incoming network traffic data and predicts whether it is normal or attack traffic.

---

## 📈 Results & Snapshots

<table>
   <tr>
      <th align="center">Dashboard</th>
      <th align="center">DDoS Protect</th>
   </tr>
   <tr>
      <td align="center"><img width="400" alt="Dashboard" src="https://github.com/user-attachments/assets/8441ae89-b72a-4f68-8742-1937496cd8f1"></td>
      <td align="center"><img width="400" alt="DDoS Protect" src="https://github.com/user-attachments/assets/32ed02e9-bbea-41d3-aa03-a8405ed63da0"></td>
   </tr>
   <tr>
      <th align="center">Metric Browser</th>
      <th align="center">Data Flow Test</th>
   </tr>
   <tr>
      <td align="center"><img width="400" alt="Metric Browser" src="https://github.com/user-attachments/assets/e36f5b85-cf2f-43a0-aab8-a0b0b76d2943"></td>
      <td align="center"><img width="400" alt="Data Flow Test" src="https://github.com/user-attachments/assets/aa953ea9-e505-4b40-b287-613bab14a5e1"></td>
   </tr>
   <tr>
      <th align="center">Flow Trend</th>
      <th align="center">DDoS Protect Settings</th>
   </tr>
   <tr>
      <td align="center"><img width="400" alt="Flow Trend" src="https://github.com/user-attachments/assets/1d8b511e-8888-445d-ab39-f8435202b1eb"></td>
      <td align="center"><img width="400" alt="Protect Settings" src="https://github.com/user-attachments/assets/9c8f8a0c-2209-4940-b191-3b499ee7309d"></td>
   </tr>
</table>

<br />

<div align="center">
  <sub>Security Engineering by <a href="https://github.com/ns7523">N S AKASH</a></sub>
</div>
