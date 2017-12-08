import csv
import json

werkzame_beroepsbevolkingdata = []

# open datafile and create a dictionary
with open('werkzame_beroepsbevolking.csv', 'r') as csvfile:
	data = csv.reader(csvfile, delimiter=',')
	for row in data:
		temp = {}
		temp["capital_city"] = row[0]
		temp["amount"] = row[1]
		temp["percentage_of_total"] = row[2]
		
		werkzame_beroepsbevolkingdata.append(temp)

# set data in json file
with open('werkzame_beroepsbevolking.json', 'w') as outfile:
	json.dump(werkzame_beroepsbevolkingdata, outfile, indent=4)
