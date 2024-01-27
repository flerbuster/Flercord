import { FilledOptions } from "../message-button/message-button.component";

export interface Author {
    id: string;
    username: string;
    avatar: string | undefined;
    discriminator: string | undefined;
    public_flags: number;
    premium_type: number;
    flags: number;
    banner: string | undefined;
    accent_color: string | undefined;
    global_name: string | undefined;
    avatar_decoration_data: string | undefined;
    banner_color: string | undefined;
  }
  
  export interface Attachment {
    id: string;
    filename: string;
    size: number;
    url: string | undefined;
    proxy_url: string | undefined;
    width: number;
    height: number;
    content_type: string | undefined;
    content_scan_version: number;
    placeholder: string | undefined;
    placeholder_version: number;
  }
  
  export interface MessageReference {
    message_id: string;
    channel_id: string;
  }
  
  export interface Embed {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedThumbnail;
    video?: EmbedVideo;
    provider?: EmbedProvider;
    author?: EmbedAuthor;
    fields?: EmbedField[];
  }
  
  interface EmbedThumbnail {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  }
  
  interface EmbedVideo {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  }
  
  interface EmbedImage {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  }
  
  interface EmbedProvider {
    name?: string;
    url?: string;
  }
  
  interface EmbedAuthor {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
  }
  
  interface EmbedFooter {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
  }
  
  interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
  }
  
  export interface DiscordMessageAttachment {
    filename: string,
    id: string,
    uploaded_filename: string
  }
  
  export interface Message {
    id: string;
    type: number;
    content: string | undefined;
    channel_id: string;
    author: Author;
    attachments: Attachment[];
    embeds: Embed[];
    // TODO: mentions
    // TODO: mention_roles
    pinned: boolean;
    mentions_everyone: boolean;
    tts: boolean;
    timestamp: string;
    edited_timestamp: string | undefined;
    flags: number;
    message_reference: MessageReference | undefined;
    referenced_message: Message | undefined;
    // TODO: components
  }
  
  export interface DiscordFile {
    filename: string;
    file_size: number;
    id: string;
    is_clip: boolean;
  }
  
  export interface DiscordAttachment {
    id: number;
    upload_filename: string;
    upload_url: string;
  }

  export interface Recipient {
    id: string;
    username: string;
    global_name: string | undefined;
    avatar: string | undefined;
    avatar_decoration_data: string | undefined;
    descriminiator: string | undefined;
    public_flags: number;
  }
  
  export interface SharedChannel {
    id: string;
    type: number;
    last_message_id: string | undefined;
    flags: number;
    name: string | undefined;
  }
  
  export interface DmChannel extends SharedChannel {
    id: string;
    type: number;
    last_message_id: string;
    flags: number;
    recipients: Recipient[];
    name: string | undefined;
    icon: string | undefined;
    owner_id: string | undefined;
  }
  
  export interface Guild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[]
  }

  export interface PermissionOverwrite {
    id: string,
    type: number,
    allow: string,
    deny: string
  }
  
  export interface GuildChannel extends SharedChannel {
    id: string,
    type: number,
    last_message_id: string | undefined,
    flags: number,
    guild_id: string,
    name: string,
    parent_id: string | undefined,
    rate_limit_per_user: number | undefined,
    topic: string | undefined,
    position: number,
    permission_overwrites: PermissionOverwrite[],
    nsfw: boolean
  }
  
  export enum ChannelType {
    Normal = 0,
    Voice = 2,
    Parent = 4,
    News = 5,
  }
  
  export interface ChannelGroup {
    parent: GuildChannel | null,
    children: GuildChannel[]
  }

  export interface Role {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string | null; 
    unicode_emoji?: string | null;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: { 
    };
    flags: number;
      
}

export interface PublicUser {
    avatar: string | undefined;
    avatar_decoration_data: string | undefined;
    bot: boolean;
    discriminator: string | undefined;
    display_name: string | undefined;
    global_name: string | undefined;
    id: string,
    public_flags: number,
    username: string
}

  export interface GuildMember {
    avatar: string | undefined;
    communication_disabled_until: string | undefined;
    deaf: boolean;
    flags: number;
    joined_at: string | undefined;
    mute: boolean;
    nick: string | undefined;
    premium_since: string | undefined;
    roles: Role[],
    user: PublicUser
}

  export interface DetailedGuildInfo extends Guild {
    afk_channel_id: string | undefined;
    afk_timeout: number;
    application_command_counts: Map<number, number>;
    application_id: string | undefined;
    banner: string | undefined;
    channels: GuildChannel[];
    icon: string,
    id: string,
    members: GuildMember[];
    // TODO
}

