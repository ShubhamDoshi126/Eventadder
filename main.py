from flask import Flask, request, jsonify
import datetime
import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Set up Flask application
app = Flask(__name__)

# Define the necessary Google Calendar API scopes
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

def authenticate_google_account():
    """
    Handles Google OAuth2 authentication.
    Returns the credentials object after the user logs in and authorizes the app.
    """
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def create_event(service, summary, description, start_time_str, end_time_str):
    """
    Creates an event on the user's Google Calendar.
    """
    event = {
        'summary': summary,
        'description': description,
        'start': {
            'dateTime': start_time_str,
            'timeZone': 'America/New_York',
        },
        'end': {
            'dateTime': end_time_str,
            'timeZone': 'America/New_York',
        },
    }
    created_event = service.events().insert(calendarId='primary', body=event).execute()
    return created_event

@app.route('/create_event', methods=['POST'])
def process_create_event():
    """
    Handles the incoming POST request from the front-end, processes the data, 
    and creates a Google Calendar event.
    """
    data = request.get_json()

    # Get the details from the front-end
    summary = data.get('text', 'No summary provided')
    description = data.get('description', 'No description provided')  # Use 'image' or other fields as needed
    start_time_str = data.get('start_time', '2024-10-12T09:00:00')  # Example start time
    end_time_str = data.get('end_time', '2024-10-12T10:00:00')  # Example end time

    # Authenticate the Google account
    creds = authenticate_google_account()
    if not creds or not creds.valid:
        return jsonify({"error": "Failed to authenticate Google account"}), 401

    # Build the Google Calendar service
    service = build('calendar', 'v3', credentials=creds)

    # Create the event
    event = create_event(service, summary, description, start_time_str, end_time_str)

    # Return the event link
    return jsonify({"message": "Event created successfully", "event_link": event.get('htmlLink')})


if __name__ == '__main__':
    app.run(debug=True)
