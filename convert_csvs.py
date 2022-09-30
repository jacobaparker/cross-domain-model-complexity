#!/usr/bin/env python

import csv
import json

def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []

    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf:
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf)

        #convert each csv row into python dict
        for row in csvReader:
            #add this python dict to json array
            jsonArray.append(row)

    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)

instr_csv = './instructions_spec.csv'
instr_json = './instructions_spec.json'
two_arm_csv = './tasks/two-arm-new/stimuli/seq8.csv'
two_arm_json = './tasks/two-arm-new/stimuli/seq8.json'

csv_to_json(instr_csv,instr_json)
csv_to_json(two_arm_csv,two_arm_json)
