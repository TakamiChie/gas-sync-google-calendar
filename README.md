# Google Apps Script to sync Google Calendar

## What's this?

This GAS is allow you to sync events of Google Calendar.

e.g. You have `a@gmail.com` and `b@gmail.com`

**`a@gmail.com`**

- Fetch events of `a@gmail.com`
- Check guests of each event
- If `b@gmail.com` is not invited for the event, the script invites `b@gmail.com`
- If `b@gmail.com` is already invited and set YES/NO status, the script updates status of `a@gmail.com`
- If `a@gamil.com` and `b@gmail.com` have opposite status, the script notifies to Slack

**`b@gmail.com`**

- Fetch events of `b@gmail.com`
- Check guests of each event
- If `a@gmail.com` is not invited for the event, the script invites `a@gmail.com`
- If `a@gmail.com` is already invited and set YES/NO status, the script updates status of `b@gmail.com`
- If `a@gamil.com` and `b@gmail.com` have opposite status, the script notifies to Slack

## How to use

**IT IS REQUIRED TO EXECUTE SCRIPT ON BOTH ACCOUNTS TO SYNC EVENTS.**

### Set up variables

This setting has been moved to Script Properties. The new Google App Script editor does not allow you to set script properties.
Please set it from the old editor UI.

- DAYS_TO_SYNC:How many days until the next appointment should be synchronized.
- CALENDAR_ID_FROM:The ID of the calendar to synchronize from
- CALENDAR_ID_TO:ID of the calendar to synchronize to
- SLACK_WEBHOOK_URL:Webhook URL of Slack or Discord to be notified
- EXPORT_WORDS:Text in the title of the event to be exported to the calendar to be synchronized (multiple titles can be specified, separated by tabs).
  - For example, if you want to export an event that contains the phrase "SBCast. or SBC.openmike", enter the phrase "SBCast.\tSBC.openmic".

### Set up trigger

To execute the GAS automatically, please set up the trigger

`Edit > Current project triggers`

- Run: `main`
- Events: `Time-driven`

