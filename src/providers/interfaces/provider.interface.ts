import { Document } from 'mongoose';
import { Video } from '../../videos/interfaces/video.interface';

export interface Provider extends Document {
  readonly order: number;
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly videos: Video[]
}