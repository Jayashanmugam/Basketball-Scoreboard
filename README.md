🏀 Basketball Scoreboard Pro

A fully interactive and customizable Basketball Scoreboard Application built using HTML, CSS, and JavaScript, featuring real-time score tracking, timer control, quarter navigation, player score tracking, foul management, match history, timeout system, and team customization.

🚀 Live Features

This project provides everything needed for a digital basketball scoreboard:

✔ Score & Match Control

Add/subtract 1, 2, or 3 points for each team

Select which player scored

Start / pause / reset game timer (default 10:00)

Track and modify quarters

Start / End / Reset match

✔ Team Customization

Change team names

Upload custom team logos

Dedicated UI sections for Team A & Team B

Team color themes

✔ Player Management

Add/remove players dynamically

Track individual player scores

Auto-update dropdown selections

Clean chip-like UI for player score display

✔ Foul Tracking

Increment/decrement fouls for both teams

Visual indicators for foul count

✔ Timeout System

90-second timeout logic

Pauses game timer

Displays countdown

Auto resume after timeout

✔ Match History

Saves history in localStorage

Shows previous matches with:

Scores

Quarter

Fouls

Player score cards

Team logos

Date & time

Option to clear history

📂 Project Structure
/project-root
│
├── index.html
├── styles.css
├── script.js
└── (images/logos if any)


index.html – Scoreboard UI Structure

Contains the full layout of the scoreboard, UI controls, timer, history panel, player lists, and event button hooks.


index

styles.css – Visual Styles

Contains the modern dark-themed visual design, responsive layout, player chips UI, team color themes, button styling, and timer/quarter section designs.


styles

script.js – Full Logic & Functionality

Handles:

Game timer

Score increment/decrement

Quarter changes

Player add/remove and score management

Fouls

LocalStorage match history

Team name & logo updates

Timeout system

UI rendering logic


script

🛠️ How to Run

Download or clone the repository

Ensure all three files (index.html, styles.css, script.js) are in the same directory

Open index.html in any browser

Enjoy the fully functional scoreboard

🎯 Future Enhancements (Optional)

You can extend this project with:

Firebase / MongoDB backend for saving matches

Admin login

Export match report as PDF

Display live scoreboard on projector

Add sound effects (buzzer, timeout, scoring)

Mobile responsive mini-scoreboard

🤝 Contributing

Pull requests and feature suggestions are welcome!

📜 License

This project is free to use for personal and educational purposes.
