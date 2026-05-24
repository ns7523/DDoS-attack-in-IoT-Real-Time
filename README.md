<div align="center">
  <br />
  <img src="https://via.placeholder.com/120x120/0a0a0a/ffffff?text=IoT+Sec" alt="IoT Security Icon" />
  <br />

  <h1 align="center">DDoS Detection in IoT (Real-Time)</h1>

  <p align="center">
    <strong>Feature Engineering & Machine Learning Framework for Real-Time IoT Attack Mitigation.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Status-Research-blue?style=flat-square" alt="Status">
    <img src="https://img.shields.io/badge/Network-Mininet_&_Floodlight-orange?style=flat-square" alt="Network">
    <img src="https://img.shields.io/badge/Python-3.6+-black?style=flat-square&logo=python" alt="Python">
  </p>
</div>

<br />

## Overview

This project implements a sophisticated feature engineering and machine learning pipeline for detecting and mitigating Distributed Denial of Service (DDoS) attacks in constrained Internet of Things (IoT) environments. By orchestrating sFlow telemetry, Floodlight SDN control, and Mininet emulation, the framework achieves highly accurate, real-time threat detection.

### Engineering & Security Significance
Traditional intrusion detection systems fail under the latency constraints of IoT networks. This architecture extracts specialized telemetry features at the network edge, passing them through an optimized machine learning classifier. The integration with Software-Defined Networking (SDN) allows for immediate, automated mitigation of identified attack vectors.

<br />

## System Architecture

<table>
   <tr>
      <th align="center">Network Design Diagram</th>
   </tr>
   <tr>
      <td align="center"><img width="600" alt="System Design" src="https://github.com/user-attachments/assets/f167c121-3d77-4cf7-821b-c25aa5a9b871"></td>
   </tr>
</table>

### Detection Pipeline
1. **Emulation**: `Mininet` simulates a standard IoT topology generating both benign and malicious traffic.
2. **Telemetry**: `sFlow-RT` samples packet data continuously without degrading network throughput.
3. **Classification**: `Scikit-learn` models predict attack signatures based on engineered flow features.
4. **Control**: The `Floodlight` controller isolates and drops malicious flows dynamically.

<br />

## Core Features

- **Real-Time SDN Mitigation**: Automated response pipelines orchestrated via the Floodlight controller.
- **Optimized Feature Engineering**: Dimensionality reduction on raw network flows to ensure low-latency inference.
- **IoT-Specific Threat Modeling**: Dataset and attack vectors tailored to standard IoT vulnerability profiles.

<br />

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Network Emulation** | Mininet (Linux/Ubuntu required) |
| **SDN Controller** | Floodlight |
| **Telemetry & Flow Analysis** | sFlow-RT |
| **Machine Learning Core** | Python, Scikit-learn, Pandas, NumPy |

<br />

## Deployment

### Prerequisites
- **OS**: Linux (Ubuntu highly recommended)
- **Dependencies**: Python 3.6+, Java (for Floodlight)

### Installation Guide
Full setup documentation is available in the [`Installation Guide.pdf`](Installation%20Guide.pdf) and the comprehensive [Project Drive Link](https://drive.google.com/file/d/1ZZW5ZXRkD0Hb7kgpU7pNp3NSgwJSViHw/view?usp=sharing).

1. Install `Mininet` via official binaries.
2. Configure `Floodlight` utilizing the provided installation parameters.
3. Deploy `sFlow-RT` for network sampling.
4. Execute deployment commands outlined in [`Commands.txt`](Commands.txt).

<br />

## Performance & Telemetry Dashboards

<table>
   <tr>
      <th align="center">Real-Time Dashboard</th>
      <th align="center">DDoS Protect Mitigation</th>
   </tr>
   <tr>
      <td align="center"><img width="400" alt="Dashboard" src="https://github.com/user-attachments/assets/8441ae89-b72a-4f68-8742-1937496cd8f1"></td>
      <td align="center"><img width="400" alt="Protect" src="https://github.com/user-attachments/assets/32ed02e9-bbea-41d3-aa03-a8405ed63da0"></td>
   </tr>
</table>

<br />

<div align="center">
  <br />
  <sub>Security Architecture by <a href="https://github.com/ns7523">N S AKASH</a></sub>
</div>
