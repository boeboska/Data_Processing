import csv
import json

knmi_data = []

# open datafile and create a dictionary
with open('KNMI.csv', 'r') as csvfile:
	data = csv.reader(csvfile, delimiter=',')
	for row in data:
		temp = {}
		temp["day"] = row[1]
		temp["gem"] = row[2]
		temp["min"] = row[3]
		temp["max"] = row[4]
		knmi_data.append(temp)

# set data in json file
with open('eindhoven.json', 'w') as outfile:
	json.dump(knmi_data, outfile, indent=4)
