import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GBFSSystemDocument = HydratedDocument<GBFSSystemClass>;

@Schema({ collection: 'gbfs-systems' })
export class GBFSSystemClass {
  @Prop({ required: true, unique: true })
  systemId: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  autoDiscoveryUrl: string;

  @Prop()
  authenticationInfo?: string;
}

export const GBFSSystemSchema = SchemaFactory.createForClass(GBFSSystemClass);