export interface Author {
    id: string;
    username: string;
    avatar: string | undefined;
    discriminator: string | undefined;
    public_flags: number;
    premium_type: number;
    flags: number;
    banner: string | undefined;
    accent_color: string | undefined;
    global_name: string | undefined;
    avatar_decoration_data: string | undefined;
    banner_color: string | undefined;
  }
  
  export interface MessageReference {
    message_id: string;
    channel_id: string;
  }
  
  export interface Embed {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedThumbnail;
    video?: EmbedVideo;
    provider?: EmbedProvider;
    author?: EmbedAuthor;
    fields?: EmbedField[];
  }
  
  interface EmbedThumbnail {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  }
  
  interface EmbedVideo {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  }
  
  interface EmbedImage {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  }
  
  interface EmbedProvider {
    name?: string;
    url?: string;
  }
  
  interface EmbedAuthor {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
  }
  
  interface EmbedFooter {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
  }
  
  interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
  }
  
  export interface DiscordMessageAttachment {
    filename: string,
    id: string,
    uploaded_filename: string
  }
  
  export interface Message {
    id: string;
    type: number;
    content: string | undefined;
    channel_id: string;
    author: Author;
    attachments: Attachment[];
    embeds: Embed[];
    // TODO: mentions
    // TODO: mention_roles
    pinned: boolean;
    mentions_everyone: boolean;
    tts: boolean;
    timestamp: string;
    edited_timestamp: string | undefined;
    flags: number;
    message_reference: MessageReference | undefined;
    referenced_message: Message | undefined;
    // TODO: components
  }
  
  export interface DiscordFile {
    filename: string;
    file_size: number;
    id: string;
    is_clip: boolean;
  }

  export interface DiscordAttachment {
    id: number;
    upload_filename: string;
    upload_url: string;
  }

  export interface Activity {
    name: string;
    type?: number | undefined;
    state?: string | undefined;
    details?: string | undefined;
    startTimestamp?: number | undefined;
    endTimestamp?: number | undefined;
    largeImageKey?: string | undefined;
    largeImageText?: string | undefined;
    largeImageUrl?: string | undefined;
    cover_image?: string | undefined;
    smallImageKey?: string | undefined;
    smallImageText?: string | undefined;
    partyId?: string | undefined;
    partySize?: number | undefined;
    partyMax?: number | undefined;
    matchSecret?: string | undefined;
    spectateSecret?: string | undefined;
    joinSecret?: string | undefined;
    instance?: 0 | 1 | undefined;
  }
  
  export enum Status {
    Online = 'online',
    Idle = 'idle',
    DoNotDisturb = 'dnd',
    Offline = 'offline',
    Invisible = 'invisible',
  }

  export interface Presence {
    activities: Activity[],
    client_status: { desktop?: Status, web?: Status, mobile?: Status },
    last_modified: number,
    user: PublicUser
}

export interface ReadState {
    flags: number,
    id: string,
    last_message_id: string,
    last_pin_timestamp: string,
    mention_count: number
}

export interface Relationship {
    id: string,
    nickname?: string,
    since: Date,
    type: number,
    user: PublicUser
}

export interface Session {
    activities: Activity[],
    client_info: {
        version: number,
        os: string,
        client: string
    },
    session_id: string,
    status: Status
}

export interface SelfUser {
    accent_color: number | undefined;
    avatar: string | undefined;
    avatar_decoration_data: string | undefined;
    banner: string | undefined;
    banner_color: string | undefined;
    bio: string | undefined;
    desktop: boolean,
    discriminator: string | undefined;
    email: string | undefined;
    flags: number,
    global_name: string | undefined;
    id: string,
    mfa_enabled: boolean,
    mobile: boolean,
    nsfw_allowed: boolean,
    phone: string | undefined,
    premium: boolean,
    premium_type: number,
    pronouns: string,
    public_flags: number,
    purchased_flags: number,
    username: string,
    verified: boolean,
}

