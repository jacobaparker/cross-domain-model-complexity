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
andir = rootdir + 'analysis\\'
figdir = rootdir + 'analysis\\figures\\'

sjfiles = [sjfile for sjfile in os.listdir(datadir) if '.csv' in sjfile]
goodfiles = []
sjkey = {}

two_arm_seq24 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq24_new_new.csv')
two_arm_seq28 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq28_new_new.csv')

sjreport = qh.html(andir + 'subjects_qc_report.html', style='new')

#put list of columns as dict keys here
gdf = pd.DataFrame({'subject': [],
                    'lowH_score': [],
                    'highH_score': [],
                    'two_arm24_score': [],
                    'two_arm28_score': [],
                    'first_task': [],
                    'first_bead_block': [],
                    'first_two_arm_seq': [],
                    'lowH_duration': [],
                    'highH_duration': [],
                    'two_arm24_duration': [],
                    'two_arm28_duration': [],
                    'beads_ntrials': [],
                    'two_arm_ntrials': [],
                    'com_rew_stay24': [],
                    'rare_rew_stay24': [],
                    'com_norew_stay24': [],
                    'rare_norew_stay24': [],
                    'com_rew_total24': [],
                    'rare_rew_total24': [],
                    'com_norew_total24': [],
                    'rare_norew_total24': [],
                    'com_rew_stay28': [],
                    'rare_rew_stay28': [],
                    'com_norew_stay28': [],
                    'rare_norew_stay28': [],
                    'com_rew_total28': [],
                    'rare_rew_total28': [],
                    'com_norew_total28': [],
                    'rare_norew_total28': []
                    })

beads_sjdf_list = []
two_arm_sjdf_list = []

