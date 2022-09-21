import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  internalServerErrorResult,
  noContentResult,
  okResult,
} from '../data/api-responses.models';
import { OpportunityModel } from '../data/opportunity';
import { Opportunity } from '../data/salesforce.models';

const httpTrigger: AzureFunction = async function (
  context: Context,
  _: HttpRequest
): Promise<void> {
  try {
    const mongooseClient = await MongooseClient.createClassAsync();
    const opportunities = await mongooseClient.getAync<Opportunity>(
      OpportunityModel
    );
    if (opportunities?.length != null && opportunities.length > 0) {
      context.res = okResult(
        'Success in retrieving opportunities',
        opportunities
      );
      return;
    }
    context.res = noContentResult();
  } catch (e) {
    context.log.error('Opportunities function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
