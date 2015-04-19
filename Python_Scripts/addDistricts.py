import geocoder
import json

with open('/home/caglar/WebStormProjects/SportsClubForMe/assets/data/SportClubForMe_Districts.json') as file:
    data = json.load(file)

for club in data["clubdata"]:
    if 'district' in club:
        continue

    try:
        g = geocoder.osm(club["address"] + ", " + club["postcode"])
        if (g.error == None):
            club["district"] = str(g.city_district)
    except:
        print(club)

json_string = json.dumps(data)

with open('/home/caglar/WebStormProjects/SportsClubForMe/assets/data/SportClubForMe_Districts2.json', "w") as output:
    output.write(json_string)