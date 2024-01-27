import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationCommand, ApplicationCommandResponse, Author, Message, Option } from '../DiscordApi/Interface';
import DiscordAPI from '../DiscordApi/DiscordApi';
import { DeletableDirective } from '../deletable/Deletable.directive';
import { GuildApplicationCommandsViewComponent } from '../guild-application-commands-view/guild-application-commands-view.component';
import { OptionPillComponent } from '../option-pill/option-pill.component';

export interface ApplicationWithCommands {
  application: Application,
  commands: ApplicationCommand[]
}

export interface CommandSelect {
  command: ApplicationCommand,
  application: Application
}

export type FilledOptions =  {type: number, name: string, value: any }[]

@Component({
  selector: 'message-button',
  standalone: true,
  imports: [
    FormsModule,
    DeletableDirective,
    GuildApplicationCommandsViewComponent,
    OptionPillComponent
  ],
  templateUrl: './message-button.component.html',
  styleUrl: './message-button.component.scss'
})
export class MessageButtonComponent implements OnChanges {
  @Input() sendMessage: (message: string) => any = () => {};
  @Input() onType: (event: Event) => any = () => {}
  @Input() replyMessage: Message
  @Input() guild_id: string | undefined = undefined
  @Output() onRemoveReply = new EventEmitter()
  @Output() useCommand = new EventEmitter<{ command: CommandSelect, filledOptions: FilledOptions }>()

  current_message: string = ""

  view_commands = false

  cachedApplications: ApplicationWithCommands[]| undefined = undefined

  applications: ApplicationWithCommands[] = []

  @ViewChild('messageDiv')
  messageDiv!: ElementRef;

  cmdFilter: string = ""

  command_select: CommandSelect | undefined = undefined

  filledOptions: FilledOptions = []

  ngOnChanges() {
    this.cachedApplications = undefined
    this.applications = []
    this.cmdFilter = ""
  }

  setValue(text: string) {
    const element = this.messageDiv.nativeElement
    this.current_message = text;
    element.innerText = text
  }

  groupApplications(response: ApplicationCommandResponse): ApplicationWithCommands[] {
    let result: ApplicationWithCommands[] = []

    response.applications.forEach((application) => {
      result.push({
        application,
        commands: []
      })
    })

    response.application_commands.forEach((command) => {
      result.find((app) => app.application.id == command.application_id)?.commands?.push(command)
    })

    console.log("result: ", result)

    return result
  }

  onInput(event: Event) {
    const element = this.messageDiv.nativeElement;
    this.view_commands = (element as HTMLElement).innerText.startsWith("/")
    this.cmdFilter = (element as HTMLElement).innerText.split("/", 2)[1]
    this.current_message = element.innerText;
    this.onType(event)

    console.log("typed, new inner text: ", element.innerText, ", view commands: ", this.view_commands, "guild id: ", this.guild_id, " filter: ", this.cmdFilter)
    if (this.view_commands && this.guild_id) {
      if (this.cachedApplications) {
        this.applications = this.cachedApplications
      } else {
        DiscordAPI.getApplicationCommands(this.guild_id).then((response) => {
          this.applications = this.groupApplications(response)
          this.cachedApplications = this.applications
        })
      }
    }
  }

  send() {
    if (this.command_select == undefined) {
      this.sendMessage(this.current_message)
    } else {
      
      this.useCommand.emit({ command: this.command_select, filledOptions: this.filledOptions })
      this.command_select = undefined
    }
    this.setValue("")
  }

  getAvatar(author: Author) {
    return DiscordAPI.userAvatar(author)
  }

  deleteReply = () => {
    this.onRemoveReply.emit()
  }

  onSelectCommand(commandSelect: CommandSelect) {
    console.log("on select command: ", commandSelect)
    this.view_commands = false
    this.command_select = commandSelect
    const element = this.messageDiv.nativeElement;
    (element as HTMLElement).innerText = "/" + commandSelect.command.name
  }

  changeOptionPill(option: Option, text: string) {
    console.log("option pill: ", text)
    let optiona = this.filledOptions.find((op) => op.name == option.name)
    if (optiona) optiona.value = text
    else this.filledOptions.push({
      type: 3,
      name: option.name,
      value: text
    })
  }
}
