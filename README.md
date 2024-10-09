# University of Michigan Dining Hall Traffic

This project provides real-time statistics about the busyness of University of Michigan dining halls. It utilizes data obtained by reverse-engineering the internal capacity API used by the official mobile app.

![5O1gxYoSPm](https://github.com/user-attachments/assets/96733962-2840-4e56-aac9-cec1b35b4210)

[https://beasleydog.github.io/diningstats](https://beasleydog.github.io/diningstats)

## Features

- Display current capacity for all U-M dining halls
- Show historical data and trends
- Predict best times to visit each dining hall
- Filter and compare different dining locations
- Input schedule and preferred eating times to get more useful recommendations

## How It Works

The backend is a Google Apps Script that populates a Google Sheet (this project started as an exploration with Google Sheet's built-in graphs but then grew) with dining hall capacity data from the U-M mobile app internal dining hall API every 15 minutes.

I used [Charles](https://www.charlesproxy.com/) to intercept requests from my phone, allowing me to capture the API route for dining hall capacity info. With a little bit of inspection I was able to to replicate the (limited) auth when sending requests from my backend.

## Run Locally

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser
