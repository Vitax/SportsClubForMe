import geocoder
import json

with open("assets/data/SportClubsForMe_Split.json") as file:
    data = json.load(file)

for club in data["clubdata"]:
    if 'lat' and 'lng' in club:
        continue

    try:
        g = geocoder.osm(club["address"] + ", " + club["postcode"])
        if (g.error == None):
            club["lat"] = str(g.latlng.lat)
            club["lng"] = str(g.latlng.lng)
    except:
        print(club)

json_string = json.dumps(data)

with open("assets/data/SportClubsForMe_Split.json", "w") as output:
    output.write(json_string)