🔹 Approach

1.Problem Understanding

Students often travel to the same school/college but individually.
The goal is to suggest carpooling matches to save cost, time, and reduce traffic.

2.System Design

Frontend: Simple map-based UI where students enter location and destination.
Backend: Route comparison + matching algorithm.
Database: Stores student profiles, routes, and anonymous IDs.
Chat Module: Enables communication between matched students.

3.Flow

Student enters trip details.
Backend processes and finds overlaps.
Matches displayed on map.
Students can connect anonymously via chat.


🔹 Diagram (System Architecture)

[ Student (Frontend App) ]
        |
        v
[ Map Input (Home & Destination) ]
        |
        v
[ Backend Server ]
   ├── Route Comparison Engine
   ├── Matching Algorithm
   ├── Chat Service
   └── User Management (Anonymous IDs)
        |
        v
[ Database (Student Data, Routes, Chats) ]
        |
        v
[ Result Sent Back to Frontend Map + Chat ]


🔹 Methodology

Frontend: React.js .

Backend: Node.js + Express .

Database: MongoDB .

Maps & Routes: Google Maps API.

Matching Algorithm: Compare route coordinates → check overlap within radius → return matches.

Authentication & Anonymity: Unique usernames + JWT for secure login.


