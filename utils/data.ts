import { Translations } from "./translations";

export const reportOptions = [
  {
    Value: "FUEL_CONSUMED",
    Name: Translations.reports.acc2,
  },
  {
    Value: "ACC",
    Name: Translations.reports.engine,
  },
  {
    Value: "MILEAGE",
    Name: Translations.reports.fuelConsumed,
  },
  {
    Value: "ACC2",
    Name: Translations.reports.milage,
  },
  {
    Value: "MOVE",
    Name: Translations.reports.movement,
  },
  {
    Value: "STATIC",
    Name: Translations.reports.stationary,
  },
  {
    Value: "TOTAL_MILEAGE",
    Name: Translations.reports.totalMilage,
  },
];

export const timeZones = [
  {
    value: "-12_Dateline Standard Time",
    name: "(UTC-12:00) International Date Line West",
  },
  { value: "-10_Hawaiian Standard Time", name: "(UTC-10:00) Hawaii" },
  { value: "-9_Alaskan Standard Time", name: "(UTC-09:00) Alaska" },
  {
    value: "-8_Pacific Standard Time (Mexico)",
    name: "(UTC-08:00) Baja California",
  },
  {
    value: "-8_Pacific Standard Time",
    name: "(UTC-08:00) Pacific Time (US & Canada)",
  },
  { value: "-7_US Mountain Standard Time", name: "(UTC-07:00) Arizona" },
  {
    value: "-7_Mountain Standard Time (Mexico)",
    name: "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
  },
  {
    value: "-7_Mountain Standard Time",
    name: "(UTC-07:00) Mountain Time (US & Canada)",
  },
  {
    value: "-6_Central America Standard Time",
    name: "(UTC-06:00) Central America",
  },
  {
    value: "-6_Central Standard Time",
    name: "(UTC-06:00) Central Time (US & Canada)",
  },
  {
    value: "-6_Central Standard Time (Mexico)",
    name: "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
  },
  {
    value: "-6_Canada Central Standard Time",
    name: "(UTC-06:00) Saskatchewan",
  },
  {
    value: "-5_SA Pacific Standard Time",
    name: "(UTC-05:00) Bogota, Lima, Quito, Rio Branco",
  },
  {
    value: "-5_Eastern Standard Time",
    name: "(UTC-05:00) Eastern Time (US & Canada)",
  },
  { value: "-5_US Eastern Standard Time", name: "(UTC-05:00) Indiana (East)" },
  { value: "-4.5_Venezuela Standard Time", name: "(UTC-04:30) Caracas" },
  { value: "-4_Paraguay Standard Time", name: "(UTC-04:00) Asuncion" },
  {
    value: "-4_Atlantic Standard Time",
    name: "(UTC-04:00) Atlantic Time (Canada)",
  },
  { value: "-4_Central Brazilian Standard Time", name: "(UTC-04:00) Cuiaba" },
  {
    value: "-4_SA Western Standard Time",
    name: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
  },
  { value: "-4_Pacific SA Standard Time", name: "(UTC-04:00) Santiago" },
  {
    value: "-3.5_Newfoundland Standard Time",
    name: "(UTC-03:30) Newfoundland",
  },
  { value: "-3_E. South America Standard Time", name: "(UTC-03:00) Brasilia" },
  { value: "-3_Argentina Standard Time", name: "(UTC-03:00) Buenos Aires" },
  {
    value: "-3_SA Eastern Standard Time",
    name: "(UTC-03:00) Cayenne, Fortaleza",
  },
  { value: "-3_Greenland Standard Time", name: "(UTC-03:00) Greenland" },
  { value: "-3_Montevideo Standard Time", name: "(UTC-03:00) Montevideo" },
  { value: "-3_Bahia Standard Time", name: "(UTC-03:00) Salvador" },
  {
    value: "-2_Mid-Atlantic Standard Time",
    name: "(UTC-02:00) Mid-Atlantic - Old",
  },
  { value: "-1_Azores Standard Time", name: "(UTC-01:00) Azores" },
  { value: "-1_Cape Verde Standard Time", name: "(UTC-01:00) Cape Verde Is." },
  { value: "0_Morocco Standard Time", name: "(UTC) Casablanca" },
  { value: "0_UTC", name: "(UTC) Coordinated Universal Time" },
  {
    value: "0_GMT Standard Time",
    name: "(UTC) Dublin, Edinburgh, Lisbon, London",
  },
  { value: "0_Greenwich Standard Time", name: "(UTC) Monrovia, Reykjavik" },
  {
    value: "1_W. Europe Standard Time",
    name: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
  },
  {
    value: "1_Central Europe Standard Time",
    name: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
  },
  {
    value: "1_Romance Standard Time",
    name: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
  },
  {
    value: "1_Central European Standard Time",
    name: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
  },
  {
    value: "1_W. Central Africa Standard Time",
    name: "(UTC+01:00) West Central Africa",
  },
  { value: "1_Namibia Standard Time", name: "(UTC+01:00) Windhoek" },
  { value: "2_Jordan Standard Time", name: "(UTC+02:00) Amman" },
  { value: "2_GTB Standard Time", name: "(UTC+02:00) Athens, Bucharest" },
  { value: "2_Middle East Standard Time", name: "(UTC+02:00) Beirut" },
  { value: "2_Egypt Standard Time", name: "(UTC+02:00) Cairo" },
  { value: "2_Syria Standard Time", name: "(UTC+02:00) Damascus" },
  { value: "2_E. Europe Standard Time", name: "(UTC+02:00) E. Europe" },
  {
    value: "2_South Africa Standard Time",
    name: "(UTC+02:00) Harare, Pretoria",
  },
  {
    value: "2_FLE Standard Time",
    name: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
  },
  { value: "2_Turkey Standard Time", name: "(UTC+02:00) Istanbul" },
  { value: "2_Israel Standard Time", name: "(UTC+02:00) Jerusalem" },
  { value: "2_Libya Standard Time", name: "(UTC+02:00) Tripoli" },
  { value: "3_Arabic Standard Time", name: "(UTC+03:00) Baghdad" },
  {
    value: "3_Kaliningrad Standard Time",
    name: "(UTC+03:00) Kaliningrad, Minsk",
  },
  { value: "3_Arab Standard Time", name: "(UTC+03:00) Kuwait, Riyadh" },
  { value: "3_E. Africa Standard Time", name: "(UTC+03:00) Nairobi" },
  { value: "3.5_Iran Standard Time", name: "(UTC+03:30) Tehran" },
  { value: "4_Arabian Standard Time", name: "(UTC+04:00) Abu Dhabi, Muscat" },
  { value: "4_Azerbaijan Standard Time", name: "(UTC+04:00) Baku" },
  {
    value: "4_Russian Standard Time",
    name: "(UTC+04:00) Moscow, St. Petersburg, Volgograd",
  },
  { value: "4_Mauritius Standard Time", name: "(UTC+04:00) Port Louis" },
  { value: "4_Georgian Standard Time", name: "(UTC+04:00) Tbilisi" },
  { value: "4_Caucasus Standard Time", name: "(UTC+04:00) Yerevan" },
  { value: "4.5_Afghanistan Standard Time", name: "(UTC+04:30) Kabul" },
  {
    value: "5_West Asia Standard Time",
    name: "(UTC+05:00) Ashgabat, Tashkent",
  },
  { value: "5_Pakistan Standard Time", name: "(UTC+05:00) Islamabad, Karachi" },
  {
    value: "5.5_India Standard Time",
    name: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
  },
  {
    value: "5.5_Sri Lanka Standard Time",
    name: "(UTC+05:30) Sri Jayawardenepura",
  },
  { value: "5.75_Nepal Standard Time", name: "(UTC+05:45) Kathmandu" },
  { value: "6_Central Asia Standard Time", name: "(UTC+06:00) Astana" },
  { value: "6_Bangladesh Standard Time", name: "(UTC+06:00) Dhaka" },
  { value: "6_Ekaterinburg Standard Time", name: "(UTC+06:00) Ekaterinburg" },
  { value: "6.5_Myanmar Standard Time", name: "(UTC+06:30) Yangon (Rangoon)" },
  {
    value: "7_SE Asia Standard Time",
    name: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
  },
  { value: "7_N. Central Asia Standard Time", name: "(UTC+07:00) Novosibirsk" },
  {
    value: "8_China Standard Time",
    name: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
  },
  { value: "8_North Asia Standard Time", name: "(UTC+08:00) Krasnoyarsk" },
  {
    value: "8_Singapore Standard Time",
    name: "(UTC+08:00) Kuala Lumpur, Singapore",
  },
  { value: "8_W. Australia Standard Time", name: "(UTC+08:00) Perth" },
  { value: "8_Taipei Standard Time", name: "(UTC+08:00) Taipei" },
  { value: "8_Ulaanbaatar Standard Time", name: "(UTC+08:00) Ulaanbaatar" },
  { value: "9_North Asia East Standard Time", name: "(UTC+09:00) Irkutsk" },
  { value: "9_Tokyo Standard Time", name: "(UTC+09:00) Osaka, Sapporo, Tokyo" },
  { value: "9_Korea Standard Time", name: "(UTC+09:00) Seoul" },
  { value: "9.5_Cen. Australia Standard Time", name: "(UTC+09:30) Adelaide" },
  { value: "9.5_AUS Central Standard Time", name: "(UTC+09:30) Darwin" },
  { value: "10_E. Australia Standard Time", name: "(UTC+10:00) Brisbane" },
  {
    value: "10_AUS Eastern Standard Time",
    name: "(UTC+10:00) Canberra, Melbourne, Sydney",
  },
  {
    value: "10_West Pacific Standard Time",
    name: "(UTC+10:00) Guam, Port Moresby",
  },
  { value: "10_Tasmania Standard Time", name: "(UTC+10:00) Hobart" },
  { value: "10_Yakutsk Standard Time", name: "(UTC+10:00) Yakutsk" },
  {
    value: "11_Central Pacific Standard Time",
    name: "(UTC+11:00) Solomon Is., New Caledonia",
  },
  { value: "11_Vladivostok Standard Time", name: "(UTC+11:00) Vladivostok" },
  {
    value: "12_New Zealand Standard Time",
    name: "(UTC+12:00) Auckland, Wellington",
  },
  { value: "12_Fiji Standard Time", name: "(UTC+12:00) Fiji" },
  { value: "12_Magadan Standard Time", name: "(UTC+12:00) Magadan" },
  {
    value: "12_Kamchatka Standard Time",
    name: "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
  },
  { value: "13_Tonga Standard Time", name: "(UTC+13:00) Nuku'alofa" },
  { value: "13_Samoa Standard Time", name: "(UTC+13:00) Samoa" },
];
