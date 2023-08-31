import json
import csv
import sys



out = sys.argv[1]


with open(r'c:\Users\ASUS\AppData\Local\AnimesList9\Cache\AData.json') as file:
    json_data = json.load(file)

headers = json_data['headers']

data = json_data['data']

with open(out, 'w', newline='') as csvfile:
    # Creating a csv writer object
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(headers)
    row = []
    count = 0
    for index in data:
        for header in headers:
            record = data[index][header]
            if isinstance(record, dict):
                value = data[index][header]['value']
                url = data[index][header]['url']
                if  url != '':
                    hyperlink_formula  = '=HYPERLINK("' + url + '"; "' + value + '")'
                    row.append(hyperlink_formula)
                else:
                    row.append(value)
            else:
                row.append(record)
        csvwriter.writerow(row)
        row = []
   