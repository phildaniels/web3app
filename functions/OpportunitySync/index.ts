import { AzureFunction, Context } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import { SalesForceClient } from '../clients/salesforce.client';
import * as _ from 'lodash';
import { CosmosOpportunity, OpportunityModel } from '../data/opportunity';

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  try {
    const salesforceClient = await SalesForceClient.createClassAsync();
    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() - 29);
    end.setDate(end.getDate() + 1);
    const opportunityIds =
      await salesforceClient.getUpdateOpportunityIdsInRange(start, end);
    const opportunities = (
      await Promise.all(
        opportunityIds.map((opportunityId) =>
          salesforceClient.getOpportunity(opportunityId)
        )
      )
    ).filter((opportunity) => opportunity != null);
    const mongooseClient = await MongooseClient.createClassAsync();
    const existingOpportunities =
      await mongooseClient.getAync<CosmosOpportunity>(OpportunityModel, {
        Id: { $in: opportunityIds },
      });
    const existingOpportunityIds = existingOpportunities.map(
      (existingOpportunity) => existingOpportunity.Id
    );
    const newOpportunityIds = opportunityIds.filter(
      (opportunityId) => !existingOpportunityIds.includes(opportunityId)
    );
    const cosmosOpportunities = opportunities
      .filter((opportunity) =>
        newOpportunityIds.includes(opportunity?.Id ?? '')
      )
      .map((newOpportunity) =>
        _.merge(newOpportunity, {
          createdOn: new Date(),
          updatedOn: new Date(),
        })
      );
    if (!(cosmosOpportunities?.length ?? 0 > 0)) {
      return;
    }
    await mongooseClient.createManyAsync(OpportunityModel, cosmosOpportunities);
  } catch (e) {
    context.log(e);
  }
};

export default timerTrigger;