jj = 0
for sjfile in sjfiles:
    
    try:
        sjdf = pd.read_csv(datadir + sjfile)
        
        #this should filter out incomplete files
        bonus = float(sjdf.total_bonus[np.isnan(sjdf.total_bonus) == False])
        
        goodfiles.append(sjfile)
        sjkey[jj] = sjdf.subject_id[0]
        gdf.subject[jj] = jj + 1
        gdf.lowH_score[jj] = int(sjdf.lowH_score[np.isnan(sjdf.lowH_score) == False])
        gdf.highH_score[jj] = int(sjdf.highH_score[np.isnan(sjdf.highH_score) == False])
        
        lowH_exp_df = sjdf[sjdf.block == 'lowH']
        highH_exp_df = sjdf[sjdf.block == 'highH']
        two_arm24_df = sjdf['seq24' in sjdf.seq_file]
        two_arm28_df = sjdf['seq28' in sjdf.seq_file]
        
        gdf.two_arm24_score[jj] = two_arm24_df[['two_arm_score_block1','two_arm_score_block2']].max()
        gdf.two_arm28_score[jj] = two_arm28_df[['two_arm_score_block1','two_arm_score_block2']].max()
        
        lowH_ind = int(sjdf.index[np.isnan(sjdf.lowH_score) == False])
        highH_ind = int(sjdf.index[np.isnan(sjdf.highH_score) == False])
        two_arm24_ind = int(two_arm24_df.index[two_arm24_df.trial_number == 125])
        two_arm28_ind = int(two_arm28_df.index[two_arm28_df.trial_number == 125])
        
        if lowH_ind < two_arm24_ind:
            gdf.first_task[jj] = 'beads'
        else:
            gdf.first_task[jj] = 'two_arm'
            
        if lowH_ind < highH_ind:
            gdf.first_bead_block[jj] = 'lowH'
        else:
            gdf.first_bead_block[jj] = 'highH'
            
        if two_arm24_ind < two_arm28_ind:
            gdf.first_two_arm_seq[jj] = 'seq24'
        else:
            gdf.first_two_arm_seq[jj] = 'seq28'
            
        ltimes = lowH_exp_df.time_elapsed.to_numpy()
        htimes = highH_exp_df.time_elapsed.to_numpy()
        gdf.lowH_duration[jj] = (ltimes[-1] - ltimes[0])/1000/60
        gdf.highH_duration[jj] = (htimes[-1] - htimes[0])/1000/60
        
        atimes = two_arm24_df.time_elapsed.to_numpy()
        gdf.two_arm24_duration[jj] = (atimes[-1] - atimes[0])/1000/60
        
        atimes = two_arm28_df.time_elapsed.to_numpy()
        gdf.two_arm28_duration[jj] = (atimes[-1] - atimes[0])/1000/60
        
        gdf.beads_ntrials[jj] = 375
        gdf.two_arm_ntrials[jj] = 125
        
        com_stay_rew = 0
        com_rew_total = 0
        rare_stay_rew = 0
        rare_rew_total = 0
        com_stay_norew = 0
        com_norew_total = 0
        rare_stay_norew = 0
        rare_norew_total = 0
        arm_exp_df = two_arm24_df.copy()
        for t in range(1,len(arm_exp_df)):
            if arm_exp_df.state1_action[t-1] == arm_exp_df.state2_visited[t-1]:
                if arm_exp_df.rewarded[t-1] == 1:
                    com_rew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        com_stay_rew += 1
                else:
                    com_norew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        com_stay_norew += 1
            else:
                if arm_exp_df.rewarded[t-1] == 1:
                    rare_rew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        rare_stay_rew += 1
                else:
                    rare_norew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        rare_stay_norew += 1
        
        gdf.com_rew_stay24[jj] = com_stay_rew
        gdf.rare_rew_stay24[jj] = rare_stay_rew
        gdf.com_norew_stay24[jj] = com_stay_norew
        gdf.rare_norew_stay24[jj] = rare_stay_norew
        gdf.com_rew_total24[jj] = com_rew_total
        gdf.rare_rew_total24[jj] = rare_rew_total
        gdf.com_norew_total24[jj] = com_norew_total
        gdf.rare_norew_total24[jj] = rare_norew_total
        
        com_stay_rew = 0
        com_rew_total = 0
        rare_stay_rew = 0
        rare_rew_total = 0
        com_stay_norew = 0
        com_norew_total = 0
        rare_stay_norew = 0
        rare_norew_total = 0
        arm_exp_df = two_arm28_df.copy()
        for t in range(1,len(arm_exp_df)):
            if arm_exp_df.state1_action[t-1] == arm_exp_df.state2_visited[t-1]:
                if arm_exp_df.rewarded[t-1] == 1:
                    com_rew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        com_stay_rew += 1
                else:
                    com_norew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        com_stay_norew += 1
            else:
                if arm_exp_df.rewarded[t-1] == 1:
                    rare_rew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        rare_stay_rew += 1
                else:
                    rare_norew_total += 1
                    if arm_exp_df.state1_action[t] == arm_exp_df.state1_action[t-1]:
                        rare_stay_norew += 1
        
        gdf.com_rew_stay28[jj] = com_stay_rew
        gdf.rare_rew_stay28[jj] = rare_stay_rew
        gdf.com_norew_stay28[jj] = com_stay_norew
        gdf.rare_norew_stay28[jj] = rare_stay_norew
        gdf.com_rew_total28[jj] = com_rew_total
        gdf.rare_rew_total28[jj] = rare_rew_total
        gdf.com_norew_total28[jj] = com_norew_total
        gdf.rare_norew_total28[jj] = rare_norew_total
        
        fig1, axs1 = plt.subplots(1,2,figsize=(12, 2))
        axs1[0].plot(lowH_exp_df.trial_number,lowH_exp_df.jar,color='r')
        axs1[0].scatter(lowH_exp_df.trial_number,lowH_exp_df.choice,c='black',marker='|')
        axs1[0].set_title('Low Hazard')
        
        axs1[1].scatter(highH_exp_df.trial_number,highH_exp_df.choice,c='black',marker='|')
        axs1[1].set_title('High Hazard')
        plt.savefig(figdir + 'sj' + str(jj+1) + '_bead_choice_seq.png',dpi=150)
        
        arm_exp_df = two_arm24_df.copy()
        mdict = {
            'f': 2,
            'j': 3
        }
        
        cdict = {
            1: 'tab:blue',
            2: 'tab:orange',
            3: 'tab:green',
            4: 'tab:red'
        }
        
        fig2, axs2 = plt.subplots(1,2,figsize=(12, 3))
        axs2[0].plot(arm_exp_df.trial_number,np.array(arm_exp_df['S1_A_star'])+1,color='gray')
        for choice in unique(arm_exp_df.choice):
            axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                          arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                          marker=mdict['f'],
                           c=cdict[choice])
            axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                          arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                          marker=mdict['j'],
                           c=cdict[choice])
            
        axs2[1].plot(arm_seq_df.trial_number,np.array(arm_seq_df['S0_A_star'])+1,color='gray')
        for action in unique(arm_exp_df.state1_action):
            axs2[1].scatter(arm_exp_df.trial_number[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'f')],
                           arm_exp_df.state1_action[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'f')],
                           marker=mdict['f'],
                           c='black')
            axs2[1].scatter(arm_exp_df.trial_number[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'j')],
                           arm_exp_df.state1_action[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'j')],
                           marker=mdict['j'],
                           c='black')
            
        axs2[0].set_title('State2 Choice')
        axs2[1].set_title('State1 Choice')
        plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm24_choice_seq.png',dpi=150)
        
        arm_exp_df = two_arm28_df.copy()
        mdict = {
            'f': 2,
            'j': 3
        }
        
        cdict = {
            1: 'tab:blue',
            2: 'tab:orange',
            3: 'tab:green',
            4: 'tab:red'
        }
        
        fig2, axs2 = plt.subplots(1,2,figsize=(12, 3))
        axs2[0].plot(arm_seq_df.trial_number,np.array(arm_seq_df['S1_A_star'])+1,color='gray')
        for choice in unique(arm_exp_df.choice):
            axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                          arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                          marker=mdict['f'],
                           c=cdict[choice])
            axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                          arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                          marker=mdict['j'],
                           c=cdict[choice])
            
        axs2[1].plot(arm_seq_df.trial_number,np.array(arm_seq_df['S0_A_star'])+1,color='gray')
        for action in unique(arm_exp_df.state1_action):
            axs2[1].scatter(arm_exp_df.trial_number[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'f')],
                           arm_exp_df.state1_action[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'f')],
                           marker=mdict['f'],
                           c='black')
            axs2[1].scatter(arm_exp_df.trial_number[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'j')],
                           arm_exp_df.state1_action[(arm_exp_df.state1_action == action) & (arm_exp_df.state2_key == 'j')],
                           marker=mdict['j'],
                           c='black')
            
        axs2[0].set_title('State2 Choice')
        axs2[1].set_title('State1 Choice')
        plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm28_choice_seq.png',dpi=150)
        
        if gdf.first_two_arm_seq[jj] == 'seq24':
            seq1 = '24'
            com_stay_rew1 = gdf.com_rew_stay24[jj]
            com_rew_total1 = gdf.com_rew_total24[jj]
            com_stay_norew1 = gdf.com_norew_stay24[jj]
            com_norew_total1 = gdf.com_norew_total24[jj]
            rare_stay_rew1 = gdf.rare_rew_stay24[jj]
            rare_rew_total1 = gdf.rare_rew_total24[jj]
            rare_stay_norew1 = gdf.rare_norew_stay24[jj]
            rare_norew_total1 = gdf.rare_norew_total24[jj]
            
            seq2 = '28'
            com_stay_rew2 = gdf.com_rew_stay28[jj]
            com_rew_total2 = gdf.com_rew_total28[jj]
            com_stay_norew2 = gdf.com_norew_stay28[jj]
            com_norew_total2 = gdf.com_norew_total28[jj]
            rare_stay_rew2 = gdf.rare_rew_stay28[jj]
            rare_rew_total2 = gdf.rare_rew_total28[jj]
            rare_stay_norew2 = gdf.rare_norew_stay28[jj]
            rare_norew_total2 = gdf.rare_norew_total28[jj]
        else:
            seq1 = '28'
            com_stay_rew1 = gdf.com_rew_stay28[jj]
            com_rew_total1 = gdf.com_rew_total28[jj]
            com_stay_norew1 = gdf.com_norew_stay28[jj]
            com_norew_total1 = gdf.com_norew_total28[jj]
            rare_stay_rew1 = gdf.rare_rew_stay28[jj]
            rare_rew_total1 = gdf.rare_rew_total28[jj]
            rare_stay_norew1 = gdf.rare_norew_stay28[jj]
            rare_norew_total1 = gdf.rare_norew_total28[jj]
            
            seq2 = '24'
            com_stay_rew2 = gdf.com_rew_stay24[jj]
            com_rew_total2 = gdf.com_rew_total24[jj]
            com_stay_norew2 = gdf.com_norew_stay24[jj]
            com_norew_total2 = gdf.com_norew_total24[jj]
            rare_stay_rew2 = gdf.rare_rew_stay24[jj]
            rare_rew_total2 = gdf.rare_rew_total24[jj]
            rare_stay_norew2 = gdf.rare_norew_stay24[jj]
            rare_norew_total2 = gdf.rare_norew_total24[jj]
            
        fig5, axs5 = plt.subplots(1,2,figsize=(8,3))
        labels = ['Reward','No Reward']
        x = np.arange(len(labels))
        width = 0.35
        axs5[0].bar(x - width/2,[com_stay_rew1/com_rew_total1, com_stay_norew1/com_norew_total1],width,label='Common')
        axs5[0].bar(x + width/2,[rare_stay_rew1/rare_rew_total1, rare_stay_norew1/rare_norew_total1],width,label='Rare')
        axs5[0].set_xticks(x,labels)
        axs5[0].legend()
        axs5[0].set_ylabel('A1 Repeat Probability')
        axs5[0].set_title('Block 1, Seq ' + seq1)
        
        axs5[1].bar(x - width/2,[com_stay_rew2/com_rew_total2, com_stay_norew2/com_norew_total2],width,label='Common')
        axs5[1].bar(x + width/2,[rare_stay_rew2/rare_rew_total2, rare_stay_norew2/rare_norew_total2],width,label='Rare')
        axs5[1].set_xticks(x,labels)
        axs5[1].legend()
        axs5[0].set_title('Block 2, Seq ' + seq2)
        plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm_stay_prob.png',dpi=150)
        
        
        
        jj += 1
        
    except:
            pass