export interface UserGuildSetting {
    channel_overrides: ChannelOverride[],
    flags: number,
    guild_id?: string,
    hide_muted_channels: boolean,
    message_notifications: number,
    mobile_push: boolean,
    mute_config?: any,
    mute_scheduled_events: boolean,
    muted: boolean,
    notify_highlights: number,
    supress_everyone: false,
    supress_roles: false,
    version: number
}
 
export interface ChannelOverride {
    channel_id: string,
    collapsed: boolean,
    message_notifcations: number,
    mute_config?: any,
    muted: boolean
}

export interface GuildFolder {
    color?: string,
    guild_ids: string[],
    id?: string,
    name?: string
}

export interface UserSettings {
    activity_joining_restricted_guild_ids: any[],
    activity_restricted_guild_ids: any[],
    afk_timeout: number,
    allow_accessibility_detection: boolean,
    animate_emoji: boolean,
    animate_stickers: number,
    broadcast_allow_friends: boolean,
    broadcast_allowed_guild_ids: string[],
    broadcast_allowed_user_ids: string[],
    contact_sync_enabled: boolean,
    convert_emoticons: boolean,
    custom_status?: any,
    default_guilds_restricted: boolean,
    detect_plattform_accounts: boolean,
    developer_moce: boolean,
    disable_games_tab: boolean,
    enable_tts_command: boolean,
    explicit_content_filter: 1,
    friend_discovery_flags: number,
    friend_source_flags: { all: boolean }[],
    gif_auto_play: boolean,
    guild_folders: GuildFolder,
    inline_attachment_media: boolean,
    inline_embed_media: boolean,
    locale: string,
    message_display_compact: boolean,
    native_phone_integration_enabled: boolean,
    passwordless: boolean,
    render_embeds: boolean,
    render_reactions: boolean,
    restricted_guilds: any[],
    show_current_game: boolean,
    status: Status,
    stream_notifications_enabled: boolean,
    theme: string,
    timezone_offset: number,
    view_nsfw_commands: boolean,
    view_nsfw_guilds: boolean
}

export interface ReadyEvent {
    analytics_token: string,
    api_code_version: number,
    auth: {
        authenticator_types: any[]
    },
    auth_session_id_hash: string,
    connected_accounts: any[],
    consents: {
        personalization: {
            consented: boolean
        };
    },
    country_code: string,
    current_locations: string[],
    experiments: number[][],
    friend_usggestion_count: number,
    geo_ordered_rtc_regions: string[],
    guild_experiments: any[][],
    guild_joiun_requests: any[],
    guilds: Guild[],
    notes: { id: string, note: string }[],
    notification_settings: { flags: number },
    presences: Presence[],
    private_channels: DmChannel[],
    read_state: ReadState[],
    relationships: Relationship[],
    resume_gateway_url: string,
    session_id: string,
    session_type: string,
    sessions: Session[],
    tutorial?: any,
    user: SelfUser,
    user_guild_settings: UserGuildSetting[],
    user_settings: UserSettings,
    user_settings_proto: string,
    v: number,
    _trace: string[]
}

export interface Option {
  type: number,
  name: string,
  description: string,
  required: boolean,
  autocomplete: boolean,
  description_localized: string,
  name_localized: string
}

export interface ApplicationCommand {
  application_id: string,
  description: string | undefined,
  id: string,
  integration_types: number[],
  name: string,
  type: number,
  version: string,
  options: Option[]
}

export interface Application {
  bot: PublicUser,
  description: string,
  id: string,
  name: string
}

export interface ApplicationCommandResponse {
  application_commands: ApplicationCommand[],
  applications: Application[],
  version: string
}


export interface CommandInteractionData {
  type: number,
  application_id: string,
  guild_id: string,
  channel_id: string,
  session_id: string,
  data: {
    version: string,
    id: string,
    name: string,
    type: number,
    options: FilledOptions,
    application_command: {
      id: string,
      type: number,
      application_id: string,
      version: string,
      name: string,
      description: string,
      integration_types: number[],
      global_popularity_rank: number,
      options: Option[],
      description_localized: string,
      name_localized: string
    },
    attachments: any[]
  },
  nonce: string,
  analytics_location: string
}