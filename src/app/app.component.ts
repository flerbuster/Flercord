import { Component } from '@angular/core';
import { DiscordGateway } from './DiscordApi/DiscordGateway';

const discordGateway = DiscordGateway.getInstance();
discordGateway.connectToWebSocket()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Flercord';
}
