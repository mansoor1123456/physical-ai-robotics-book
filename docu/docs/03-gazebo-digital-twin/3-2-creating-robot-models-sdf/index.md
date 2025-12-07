# Chapter 3.2: Creating Robot Models (SDF)

## 3.2.1 Introduction to Robot Modeling
### 3.2.1.1 URDF (Unified Robot Description Format) vs. SDF (Simulation Description Format)
### 3.2.1.2 Advantages of SDF for Gazebo Simulations
### 3.2.1.3 Basic SDF File Structure

## 3.2.2 Defining Links and Visuals
### 3.2.2.1 `<link>` Element: Mass, Inertia, Visuals, Collisions
### 3.2.2.2 `<visual>` Element: Geometry (Box, Cylinder, Sphere, Mesh), Materials
### 3.2.2.3 Understanding Coordinate Frames and Origins

## 3.2.3 Defining Joints and Kinematics
### 3.2.3.1 `<joint>` Element: Parent/Child Links, Type (Revolute, Prismatic, Fixed)
### 3.2.3.2 Axis of Rotation and Limits
### 3.2.3.3 Building a Simple Articulated Robot (e.g., 2-DOF Arm)

## 3.2.4 Collision Properties and Physics
### 3.2.4.1 `<collision>` Element: Geometry and Collision Meshes
### 3.2.4.2 Surface Properties (Friction, Restitution)
### 3.2.4.3 Interaction with Physics Engine

## 3.2.5 Integrating Sensors
### 3.2.5.1 Common Sensor Types: Camera, Lidar, IMU, Contact
### 3.2.5.2 `<sensor>` Element: Placement, Parameters, Output Topics
### 3.2.5.3 Configuring Camera and Lidar Sensors for Realistic Data

## 3.2.6 Adding Actuators and Control Interfaces
### 3.2.6.1 Joint Motors and Force/Torque Control
### 3.2.6.2 Basic Actuation within SDF
### 3.2.6.3 Introduction to Gazebo Plugins for Actuator Control

### Learning Objectives

Upon completion of this chapter, students will be able to:
- Differentiate between URDF and SDF and explain why SDF is preferred for Gazebo.
- Create a basic robot model in SDF, defining links, visuals, and collision properties.
- Define various types of joints to establish the robot's kinematic structure.
- Integrate different types of sensors (e.g., camera, lidar) into an SDF model.
- Understand the fundamentals of actuating robot joints within the Gazebo simulation environment.
