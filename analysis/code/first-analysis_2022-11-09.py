# -*- coding: utf-8 -*-
"""
Created on Wed Nov  9 10:37:38 2022

@author: parja
"""

import pandas as pd
import numpy as np
from scipy import stats
from scipy.stats import spearmanr, entropy, pearsonr
import scipy.io as spio
import statsmodels.formula.api as sm
import sys, csv, pingouin
import os
import quickHTML as qh
import matplotlib.pyplot as plt

#%%

######################
## HELPER FUNCTIONS ##
######################

#Functions to creat labels
def trial_label(x):
    as_strings = [num.astype(str) for num in x]
    return "".join(as_strings)

def make_features(trials_data):
    labeled_data = np.apply_along_axis(trial_label, 0, trials_data)
    combos = np.unique(labeled_data)
    string_to_index = dict(zip(combos, np.arange(len(combos))))
    map_to_index = np.vectorize(lambda x: string_to_index[x])
    mapped_data = map_to_index(labeled_data)
    return mapped_data

def get_marginal(x):
    """
    Helper function to compute and return marginal probability distribution for a 1d vector (x)
    """
    px = np.array([np.sum(x==xi) for xi in np.sort(np.unique(x))])/len(x)
    return(px)

def get_joint(x, y):
    """
    Computes joint probability distribution between 1d vectors x and y
    """
    #  set up dictionary for joint distribution (x-->y-->freq)
    joint_x_y = {}
    
    for x_un in np.unique(x):
        joint_x_y[x_un] = dict(zip(np.unique(y), np.zeros(len(np.unique(y)))))
        
#    populate dictionary 
    for trial, x_val in enumerate(x):
        y_val = y[trial]
        joint_x_y[x_val][y_val] += 1
        
#   normalize to make distirbution  
    joint_sum = sum(sum(list(c.values())) for c in list(joint_x_y.values()))
    
    for key1 in joint_x_y:
        for key2 in joint_x_y[key1]:
            joint_x_y[key1][key2] /= joint_sum
            
    return(joint_x_y)

def mutual_inf(x, y):
    """
    Calculates the mutual information I(x;y)
    Assuming x,y are both [n x 1] dimensional
    """  
#     Calculate marginal distributions
    px = get_marginal(x)
    py = get_marginal(y)
    
    
    joint_x_y = get_joint(x,y)
# calculate mutual information
    mi = 0
    
    for n_x, x_un in enumerate(np.unique(x)):
        pxi = px[n_x] # p(x)
        
        for n_y, y_un in enumerate(np.unique(y)):
            pyi = py[n_y] # p(y)            
            
            joint_i = joint_x_y[x_un][y_un] # P(x,y)
            
            if ((pxi == 0) or (pyi == 0) or (joint_i ==0 )):
                continue
            else:
                mi += joint_i * np.log2(joint_i/(pxi*pyi))
                
    return mi

#%% extract data

rootdir = 'C:\\Users\\parja\\Projects\\cross-domain-model-complexity\\'
datadir = rootdir + 'data\\'

sjfiles = [sjfile for sjfile in os.listdir(datadir) if '.csv' in sjfile]
goodfiles = []
sjkey = {}

two_arm_seq24 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq24_new_new.csv')
two_arm_seq28 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq28_new_new.csv')

#put list of columns as dict keys here
gdf = pd.DataFrame({'lowH_score': [],
                    'highH_score': [],
                    'two_arm24_score': [],
                    'two_arm28_score': [],
                    'first_bead_block': [],
                    'first_two_arm_seq': [],
                    'lowH_duration': [],
                    'highH_duration': [],
                    'two_arm24_duration': [],
                    'two_arm28_duration': [],
                    'beads_ntrials': [],
                    'two_arm_ntrials': [],
                    'com_rew_stay_prob': [],
                    'rare_rew_stay_prob': [],
                    'com_norew_stay_prob': [],
                    'rare_norew_stay_prob': []})

beads_sjdf_list = []
two_arm_sjdf_list = []

for sjfile in sjfiles:
    
    try:
        sjdf = pd.read_csv(datadir + sjfile)
        