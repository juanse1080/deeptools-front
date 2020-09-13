export default class PushNotification {
  constructor(options = {}) {
    let defaults = {
      title: 'Titulo Padrão',
      body: 'Mensagem Padrão',
      icon:
        'https://pbs.twimg.com/profile_images/686359431664238592/VEc23RGt.png',
      status: 1,
      action: ''
    };

    let settings = Object.assign({}, defaults, options);
    this.settings = settings;
    this.requestPermission();
  }

  getAttr() {
    console.log(this.settings);
  }

  defineStatus(status) {
    if (this.settings.icon === '') {
      switch (status) {
        case 1:
          this.settings.icon =
            '/static/admin/plugins/notificacao/images/ICON_CHECK.png';
          break;
        case 2:
          this.settings.icon =
            '/static/admin/plugins/notificacao/images/ICON_ERROR.png';
          break;
        default:
          this.settings.icon =
            '/static/admin/plugins/notificacao/images/ICON_CHECK.png';
          break;
      }
    }
  }

  requestPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(function(result) {
        console.log(result);
      });
    }
  }

  checkPermission() {
    // alert(Notification.permission)
    if (!Notification) {
      alert('Your browser is not compatible');
      return false;
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(function(result) {
        console.log(result);
      });
      return false;
    } else {
      return true;
    }
  }

  callAction(notification, action) {
    console.log(notification, action);
    if (action) {
      notification.onclick = function() {
        window.open(action);
      };
    }
  }

  notify(body = '', icon = '') {
    if (this.checkPermission()) {
      let notification = new Notification(this.settings.title, {
        icon: icon ? icon : this.settings.icon,
        body: body ? body : this.settings.body
      });
      this.callAction(notification, this.settings.action);
    } else {
      console.log('Permission denied');
    }
  }
}
