# Copart yard locations

Every Copart auction yard in the United States and Canada (217 yards, 55 states and provinces) with address, phone, hours, time zone and GPS coordinates. Fetched 26 Sep 2026.

| File | What it is |
| --- | --- |
| `copart_locations.csv` | One row per yard. Open in Excel / Google Sheets. |
| `copart_locations.json` | Same rows as JSON, handy for loading into a FlatList. |
| `copart_yard_map.html` | Interactive map. Open it in a browser: zoom, search, filter by state, click a dot for details. |
| `fetch_copart_locations.py` | Script that regenerates the CSV and JSON. Comments inside explain each step. |

**Source.** copart.com blocks automated requests, so the data comes from carproxy.com, which republishes Copart's own yard records (the same yard numbers Copart uses) on one page per state. International yards (UK, Germany, Spain, Ireland, UAE, Bahrain, Oman, Brazil, Finland) are not included.

**CSV columns.** `yard_number, yard_name, address, city, state, state_name, zip, country, phone, hours, time_zone, latitude, longitude`
