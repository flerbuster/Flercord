import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationWithCommands, CommandSelect } from '../message-button/message-button.component';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { ApplicationCommand, Application } from '../DiscordApi/Interface';
import { flatten } from '../DiscordApi/FlercordBuiltinCommands';

@Component({
  selector: 'app-guild-application-commands-view',
  standalone: true,
  imports: [],
  templateUrl: './guild-application-commands-view.component.html',
  styleUrl: './guild-application-commands-view.component.scss'
})
export class GuildApplicationCommandsViewComponent {
  @Input() applications: ApplicationWithCommands[] = []
  @Input() filter: string = ""
  @Output() onSelectCommand = new EventEmitter<CommandSelect>()

  selectedApplication: ApplicationWithCommands | undefined = undefined


  getAvatarUrl(app: ApplicationWithCommands): string {
    return DiscordAPI.userAvatar(app.application.bot)
  }

  getCommands(app: ApplicationWithCommands | undefined): ApplicationCommand[] {
    return app?.commands?.filter((cmd) => {
      return cmd.name.toLowerCase().includes(this.filter) ||  (cmd.description ?? "").toLowerCase().includes(this.filter)
    }) ?? []
  }

  selectApp(app: ApplicationWithCommands) {
    this.selectedApplication = app
  }

  selectCommand(command: ApplicationCommand) {
    console.log("select command: ", command)
    this.onSelectCommand.emit({command: command, application: this.selectedApplication!.application })
  }
}
