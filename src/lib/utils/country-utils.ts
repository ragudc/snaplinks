const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",   GB: "United Kingdom",  CA: "Canada",
  AU: "Australia",       DE: "Germany",         FR: "France",
  MX: "Mexico",          BR: "Brazil",          CO: "Colombia",
  AR: "Argentina",       ES: "Spain",           IT: "Italy",
  JP: "Japan",           KR: "South Korea",     IN: "India",
  CN: "China",           RU: "Russia",          NL: "Netherlands",
  SE: "Sweden",          NO: "Norway",          DK: "Denmark",
  FI: "Finland",         PL: "Poland",          PT: "Portugal",
  CH: "Switzerland",     AT: "Austria",         BE: "Belgium",
  CL: "Chile",           PE: "Peru",            VE: "Venezuela",
  EC: "Ecuador",         BO: "Bolivia",         PY: "Paraguay",
  UY: "Uruguay",         CR: "Costa Rica",      PA: "Panama",
  DO: "Dominican Rep.",  GT: "Guatemala",       HN: "Honduras",
  SV: "El Salvador",     NI: "Nicaragua",       ZA: "South Africa",
  NG: "Nigeria",         EG: "Egypt",           KE: "Kenya",
  NZ: "New Zealand",     SG: "Singapore",       MY: "Malaysia",
  ID: "Indonesia",       TH: "Thailand",        PH: "Philippines",
  VN: "Vietnam",         PK: "Pakistan",        BD: "Bangladesh",
  IL: "Israel",          SA: "Saudi Arabia",    AE: "UAE",
  TR: "Turkey",          UA: "Ukraine",         CZ: "Czech Republic",
  HU: "Hungary",         RO: "Romania",         GR: "Greece",
}

export const getCountryName = (code: string): string =>
  COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase()

export const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌐"
  try {
    return [...code.toUpperCase()].map(
      c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
    ).join("")
  } catch {
    return "🌐"
  }
}
