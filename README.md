# Introduction
This repository contains code for Feel Your Hands, an application to help users regain motor control of their arms using nuanced movements.

The application uses the web camera to capture video of the user's hand and uses a PoseNet pose estimation model to calculate position of the wrist in real time.

# Features:
* Use free-form mode to explore the various degrees of freedom of your hand. Move around freely on the canvas, create shapes and explore the limitless possibilities of your hand's range of motion.
* Select from pre loaded shapes and trace these shapes to improve finer control of your hand
* The application plays soothing music in the background to help reduce stress
* The color palette is inspired by the sunset: it is calming, fun and relaxed.

# Technical Details:
* Single Pose Estimation using tensorflow
* PoseNet pre-trained model
* Use webcam to capture video
* SVG elements for trace
