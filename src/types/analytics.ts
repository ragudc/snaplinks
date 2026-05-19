import type { DeviceType } from "@/types/link"

export interface ClicksByHour {
  hour:   number
  clicks: number
}

export interface ClicksByCountry {
  country:    string
  clicks:     number
  percentage: number
}

export interface ClicksByDevice {
  device:     DeviceType
  clicks:     number
  percentage: number
}

export interface DailyClicks {
  date:   string
  clicks: number
}

export interface LinkAnalyticsResponse {
  linkId:       string
  totalClicks:  number
  clicks24h:    number
  clicks7d:     number
  clicks30d:    number
  clicksByHour: ClicksByHour[]
  clicksByDay:  DailyClicks[]
  topCountries: ClicksByCountry[]
  byDevice:     ClicksByDevice[]
}
