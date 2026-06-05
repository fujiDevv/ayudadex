export interface Hotline {
  agency: string
  number: string
  purpose: string
  email: string
}

export const hotlines: Hotline[] = [
  {
    agency: 'DSWD (Dept. of Social Welfare & Dev.)',
    number: '(02) 8931-8101 to 07 / Hotline 8888',
    purpose: 'Crisis relief, financial aid, indigent reports',
    email: 'inquiry@dswd.gov.ph / ciu.co@dswd.gov.ph'
  },
  {
    agency: 'SSS (Social Security System)',
    number: '1455',
    purpose: 'Private sector pension, unemployment, sickness claims',
    email: 'usssaptayo@sss.gov.ph'
  },
  {
    agency: 'PhilHealth (Philippine Health Insurance Corp.)',
    number: '(02) 8662-2588 / Smart: 0998-857-2957 / Globe: 0917-127-5987',
    purpose: 'Hospital coverage, medical benefits support',
    email: 'actioncenter@philhealth.gov.ph'
  },
  {
    agency: 'Pag-IBIG Fund (HDMF)',
    number: '(02) 8724-4244 / *4363 (Mobile Shortcode)',
    purpose: 'Housing loans, multi-purpose loans, savings programs',
    email: 'contactus@pagibigfund.gov.ph'
  },
  {
    agency: 'GSIS (Government Service Insurance System)',
    number: '(02) 8847-4747 / Toll-Free: 1-800-8-847-4747 (Globe/TM) / 1-800-10-847-4747 (Smart/TNT)',
    purpose: 'Public sector pensions, calamity & policy loans',
    email: 'gsiscares@gsis.gov.ph'
  },
  {
    agency: 'DOLE (Department of Labor & Employment)',
    number: '1349 (Toll-Free Hotline)',
    purpose: 'Employment issues, TUPAD claims, labor grievances',
    email: 'osec@dole.gov.ph'
  },
  {
    agency: 'DOH (Department of Health)',
    number: '(02) 8651-7800',
    purpose: 'Malasakit Centers medical assistance, primary health policies',
    email: 'callcenter@doh.gov.ph'
  },
  {
    agency: 'OWWA (Overseas Workers Welfare Admin.)',
    number: '1348 (Toll-Free) / (+632) 1348',
    purpose: 'OFW scholarship, repatriation, and livelihood programs',
    email: 'opcenter@owwa.gov.ph'
  }
]

export const audienceTags = [
  'All Citizens', 'Indigent', 'Low Income', 'Employed', 'Unemployed', 'Seniors', 'Students', 'Mothers', 'Pregnant', 'OFW', 'Government Employees'
]