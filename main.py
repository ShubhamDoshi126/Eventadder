import datetime
import os.path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# If modifying these SCOPES, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

def authenticate_google_account():
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
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
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def create_event(service, summary, description, start_time_str, end_time_str):
    """Creates an event on the user's Google Calendar."""
    event = {
        'summary': summary,
        'description': description,
        'start': {
            'dateTime': start_time_str,
            'timeZone': 'America/New_York',  # Set the appropriate time zone
        },
        'end': {
            'dateTime': end_time_str,
            'timeZone': 'America/New_York',
        },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    print(f"Event created: {event.get('htmlLink')}")

def main():
    # Authenticate the Google account
    creds = authenticate_google_account()

    # Build the service
    service = build('calendar', 'v3', credentials=creds)

    # Input for the event
    summary = "This is new Event"
    description = "Event description goes here."
    start_time_str = '2024-10-12T09:00:00'  # Replace with your date and time
    end_time_str = '2024-10-12T10:00:00'  # Replace with your date and time

    # Create the event
    create_event(service, summary, description, start_time_str, end_time_str)

if __name__ == '__main__':
    main()
