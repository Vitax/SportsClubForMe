charlottenburg_wilmersdorf = [10585, 10587, 10589, 10623, 10625, 10627, 10629, 10707, 10709, 10711, 10713, 10715, 10717, 10719, 10777, 13627, 14050, 14052, 14053, 14055, 14057, 14059, 14193, 14197, 14199];
friedrichshain_kreuzberg = [10178, 10179, 10243, 10245, 10247, 10249, 10317, 10961, 10963, 10965, 10967, 10969, 10997,   10999];
lichtenberg = [10315, 10317, 10318, 10319, 10365, 10367, 10369, 13051, 13053, 13055, 13057, 13059];
mitte =     [10115, 10117, 10119, 10178, 10179, 10551, 10553, 10555, 10557, 10559, 10785, 10787, 13347, 13349, 13351,  13353, 13355, 13357, 13359, 13407, 13409];
marzahn_hellersdorf = [12619, 12621, 12623, 12627, 12629, 12679, 12681, 12683, 12685, 12687, 12689];
neukoelln = [12043, 12045, 12047, 12049, 12051, 12053, 12055, 12057, 12059, 12347, 12349, 12351, 12353, 12355, 12357, 12359];
pankow = [10119, 10247, 10249, 10369, 10405, 10407, 10409, 10435, 10437, 10439, 13051, 13086, 13088, 13089, 13125,13127, 13129, 13156, 13158, 13159, 13187, 13189];
reinickendorf = [13403, 13405, 13407, 13409, 13435, 13437, 13439, 13465, 13467, 13469, 13503, 13505, 13507, 13509];
spandau = [13581, 13583, 13585, 13587, 13589, 13591, 13593, 13595, 13597, 13599, 13629, 14052, 14089];
steglitz_zehlendorf = [12157, 12161, 12163, 12165, 12167, 12169, 12203, 12205, 12207, 12209, 12247, 12249, 14109,14129, 14163, 14165, 14167, 14169, 14193, 14195];
tempelhof_schoeneberg = [10777, 10779, 10781, 10783, 10787, 10789, 10823, 10825, 10827, 10829, 12099, 12101, 12103,12105,12107, 12109, 12157, 12159, 12161, 12169, 12249, 12277, 12279, 12305, 12307, 12309, 14197];
treptow_koepenick = [12435, 12437, 12439, 12459, 12487, 12489, 12524, 12526, 12527, 12555, 12557, 12559, 12587, 12589];

import json

with open("assets/data/SportClubForMe_Working.json") as file:
    data = json.load(file)

for club in data["clubdata"]:

    for value in charlottenburg_wilmersdorf:
        if str(value) in club.postcode:
            club['district'] = 'charlottenburg-wilmersdorf'
    for value in friedrichshain_kreuzberg:
        if str(value) in club.postcode:
            club['district'] = 'friedrichshain-kreuzberg'
    for value in lichtenberg:
        if str(value) in club.postcode:
            club['district'] = 'lichtenberg'
    for value in mitte:
        if str(value) in club.postcode:
            club['district'] = 'mitte'
    for value in marzahn_hellersdorf:
        if str(value) in club.postcode:
            club['district'] = 'marzahn-hellersdorf'
    for value in neukoelln:
        if str(value) in club.postcode:
            club['district'] = 'neukoelln'
    for value in pankow:
            if str(value) in club.postcode:
                club['district'] = 'pankow'
    for value in reinickendorf:
            if str(value) in club.postcode:
                club['district'] = 'reinickendorf'
    for value in spandau:
            if str(value) in club.postcode:
                club['district'] = 'spandau'
    for value in steglitz_zehlendorf:
            if str(value) in club.postcode:
                club['district'] = 'steglitz-zehlendorf'
    for value in tempelhof_schoeneberg:
            if str(value) in club.postcode:
                club['district'] = 'tempelhof-schoeneberg'
    for value in treptow_koepenick:
            if str(value) in club.postcode:
                club['district'] = 'treptow-koepenick'

json_string = json.dumps(data)

with open("assets/data/SportClubsForMe_WithDistricts.json", "w") as output:
    output.write(json_string)