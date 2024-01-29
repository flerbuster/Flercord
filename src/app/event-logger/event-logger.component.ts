import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DiscordGateway } from '../DiscordApi/DiscordGateway';
import { StandardMessageComponent } from '../standard-message/standard-message.component';
import { LargeTextDirective } from '../large-text/LargeText.directive';

declare var PrettyJSON;

@Component({
  selector: 'app-event-logger',
  standalone: true,
  imports: [StandardMessageComponent, LargeTextDirective],
  templateUrl: './event-logger.component.html',
  styleUrl: './event-logger.component.scss'
})
export class EventLoggerComponent implements AfterViewInit {
  event_log: { event: any, op: number, name: string }[] = []

  @ViewChild("test", { static: false }) test: ElementRef;

  ngAfterViewInit() {
    DiscordGateway.getInstance().connectToWebSocket()
    DiscordGateway.getInstance().onEvent("", (event, op, name) => { this.event_log.push({ event, op, name }) })

    let data = {
      name:'John Doe',
      age: 20,
      children:[{name:'Jack', age:5}, {name:'Ann', age:8}],
      wife:{name:'Jane Doe', age:28 }
    }
    let test = this.test.nativeElement
    PrettyJSON.view.Node({
      test,
      data
    });
  }

  toJson(event: any) {
    return JSON.stringify(event, null, 4)
  }

  downloadFile(content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'event-log.txt';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  download() {
    this.downloadFile(JSON.stringify(this.event_log))
  }
}
