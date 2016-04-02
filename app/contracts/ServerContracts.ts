import {Entity} from "./DataContracts";

export interface PostEntity {
    Date: string;
    CardStyle: string;
    Heading: string;
    Snippet: string;
    OriginalLink: string;
}

export interface ImageEntity {
    Url: string;
    Tags: string[];
}

export interface DbImage extends ImageEntity {
    Id: string;
    Width: string;
    Height: string;
}

export interface PostPreview extends PostEntity {
    ImagesFromDb: DbImage[];
    Images: string[];
}

export interface UnpublishedPost extends PostableEntity {
    Image: ImageEntity;
}

export interface PostableEntity extends PostEntity {
    Streams: string[];
    Tags: string[];
    Language: string;
    PostedBy: string;
}

export interface PublishedPost extends PostableEntity {
    Id: string;
    ImageUrl: string;
    CreatedTime: any;
    SharedBy: string[];
    LikedBy: string[];
}


export interface User extends Entity {
    Email: string;
    Language: string;
    Name: string;
    ProfileImage: string;
    CanPost: boolean;
    Streams: string[];
}
