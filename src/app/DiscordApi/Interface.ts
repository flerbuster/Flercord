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

  interface Recipient {
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