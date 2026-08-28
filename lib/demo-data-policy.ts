export const syntheticDemoCandidateIds = ['elena', 'anton', 'maria'] as const;

export const demoDataPolicy = {
  classification: 'SYNTHETIC_FICTIONAL_DEMO',
  representsRealPeople: false,
  representsRealApplicants: false,
  representsRealEmployees: false,
  representsRealEmployers: false,
  productionPersonalData: false,
  externalIdentityBindingAllowed: false,
  purpose: 'UI_AND_PROTOCOL_DEMONSTRATION_ONLY',
} as const;

export type SyntheticDemoCandidateId = (typeof syntheticDemoCandidateIds)[number];
