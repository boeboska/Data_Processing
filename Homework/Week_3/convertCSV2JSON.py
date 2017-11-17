import csv
import json

goals = []

# open datafile and create a dictionary
with open('goals.csv', 'r') as csvfile:
	data = csv.reader(csvfile, delimiter='\t')
	for row in data:
		temp = {}
		temp["season"] = row[0]
		temp["goals"] = row[1]
		goals.append(temp)



# set data in json file
with open('jsongoals.json', 'w') as outfile:
	json.dump(goals, outfile, indent=4)
