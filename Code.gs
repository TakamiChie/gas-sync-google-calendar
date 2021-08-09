// README
// Instruction: https://github.com/soetani/gas-sync-google-calendar
var DAYS_TO_SYNC;
var CALENDAR_ID_FROM;
var CALENDAR_ID_TO;
var SLACK_WEBHOOK_URL;
var EXPORT_WORDS;
function main(){
  var prop = PropertiesService.getScriptProperties();
  DAYS_TO_SYNC = parseInt(prop.getProperty("DAYS_TO_SYNC"));
  CALENDAR_ID_FROM = prop.getProperty("CALENDAR_ID_FROM");
  CALENDAR_ID_TO = prop.getProperty("CALENDAR_ID_TO");
  SLACK_WEBHOOK_URL = prop.getProperty("SLACK_WEBHOOK_URL");
  EXPORT_WORDS = prop.getProperty("EXPORT_WORDS").split("\t");
  var dateFrom = new Date();
  var dateTo = new Date(dateFrom.getTime() + (DAYS_TO_SYNC * 24 * 60 * 60* 1000));
  
  var sourceId = CALENDAR_ID_FROM;
  var guestId = CALENDAR_ID_TO;
  Logger.log('Source: ' + sourceId + ' / Guest: ' + guestId);
  
  var events = CalendarApp.getCalendarById(sourceId).getEvents(dateFrom, dateTo);
  events.forEach(function(event){
    if(EXPORT_WORDS.some((e) => event.getTitle().includes(e))){
      var guest = event.getGuestByEmail(guestId);
      guest ? syncStatus(event, guest) : invite(event, guestId);
    }
  });
}

function syncStatus(event, guest){
  var sourceStatus = event.getMyStatus();
  var guestStatus = guest.getGuestStatus();
  
  if(guestStatus != CalendarApp.GuestStatus.YES && guestStatus != CalendarApp.GuestStatus.NO) return;
  if((sourceStatus == CalendarApp.GuestStatus.YES || sourceStatus == CalendarApp.GuestStatus.NO) && sourceStatus != guestStatus){
    // Notify when source status is opposite from guest's status
    notify('Failed to sync the status of the event: ' + event.getTitle() + ' (' + event.getStartTime() + ')');
  }
  else if(sourceStatus != guestStatus && sourceStatus != CalendarApp.GuestStatus.OWNER){
    // Update status when my status is invited/maybe AND guest's status is yes/no
    event.setMyStatus(guestStatus);
    Logger.log('Status updated:' + event.getTitle() + ' (' + event.getStartTime() + ')');
  }
}

function invite(event, guestId){
  event.addGuest(guestId);
  notify('Invited: ' + event.getTitle() + ' (' + event.getStartTime() + ')');
  Logger.log('Invited: ' + event.getTitle() + ' (' + event.getStartTime() + ')');
}

function notify(message){
  if(SLACK_WEBHOOK_URL.startsWith("http")){
    var data = {};
    if(SLACK_WEBHOOK_URL.includes("slack"))
      data = {'text': message};
    else if(SLACK_WEBHOOK_URL.includes("discord"))
      data = {'content': message};
    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };
    UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
  }
}
