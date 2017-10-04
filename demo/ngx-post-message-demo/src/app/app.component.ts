import { Component, Inject, OnInit } from '@angular/core';

import { IPostMessageBridge, IPostMessageEventTarget, PostMessageBridgeFactory } from 'ngx-post-message/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(@Inject(PostMessageBridgeFactory) private bridgeFactory: PostMessageBridgeFactory) {
  }

  public ngOnInit() {

    /**
     * Root context
     */
    const iFrame: IPostMessageEventTarget = window.frames[0];
    const currentWindow: IPostMessageEventTarget = window;

    // The main usage scenario
    const bridge: IPostMessageBridge = this.bridgeFactory.makeInstance()
      .connect(currentWindow, iFrame)
      .makeBridge('Logout')
      .makeBridge('ChangeLanguage')
      .addListener('Logout', (message: any) =>
        console.debug(`[Parent][Logout listener] The child has sent an empty message <Logout> to the parent`));

    setTimeout(() => {
      bridge.sendMessage('ChangeLanguage', 'ru');

      setTimeout(() => {
        // The additional usage scenario
        // You can also use the direct native mechanism of sending the message (if the external application does not use Angular2)
        window.frames[0].postMessage([{channel: 'ChangeLanguage', message: 'de'}], '*');
      }, 1000);
    }, 2000);
  }
}
