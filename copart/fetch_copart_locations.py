"""
fetch_copart_locations.py
-------------------------
Re-downloads the list of Copart auction yards (US + Canada) and rewrites
copart_locations.csv / copart_locations.json in this folder.

HOW IT WORKS
  copart.com itself sits behind a bot-blocker, so we can't read it directly.
  carproxy.com republishes Copart's own yard records on one page per state
  (https://carproxy.com/locations/<state-slug>). Those pages are built with
  Next.js, which embeds the page data as JSON inside a
  <script id="__NEXT_DATA__"> tag. We read that JSON instead of scraping HTML.

HOW TO RUN
  python3 fetch_copart_locations.py
  (needs only the Python standard library, no pip installs)

WHAT TO CHANGE
  - FIELDS below controls which columns end up in the CSV and their order.
  - If carproxy renames a key, fix it in the `row()` function.
"""
import csv, json, re, time, urllib.request

INDEX_URL = "https://carproxy.com/locations/copart"        # page that links to every state
UA = {"User-Agent": "Mozilla/5.0"}                          # plain requests get a 403 without this

# Column order for the CSV. Rename or reorder here and the CSV follows.
FIELDS = ["yard_number", "yard_name", "address", "city", "state", "state_name",
          "zip", "country", "phone", "hours", "time_zone", "latitude", "longitude"]


def get(url):
    """Download a page as text (with a small retry so a hiccup doesn't kill the run)."""
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return r.read().decode("utf-8")
        except Exception as e:                      # noqa: BLE001 - we just want to retry
            print(f"  retry {attempt + 1} for {url}: {e}")
            time.sleep(2)
    raise RuntimeError(f"could not fetch {url}")


def next_data(html):
    """Pull the JSON blob Next.js embeds in every page."""
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    return json.loads(m.group(1))


def row(y):
    """Turn one raw Copart yard record into the flat row we want in the CSV."""
    area, num = y.get("yard_phone_area_code") or "", str(y.get("yard_phone_number") or "")
    phone = f"{area}-{num[:3]}-{num[3:]}" if len(num) == 7 and area else f"{area} {num}".strip()
    zipcode = (y.get("yard_zip") or "").strip()
    if y["yard_country_code"] == "USA" and " " in zipcode:        # "80125 9741" -> "80125-9741"
        zipcode = zipcode.replace(" ", "-")
    hours = f"{y['yard_begin_day']}-{y['yard_end_day']} {y['yard_hours']}" if y.get("yard_hours") else ""
    return {
        "yard_number": y["yard_number"],
        "yard_name": y["yard_name"],
        "address": (y["yard_address_1"] + (" " + y["yard_address_2"] if y.get("yard_address_2") else "")).strip(),
        "city": y["yard_city"],
        "state": y["yard_state_code"],
        "state_name": y["yard_state_name"],
        "zip": zipcode,
        "country": {"USA": "United States", "CAN": "Canada"}.get(y["yard_country_code"], y["yard_country_code"]),
        "phone": phone,
        "hours": hours,
        "time_zone": y.get("time_zone", ""),
        "latitude": round(float(y["yard_latitude"]), 6),
        "longitude": round(float(y["yard_longitude"]), 6),
    }


def main():
    # 1. find every state/province page linked from the index
    slugs = sorted(set(re.findall(r'href="/locations/([a-z\-]+)"', get(INDEX_URL))) - {"copart"})
    print(f"{len(slugs)} state/province pages")

    # 2. read the yard list off each page; key by yard number so duplicates collapse
    yards = {}
    for slug in slugs:
        locs = next_data(get(f"https://carproxy.com/locations/{slug}"))["props"]["pageProps"].get("locations", [])
        for y in locs:
            yards[y["yard_number"]] = row(y)
        print(f"  {slug}: {len(locs)}")

    # 3. sort by country > state > name and write both files
    rows = sorted(yards.values(), key=lambda r: (r["country"], r["state"], r["yard_name"]))
    with open("copart_locations.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    with open("copart_locations.json", "w") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"wrote {len(rows)} yards")


if __name__ == "__main__":
    main()
