export default class NotificationsModel {
  newNotification() {
    const max = 1,
      min = 0;

    return [
      Math.round(Math.random() * (max - min)) + min,
      `notif-${Math.random()}`,
    ];
  }
}