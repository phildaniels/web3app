export interface SalesForceAccessTokenResponse {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
}

export interface RecentOpportunityResponse {
  ids: string[];
  latestDateCovered: string;
}

export interface Opportunity {
  attributes: Attributes;
  Id: string;
  IsDeleted: boolean;
  AccountId: string;
  RecordTypeId: any;
  Name: string;
  Description: any;
  StageName: string;
  Amount: any;
  Probability: number;
  CloseDate: string;
  Type: string;
  NextStep: any;
  LeadSource: any;
  IsClosed: boolean;
  IsWon: boolean;
  ForecastCategory: string;
  ForecastCategoryName: string;
  CurrencyIsoCode: string;
  CampaignId: any;
  HasOpportunityLineItem: boolean;
  Pricebook2Id: string;
  OwnerId: string;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  LastActivityDate: any;
  PushCount: number;
  LastStageChangeDate: any;
  FiscalQuarter: number;
  FiscalYear: number;
  Fiscal: string;
  ContactId: any;
  LastViewedDate: string;
  LastReferencedDate: string;
  SyncedQuoteId: any;
  ContractId: any;
  HasOpenActivity: boolean;
  HasOverdueTask: boolean;
  LastAmountChangedHistoryId: any;
  LastCloseDateChangedHistoryId: any;
  Budget_Confirmed__c: boolean;
  Discovery_Completed__c: boolean;
  ROI_Analysis_Completed__c: boolean;
  Add_Account_Team_to_Opportunity__c: boolean;
  Loss_Reason__c: any;
  Bill_To_Account__c: any;
  Budget_Alignment__c: any;
  Budget__c: any;
  COU__c: string;
  Campaign_Custom__c: any;
  Competitive_Situation__c: any;
  Competitor__c: any;
  Credit_Limit__c: number;
  Credit_Profile__c: any;
  Credit_Status__c: string;
  Customer_PO_Number__c: any;
  Demand_Generator__c: any;
  Employee_Referral__c: any;
  External_Id__c: any;
  FieldPlus_Contact__c: any;
  Field_Services_Category__c: any;
  Forecast_Category__c: string;
  Invoice_Delivery_Method__c: any;
  Legacy_App__c: any;
  Legal_Entity__c: any;
  Likelihood_to_Close__c: any;
  MSA_Agreement_Flag__c: boolean;
  Oracle_Order_Number__c: any;
  Oracle_Quote_Number__c: any;
  Order_Amount__c: any;
  Order_Booked_Date__c: any;
  Order_Status__c: any;
  PO_Document_Link__c: any;
  Probability_Forecast__c: number;
  Quote_Status__c: any;
  Renewal_Status__c: any;
  Sub_COU__c: string;
  Timeline__c: any;
  Topic__c: any;
  Value_Proposition__c: any;
  Weighted_Amount__c: number;
  Win_Strategy__c: any;
  Agreement_Number__c: any;
  Contract_Template__c: any;
  Interest__c: any;
  Legacy_Owner__c: any;
  Legacy_Referral__c: any;
  Opportunity_Number__c: string;
  Sno__c: string;
  Opportunity_Age__c: number;
  cafsl__Data_Set_Exclude_List__c: any;
  Alternate_Campaign__c: any;
  Auto_Renewal__c: boolean;
  Billable_Expenses__c: boolean;
  Contract_End_Date__c: any;
  Contract_Start_Date__c: any;
  Contract_Term__c: any;
  Converted_From_Lead__c: boolean;
  Created_by_Field_Services__c: boolean;
  Impartiality_Error_Message__c: any;
  Legacy_Employee__c: any;
  Legacy_Opportunity_Owner_Name__c: any;
  Legal_Entity_Active_for_CPQ__c: boolean;
  Oracle_EBS_Quote_Number__c: any;
  Oracle_EBS_Quote_Status__c: any;
  Originating_Opportunity__c: any;
  SOW_Required__c: any;
  Count_of_Renewable_Products__c: number;
  Count_of_Trackable_Assets__c: number;
  Amount_Credit_Check__c: any;
  Account_Owner_is_Active__c: boolean;
}

export interface Attributes {
  type: string;
  url: string;
}

export interface ObjectDescribe {
  activateable: boolean;
  associateEntityType: any;
  associateParentEntity: any;
  createable: boolean;
  custom: boolean;
  customSetting: boolean;
  deepCloneable: boolean;
  deletable: boolean;
  deprecatedAndHidden: boolean;
  feedEnabled: boolean;
  hasSubtypes: boolean;
  isInterface: boolean;
  isSubtype: boolean;
  keyPrefix: string;
  label: string;
  labelPlural: string;
  layoutable: boolean;
  mergeable: boolean;
  mruEnabled: boolean;
  name: string;
  queryable: boolean;
  replicateable: boolean;
  retrieveable: boolean;
  searchable: boolean;
  triggerable: boolean;
  undeletable: boolean;
  updateable: boolean;
  urls: Urls;
}

export interface Urls {
  compactLayouts: string;
  rowTemplate: string;
  approvalLayouts: string;
  listviews: string;
  describe: string;
  quickActions: string;
  layouts: string;
  sobject: string;
}

export interface RecentItem {
  attributes: Attributes;
  Id: string;
  Name: string;
}

export interface Attributes {
  type: string;
  url: string;
}
