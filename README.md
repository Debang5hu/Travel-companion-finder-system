# Travel Companion Finder System

A web application that helps users find compatible travel partners, join travel groups, and communicate through chat. The system uses a hybrid recommendation model to match users based on preferences, behavior, and location.

---

## Overview

Planning trips with suitable companions is often difficult due to differences in interests, budget, and travel style. This system addresses that problem by analyzing user profiles and recommending the most compatible users.


The system is built using Flask and MySQL, with an integrated machine learning model for recommending users based on multiple factors:

- User profile similarity (content-based)
- User interaction patterns (collaborative filtering)
- Geographic proximity
- Clustering (K-Means)

The backend exposes REST APIs for authentication, user management, group management, chat, and recommendations.

---

## Features

### 1. User Management
- Create account
- Update profile
- Delete account
- View profile

### 2. Authentication
- JWT-based authentication
- Login / Logout
- Token blacklisting

### 3. Group System
- Create travel groups
- Join groups (with approval system)
- Accept / Reject join requests
- Leave group
- Delete group (admin only)
- Group listing with metadata

### 4. Chat System
- Private messaging
- Group chat
- Unread message tracking
- Mark messages as read

### 5. Recommendation System
- Hybrid recommendation engine
- Suggests users with similar travel interests

---

## Recommendation Model

The recommendation system combines multiple techniques:

### Content-Based Filtering
Uses user profile features:
- Age
- Budget
- Travel preferences (beach, trekking, culture, adventure)
- Travel month

Similarity is computed using cosine similarity.

### Collaborative Filtering
- Uses user–POI rating matrix
- Computes similarity between users based on ratings

### Geographic Similarity
- Based on latitude and longitude
- Uses geodesic distance

### Clustering
- K-Means clustering groups similar users
- Adds cluster-based similarity boost

### Final Score

The final recommendation score is computed as:


final_score =
w_content * content_score +
w_cf * cf_score +
w_geo * geo_score +
0.1 * cluster_score


Weights (w_content, w_cf, w_geo) are dynamically computed based on the variance of their respective similarity scores, allowing the model to adaptively prioritize the most informative component.


## Tech Stack

- Python
- Flask
- MySQL
- Pandas / NumPy
- Scikit-learn
- Geopy(Nominatim - OpenStreetMap)
- JWT Authentication

---

## Environment Variables

Create a `.env` file:

```env
DB_HOST=your_host
DB_USER=your_user
DB_PASSWD=your_password
DB=your_database
JWT_SECRET=your_secret_key
```


---

## API Endpoints

### Account
- `POST /api/create-account`
- `PUT /api/update-account`
- `DELETE /api/delete-account`
- `GET /api/profile`

### Auth
- `POST /api/login`
- `GET /api/logout`

### Groups
- `GET /api/groups`
- `POST /api/create-group`
- `POST /api/join-group`
- `PUT /api/update-group`
- `DELETE /api/delete-group`
- `POST /api/group/allow`
- `POST /api/group/reject`
- `POST /api/group/leave`
- `GET /api/group/requests`

### Chat
- `POST /api/chat/send`
- `GET /api/chat/messages`
- `GET /api/chat/unread`
- `POST /api/chat/read`
- `POST /api/group/chat/send`
- `GET /api/group/chat`

### Recommendation
- `POST /api/recommend`

---

## How to Run

1. Install dependencies:

```bash
pip install -r requirements.txt
```
2.  Create a `.env` file and add the required environment variables (see Environment Variables section)

3. Start the server:

```bash      
python app.py
```

4. Server runs on:
```bash
http://localhost:8080
```
## License

This project is licensed under the MIT License.
