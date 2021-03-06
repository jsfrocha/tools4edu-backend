import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}