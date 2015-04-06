import geocoder
import json

with open("assets/data/SportClubsForMe_LatLng_Split1.json") as file:
    data = json.load(file)

for club in data["clubdata"]:
    if 'lat' and 'lng' in club:
        continue

    try:
        g = geocoder.here(club["address"] + ", " + club["postcode"])
        if (g.error == None):
            club["lat"] = str(g.latlng.lat)
            club["lng"] = str(g.latlng.lng)
    except:
        print(club)

json_string = json.dumps(data)

with open("assets/data/SportClubsForMe_LatLng_Split2.json", "w") as output:
    output.write(json_string)