chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon48.png",
    title: "Pomodoro Timer",
    message: alarm.name === "pomodoro" ? "Time's up! Take a break." : ""
  });
});
