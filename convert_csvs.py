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
beads_csv1 = './tasks/HMM-beads/stimuli/low_hazard_H10.csv'
beads_csv2 = './tasks/HMM-beads/stimuli/low_hazard_H01.csv'
beads_csv3 = './tasks/HMM-beads/stimuli/high_hazard_H99.csv'
beads_json1 = './tasks/HMM-beads/stimuli/low_hazard_H10.json'
beads_json2 = './tasks/HMM-beads/stimuli/low_hazard_H01.json'
beads_json3 = './tasks/HMM-beads/stimuli/high_hazard_H99.json'

csv_to_json(instr_csv,instr_json)
csv_to_json(two_arm_csv,two_arm_json)
csv_to_json(beads_csv1,beads_json1)
csv_to_json(beads_csv2,beads_json2)
csv_to_json(beads_csv3,beads_json3)
