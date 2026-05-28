export interface Hotline {
  agency: string
  number: string
  purpose: string
  email: string
}

export const hotlines: Hotline[] = [
  { agency: 'DSWD (Dept. of Social Welfare & Dev.)', number: '(02) 8931-8101 to 07 / Hotline 8888', purpose: 'Crisis relief, financial aid, indigent reports', email: 'ciu.co@dswd.gov.ph' },
  { agency: 'SSS (Social Security System)', number: '1455 / (02) 81455 (Toll-Free)', purpose: 'Private sector pension, unemployment, sickness claims', email: 'member_relations@sss.gov.ph' },
  { agency: 'PhilHealth (Philippine Health Insurance Corp.)', number: '(02) 8441-7442 / Callback: 0917-512-9149', purpose: 'Hospital coverage, medical benefits support', email: 'actioncenter@philhealth.gov.ph' },
  { agency: 'Pag-IBIG Fund (HDMF)', number: '(02) 8802-4630 (24/7 Call Center)', purpose: 'Housing loans, multi-purpose loans, savings programs', email: 'contactus@pagibigfund.gov.ph' },
  { agency: 'GSIS (Government Service Insurance System)', number: '(02) 8847-4747 / 1-800-8-847-4747', purpose: 'Public sector pensions, calamity & policy loans', email: 'gsiscares@gsis.gov.ph' },
  { agency: 'DOLE (Department of Labor & Employment)', number: '1349 (Toll-Free Hotline)', purpose: 'Employment issues, TUPAD claims, labor grievances', email: 'dolecallcenter@gmail.com' },
  { agency: 'DOH (Department of Health)', number: '(02) 8651-7800', purpose: 'Malasakit Centers medical assistance, primary health policies', email: 'callcenter@doh.gov.ph' },
  { agency: 'OWWA (Overseas Workers Welfare Admin.)', number: '1348 (Toll-Free) / (+632) 1348', purpose: 'OFW scholarship, repatriation, and livelihood programs', email: 'opcenter@owwa.gov.ph' }
]

export const audienceTags = [
  'All Citizens', 'Indigent', 'Low Income', 'Employed', 'Unemployed', 'Seniors', 'Students', 'Mothers', 'Pregnant', 'OFW', 'Government Employees'
]
