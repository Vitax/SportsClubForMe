import geocoder
import json

with open("SportClubForMe_Geocodes.json") as file:
    data = json.load(file)

for club in data["clubdata"]:
    if 'latlng' not in club:
        continue

    #(52.511261, 13.4121599)
    s = club['latlng']
    n = len(s)
    s = s[1:n-1]#removing first and last char
    lat, lng = s.split(', ')
    lat = float(lat)
    lng = float(lng)

    club['position'] = {
        'lat': lat,
        'lng': lng
    }

json_string = json.dumps(data)

with open("SportClubForMe_LatLng.json", "w") as output:
    output.write(json_string)