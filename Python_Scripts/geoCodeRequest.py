import geocoder
import json

with open("assets/data/SportClubForMe_Data.json") as file:
    data = json.load(file)

for club in data["clubdata"]:
    if 'latlng' in club:
        continue

    try:
        g = geocoder.bing(club["address"] + ", " + club["postcode"])
        if (g.error == None):
            club["lat"] = str(g.latlng.lat)
            club["lng"] = str(g.latlng.lng)
    except:
        print(club)

json_string = json.dumps(data)

with open("assets/data/SportClubForMe_LatLng_Split2.json", "w") as output:
    output.write(json_string)