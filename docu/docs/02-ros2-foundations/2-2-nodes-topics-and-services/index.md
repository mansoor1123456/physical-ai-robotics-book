# Chapter 2.2: ROS 2 Nodes, Topics, and Services

## 2.2.1 ROS 2 Computational Graph
### 2.2.1.1 Understanding Nodes as Executables
### 2.2.1.2 Publishers and Subscribers: Asynchronous Communication
### 2.2.1.3 Services and Clients: Synchronous Request/Response

## 2.2.2 Implementing Nodes in C++ and Python
### 2.2.2.1 Creating a Simple Publisher Node (C++/Python)
### 2.2.2.2 Creating a Simple Subscriber Node (C++/Python)
### 2.2.2.3 Using ROS 2 Client Libraries: `rclcpp` and `rclpy`

## 2.2.3 Topics: Data Streaming
### 2.2.3.1 Defining Custom Message Types (`.msg` files)
### 2.2.3.2 Publishing and Subscribing to Standard and Custom Topics
### 2.2.3.3 Introspecting Topics with `ros2 topic` commands
### 2.2.3.4 Best Practices for Topic Naming and Data Structures

## 2.2.4 Services: Synchronous Communication
### 2.2.4.1 Defining Custom Service Types (`.srv` files)
### 2.2.4.2 Implementing Service Servers and Clients (C++/Python)
### 2.2.4.3 Calling Services with `ros2 service` commands
### 2.2.4.4 Error Handling in Services

## 2.2.5 Parameters
### 2.2.5.1 Declaring and Using Node Parameters
### 2.2.5.2 Dynamic Parameter Updates
### 2.2.5.3 Parameter Servers and Configuration Management

## 2.2.6 Practical Applications
### 2.2.6.1 Building a Simple \"Talker-Listener\" System
### 2.2.6.2 Implementing a Basic Calculator Service
### 2.2.6.3 Using Parameters to Configure Robot Behavior

### Learning Objectives:
1.  Differentiate between ROS 2 nodes, topics, and services, and identify appropriate use cases for each communication primitive.
2.  Develop ROS 2 publisher and subscriber nodes in both C++ and Python using `rclcpp` and `rclpy` client libraries.
3.  Create and utilize custom message and service types to exchange data between ROS 2 components.
4.  Implement ROS 2 service servers and clients in C++ and Python for synchronous request/response operations.
5.  Manage and dynamically update node parameters to configure ROS 2 applications at runtime.
