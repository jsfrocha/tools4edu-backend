import { Faq, FaqInputCreate, FaqInputUpdate } from './models/faq.model';
import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { FaqsService } from './faqs.service';
import { StakeholdersService } from '../stakeholders/stakeholders.service';
import { Stakeholder } from '../stakeholders/models/stakeholder.model';
import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../auth/auth.guard';
import { Provider } from '../providers/models/provider.model';
import { ProvidersService } from '../providers/providers.service';

function getFilterQuery(stakeholderIds, providerIds) {
  let query = {};

  if (stakeholderIds)
    query = Object.assign({}, query, { stakeholder: { $in: stakeholderIds.map(s => Types.ObjectId(s)) } });

  if (providerIds)
    query = Object.assign({}, query, { provider: { $in: providerIds.map(p => Types.ObjectId(p)) } });

  return query;
}

@Resolver(of => Faq)
export class FaqsResolver {
  constructor(
    private faqsService: FaqsService,
    private stakeholdersService: StakeholdersService,
    private providersService: ProvidersService
  ) {}

  @Query(returns => Faq)
  async faq(
    @Args('id', { type: () => ID }) id: string
  ) {
    return this.faqsService.findOne(id)
  }

  @Query(returns => [Faq])
  async faqs(
    @Args('stakeholderIds', { type: () => [String], nullable: true }) stakeholdersIds: string[],
    @Args('providerIds', { type: () => [String], nullable: true }) providerIds: string[],
    @Args('limit', { nullable: true }) limit: number,
    @Args('startAt', { nullable: true }) startAt: number
  ) {
    const query = getFilterQuery(
      stakeholdersIds,
      providerIds
    );

    return this.faqsService.findAll(query, limit, startAt);
  }

  @Query(() => Int, { nullable: true })
  async faqTotalCount(
    @Args('stakeholderIds', { type: () => [String], nullable: true }) stakeholderIds: string,
    @Args('providerIds', { type: () => [String], nullable: true }) providerIds: string
  ) {
    const query = getFilterQuery(
      stakeholderIds,
      providerIds
    );

    return this.faqsService.countDocs(query)
  }

  @ResolveField('stakeholder', type => Stakeholder, { nullable: true })
  async resolveStakeholder(@Parent() faq: Faq) {
    if (faq.stakeholder) {
      return this.stakeholdersService.findOneByQuery({_id: faq.stakeholder})
    } else {
      return null;
    }
  }

  @ResolveField('provider', type => Provider, { nullable: true })
  async resolveProvider(@Parent() faq: Faq) {
    if (faq.provider) {
      return this.providersService.findOneByQuery({_id: faq.provider})
    } else {
      return null;
    }

  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(returns => Faq, { nullable: true })
  async faqCreate(
    @Args('input') faqInputCreate: FaqInputCreate
  ) {
    return this.faqsService.create(faqInputCreate)
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(returns => Faq, { nullable: true })
  async faqUpdate(
    @Args('id') id: string,
    @Args('input') faqInputUpdate: FaqInputUpdate
  ) {
    return this.faqsService.update(id, faqInputUpdate)
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(returns => Faq, { nullable: true })
  async faqDelete(
    @Args('id') id: string
  ) {
    return this.faqsService.delete(id)
  }
}
