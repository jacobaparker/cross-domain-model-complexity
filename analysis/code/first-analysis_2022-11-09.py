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
#import statsmodels.formula.api as sm
import sys, csv
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

def encode_task_variables(df,feat_list,t_arr):
    # Inputs:
    #    df: dataframe with task variables
    #    feat_list: list of feature names corresponding to dataframe column headers
    #    t_arr: array of timepoints relative to current trial for each feature
    #           (positive values correspond to how many trials ago)
    #
    # Outputs:
    #    feat_arr: a numpy array of the features encoded into a single value per time point
    assert len(feat_list) == len(t_arr)
    
    depth = np.max(t_arr)
    feat_arr = np.zeros((len(df)-depth))
    for f in range(len(feat_list)):
        temp_arr = df[feat_list[f]].copy().to_numpy()
        temp_arr = temp_arr[depth-t_arr[f]:len(temp_arr)-t_arr[f]]
        if (np.max(temp_arr) == 2) & (np.min(temp_arr) == 1):
            temp_arr = temp_arr - 1
        feat_arr = feat_arr + (temp_arr*(2**f))
        
    joint_feat_num = 2**(f+1)
    
    # feat_counts = np.empty((2**(f+1)))
    # for f in range(2**(f+1)):
    #     feat_counts[f] = np.sum(feat_arr==f)
        
    return feat_arr, joint_feat_num

def get_joint_counts(joint_feat_arr,joint_feat_num):
    feat_counts = np.empty((joint_feat_num))
    for f in range(joint_feat_num):
        feat_counts[f] = np.sum(joint_feat_arr==f)
    return feat_counts

#%% extract data, put in more useable forms, generate qc and summary figures
#   for each subject

skip_data_extract = False

rootdir = 'C:\\Users\\parja\\Projects\\cross-domain-model-complexity\\'
datadir = rootdir + 'data\\'
andir = rootdir + 'analysis\\'
figdir = rootdir + 'analysis\\figures\\'

sjfiles = [sjfile for sjfile in os.listdir(datadir) if '.csv' in sjfile]
goodfiles = []
sjkey = {}

two_arm_seq24 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq24_optim.csv')
two_arm_seq28 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq28_optim.csv')

sjreport = qh.html(andir + 'subjects_qc_report.html', style='new')

gdf = pd.DataFrame({'subject': [],
                    'data_file': [],
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
                    'rare_norew_total28': [],
                    'Ipast_beads': [],
                    'Ifuture_beads': [],
                    'Ipast_two_arm': [],
                    'Ifuture_two_arm': []
                    })

all_sj_df = pd.DataFrame({'subject': [],
                    'data_file': [],
                    'task': [],
                    'task_num': [],
                    'block': [],
                    'block_num': [],
                    'trial_number': [],
                    'hazard_rate': [],
                    'jar': [],
                    'bead': [],
                    'choice': [],
                    'correct': [],
                    'rt': [],
                    'score': [],
                    'state1_choice': [],
                    'state1_key': [],
                    'state2': [],
                    'state2_choice': [],
                    'state2_key': [],
                    'rewarded': [],
                    'state1_rt': [],
                    'state2_rt': []
                    })

beads_sjdf_list = []
two_arm_sjdf_list = []

jj = 0
for sjfile in sjfiles:
    
    if skip_data_extract:
        break
    
    try:
        sjdf = pd.read_csv(datadir + sjfile)
        
        #this should filter out incomplete files
        bonus = float(sjdf.total_bonus[np.isnan(sjdf.total_bonus) == False])
        
    except:
        continue
        
    sjreport.write_header('SJ' + str(jj+1) + ', PID:' + sjdf.subject_id[0])
    sjreport.write_text('File: ' + sjfile)
    goodfiles.append(sjfile)
    sjkey[jj] = sjdf.subject_id[0]
    gdf.loc[jj,'subject'] = jj + 1
    gdf.loc[jj,'data_file'] = sjfile
    gdf.loc[jj,'lowH_score'] = int(sjdf.lowH_score[np.isnan(sjdf.lowH_score) == False])
    gdf.loc[jj,'highH_score'] = int(sjdf.highH_score[np.isnan(sjdf.highH_score) == False])
    
    lowH_exp_df = sjdf[sjdf.block == 'lowH']
    highH_exp_df = sjdf[sjdf.block == 'highH']
    two_arm24_df = sjdf[sjdf.seq_file == './tasks/two-arm-new/stimuli/seq24.json']
    two_arm28_df = sjdf[sjdf.seq_file == './tasks/two-arm-new/stimuli/seq28.json']
    
    # gdf.loc[jj,'two_arm24_score'] = two_arm24_df[['two_arm_score_block1','two_arm_score_block2']].max()
    # gdf.loc[jj,'two_arm28_score'] = two_arm28_df[['two_arm_score_block1','two_arm_score_block2']].max()
    
    lowH_ind = int(sjdf.index[np.isnan(sjdf.lowH_score) == False].to_numpy())
    highH_ind = int(sjdf.index[np.isnan(sjdf.highH_score) == False].to_numpy())
    two_arm24_ind = int(two_arm24_df.index[two_arm24_df.trial_number == 124].to_numpy())
    two_arm28_ind = int(two_arm28_df.index[two_arm28_df.trial_number == 124].to_numpy())
    
    if lowH_ind < two_arm24_ind:
        gdf.loc[jj,'first_task'] = 'beads'
    else:
        gdf.loc[jj,'first_task'] = 'two_arm'
        
    if lowH_ind < highH_ind:
        gdf.loc[jj,'first_bead_block'] = 'lowH'
    else:
        gdf.loc[jj,'first_bead_block'] = 'highH'
        
    if two_arm24_ind < two_arm28_ind:
        gdf.loc[jj,'first_two_arm_seq'] = 'seq24'
        gdf.loc[jj,'two_arm24_score'] = two_arm24_df['two_arm_score_block1'].max()
        gdf.loc[jj,'two_arm28_score'] = two_arm28_df['two_arm_score_block2'].max()
    else:
        gdf.loc[jj,'first_two_arm_seq'] = 'seq28'
        gdf.loc[jj,'two_arm24_score'] = two_arm24_df['two_arm_score_block2'].max()
        gdf.loc[jj,'two_arm28_score'] = two_arm28_df['two_arm_score_block1'].max()
        
    ltimes = lowH_exp_df.time_elapsed.to_numpy()
    htimes = highH_exp_df.time_elapsed.to_numpy()
    gdf.loc[jj,'lowH_duration'] = (ltimes[-1] - ltimes[0])/1000/60
    gdf.loc[jj,'highH_duration'] = (htimes[-1] - htimes[0])/1000/60
    
    atimes = two_arm24_df.time_elapsed.to_numpy()
    gdf.loc[jj,'two_arm24_duration'] = (atimes[-1] - atimes[0])/1000/60
    
    atimes = two_arm28_df.time_elapsed.to_numpy()
    gdf.loc[jj,'two_arm28_duration'] = (atimes[-1] - atimes[0])/1000/60
    
    gdf.loc[jj,'beads_ntrials'] = 375
    gdf.loc[jj,'two_arm_ntrials'] = 125
    
    com_stay_rew = 0
    com_rew_total = 0
    rare_stay_rew = 0
    rare_rew_total = 0
    com_stay_norew = 0
    com_norew_total = 0
    rare_stay_norew = 0
    rare_norew_total = 0
    arm_exp_df = two_arm24_df.copy()
    arm_exp_df.reset_index(inplace=True)
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
    
    gdf.loc[jj,'com_rew_stay24'] = com_stay_rew
    gdf.loc[jj,'rare_rew_stay24'] = rare_stay_rew
    gdf.loc[jj,'com_norew_stay24'] = com_stay_norew
    gdf.loc[jj,'rare_norew_stay24'] = rare_stay_norew
    gdf.loc[jj,'com_rew_total24'] = com_rew_total
    gdf.loc[jj,'rare_rew_total24'] = rare_rew_total
    gdf.loc[jj,'com_norew_total24'] = com_norew_total
    gdf.loc[jj,'rare_norew_total24'] = rare_norew_total
    
    com_stay_rew = 0
    com_rew_total = 0
    rare_stay_rew = 0
    rare_rew_total = 0
    com_stay_norew = 0
    com_norew_total = 0
    rare_stay_norew = 0
    rare_norew_total = 0
    arm_exp_df = two_arm28_df.copy()
    arm_exp_df.reset_index(inplace=True)
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
    
    gdf.loc[jj,'com_rew_stay28'] = com_stay_rew
    gdf.loc[jj,'rare_rew_stay28'] = rare_stay_rew
    gdf.loc[jj,'com_norew_stay28'] = com_stay_norew
    gdf.loc[jj,'rare_norew_stay28'] = rare_stay_norew
    gdf.loc[jj,'com_rew_total28'] = com_rew_total
    gdf.loc[jj,'rare_rew_total28'] = rare_rew_total
    gdf.loc[jj,'com_norew_total28'] = com_norew_total
    gdf.loc[jj,'rare_norew_total28'] = rare_norew_total
    
    fig1, axs1 = plt.subplots(1,2,figsize=(12, 2))
    axs1[0].plot(lowH_exp_df.trial_number,lowH_exp_df.jar,color='r')
    axs1[0].scatter(lowH_exp_df.trial_number,lowH_exp_df.choice,c='black',marker='|')
    axs1[0].set_title('Low Hazard')
    
    axs1[1].scatter(highH_exp_df.trial_number,highH_exp_df.choice,c='black',marker='|')
    axs1[1].set_title('High Hazard')
    plt.savefig(figdir + 'sj' + str(jj+1) + '_bead_choice_seq.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_bead_choice_seq.png', width=800)
    
    if gdf.first_two_arm_seq[jj] == 'seq24':
        seq1 = '24'
        seq24 = '1'
        com_stay_rew1 = gdf.com_rew_stay24[jj]
        com_rew_total1 = gdf.com_rew_total24[jj]
        com_stay_norew1 = gdf.com_norew_stay24[jj]
        com_norew_total1 = gdf.com_norew_total24[jj]
        rare_stay_rew1 = gdf.rare_rew_stay24[jj]
        rare_rew_total1 = gdf.rare_rew_total24[jj]
        rare_stay_norew1 = gdf.rare_norew_stay24[jj]
        rare_norew_total1 = gdf.rare_norew_total24[jj]
        
        seq2 = '28'
        seq28 = '2'
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
        seq28 = '1'
        com_stay_rew1 = gdf.com_rew_stay28[jj]
        com_rew_total1 = gdf.com_rew_total28[jj]
        com_stay_norew1 = gdf.com_norew_stay28[jj]
        com_norew_total1 = gdf.com_norew_total28[jj]
        rare_stay_rew1 = gdf.rare_rew_stay28[jj]
        rare_rew_total1 = gdf.rare_rew_total28[jj]
        rare_stay_norew1 = gdf.rare_norew_stay28[jj]
        rare_norew_total1 = gdf.rare_norew_total28[jj]
        
        seq2 = '24'
        seq24 = '2'
        com_stay_rew2 = gdf.com_rew_stay24[jj]
        com_rew_total2 = gdf.com_rew_total24[jj]
        com_stay_norew2 = gdf.com_norew_stay24[jj]
        com_norew_total2 = gdf.com_norew_total24[jj]
        rare_stay_rew2 = gdf.rare_rew_stay24[jj]
        rare_rew_total2 = gdf.rare_rew_total24[jj]
        rare_stay_norew2 = gdf.rare_norew_stay24[jj]
        rare_norew_total2 = gdf.rare_norew_total24[jj]
    
    arm_exp_df = two_arm24_df.copy()
    arm_seq_df = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq24_optim.csv')
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
    axs2[0].plot(arm_seq_df.Trial,np.array(arm_seq_df['S1_A_star'])+1,color='gray')
    for choice in arm_exp_df.choice.unique():
        axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                      arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                      marker=mdict['f'],
                       c=cdict[choice])
        axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                      arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                      marker=mdict['j'],
                       c=cdict[choice])
        
    axs2[1].plot(arm_seq_df.Trial,np.array(arm_seq_df['S0_A_star'])+1,color='gray')
    for action in arm_exp_df.state1_action.unique():
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
    plt.suptitle('Seq24, Block ' + seq24)
    plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm24_choice_seq.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_two_arm24_choice_seq.png', width=800)
    
    arm_exp_df = two_arm28_df.copy()
    arm_seq_df = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq28_optim.csv')
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
    axs2[0].plot(arm_seq_df.Trial,np.array(arm_seq_df['S1_A_star'])+1,color='gray')
    for choice in arm_exp_df.choice.unique():
        axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                      arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'f')],
                      marker=mdict['f'],
                       c=cdict[choice])
        axs2[0].scatter(arm_exp_df.trial_number[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                      arm_exp_df.choice[(arm_exp_df.choice == choice) & (arm_exp_df.state2_key == 'j')],
                      marker=mdict['j'],
                       c=cdict[choice])
        
    axs2[1].plot(arm_seq_df.Trial,np.array(arm_seq_df['S0_A_star'])+1,color='gray')
    for action in arm_exp_df.state1_action.unique():
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
    plt.suptitle('Seq28, Block ' + seq28)
    plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm28_choice_seq.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_two_arm28_choice_seq.png', width=800)
        
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
    axs5[1].set_title('Block 2, Seq ' + seq2)
    plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm_stay_prob.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_two_arm_stay_prob.png', width=800)
    
    fig3, axs3 = plt.subplots()
    axs3.hist(lowH_exp_df.rt,50,histtype='step')
    axs3.hist(highH_exp_df.rt,50,histtype='step')
    axs3.set_xlabel('Time (ms)')
    plt.savefig(figdir + 'sj' + str(jj+1) + '_beads_rt_hist.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_beads_rt_hist.png', width=800)
    
    fig4, axs4 = plt.subplots(1,2,figsize=(12,4))
    axs4[0].hist(two_arm24_df.state1_rt,25,histtype='step')
    axs4[0].hist(two_arm24_df.state2_rt,25,histtype='step')
    axs4[0].set_xlabel('Time (ms)')
    axs4[0].set_title('Seq 24')
    
    axs4[1].hist(two_arm28_df.state1_rt,25,histtype='step')
    axs4[1].hist(two_arm28_df.state2_rt,25,histtype='step')
    axs4[0].set_xlabel('Time (ms)')
    axs4[0].set_title('Seq 28')
    plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm_rt_hist.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_two_arm_rt_hist.png', width=800)
    
    lowH_exp_df['hazard'] = 0
    highH_exp_df['hazard'] = 1
    task_feat1, feat_num = encode_task_variables(lowH_exp_df,['hazard','bead','bead','bead'],np.array([0,1,2,3]))
    task_feat2, feat_num = encode_task_variables(highH_exp_df,['hazard','bead','bead','bead'],np.array([0,1,2,3]))
    task_feat_all = np.concatenate((task_feat1,task_feat2))
    
    pred1 = lowH_exp_df.choice.to_numpy() - 1
    pred1 = pred1[3:]
    pred2 = highH_exp_df.choice.to_numpy() - 1
    pred2 = pred2[3:]

    predictions = np.concatenate((pred1,pred2))
    gdf.loc[jj,'Ipast_beads'] = mutual_inf(task_feat_all,predictions)
    
    
    task_feat_counts_0 = get_joint_counts(task_feat_all[predictions==0],feat_num)
    task_feat_counts_1 = get_joint_counts(task_feat_all[predictions==1],feat_num)
    x = np.arange(feat_num)
    
    fig6, axs6 = plt.subplots(figsize=(8,4))
    axs6.bar(x-width/2,task_feat_counts_0,width,label='BlackPred')
    axs6.bar(x+width/2,task_feat_counts_1,width,label='WhitePred')
    # axs6.hist([task_feat_all[predictions==0],task_feat_all[predictions==1]],len(np.unique(task_feat_all)),histtype='bar',label=['BlackPred','WhitePred'])
    axs6.set_ylabel('Counts')
    axs6.set_xlabel('Joint Feature Distribution')
    axs6.set_xticks(x)
    axs6.legend()
    plt.savefig(figdir + 'sj' + str(jj+1) + '_beads_feature_joint_counts.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_beads_feature_joint_counts.png', width=800)
    
    arm_seq24_df = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq24_optim.csv')
    two_arm24_df['S0_A_star'] = arm_seq24_df['S0_A_star'].to_numpy()
    arm_seq28_df = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq28_optim.csv')
    two_arm28_df['S0_A_star'] = arm_seq28_df['S0_A_star'].to_numpy()
    
    task_feat1, feat_num = encode_task_variables(two_arm24_df,['state1_action','rewarded','state2_visited','S0_A_star'],np.array([1,1,1,1]))
    task_feat2, feat_num = encode_task_variables(two_arm28_df,['state1_action','rewarded','state2_visited','S0_A_star'],np.array([1,1,1,1]))
    task_feat_all = np.concatenate((task_feat1,task_feat2))
    
    action1 = np.array(two_arm24_df.state1_action)[1:] - 1
    action2 = np.array(two_arm28_df.state1_action)[1:] - 1
    
    actions = np.concatenate((action1,action2))
    gdf.loc[jj,'Ipast_two_arm'] = mutual_inf(task_feat_all,actions)
    
    task_feat_counts_0 = get_joint_counts(task_feat_all[actions==0],feat_num)
    task_feat_counts_1 = get_joint_counts(task_feat_all[actions==1],feat_num)
    x = np.arange(feat_num)
    
    fig7, axs7 = plt.subplots(figsize=(8,4))
    axs7.bar(x-width/2,task_feat_counts_0,width,label='Action1')
    axs7.bar(x+width/2,task_feat_counts_1,width,label='Action2')
    # axs7.hist([task_feat_all[actions==0],task_feat_all[actions==1]],len(np.unique(task_feat_all)),histtype='bar',label=['Action1','Action2'])
    axs7.set_ylabel('Counts')
    axs7.set_xlabel('Joint Feature Distribution')
    axs7.set_xticks(x)
    axs7.legend()
    plt.savefig(figdir + 'sj' + str(jj+1) + '_two_arm_feature_joint_counts.png',dpi=150)
    sjreport.write_figure("file:///" + figdir + 'sj' + str(jj+1) + '_two_arm_feature_joint_counts.png', width=800)
    
    sdf = pd.DataFrame({'subject': [],
                        'data_file': [],
                        'task': [],
                        'task_num': [],
                        'block_label': [],
                        'block_num': [],
                        'trial_number': [],
                        'hazard_rate': [],
                        'jar': [],
                        'bead': [],
                        'choice': [],
                        'correct': [],
                        'rt': [],
                        'score': [],
                        'state1_choice': [],
                        'state1_key': [],
                        'state2': [],
                        'state2_choice': [],
                        'state2_key': [],
                        'rewarded': [],
                        'state1_rt': [],
                        'state2_rt': []
                        })
    
    lowH_exp_df['subject'] = jj + 1
    lowH_exp_df['data_file'] = sjfile
    lowH_exp_df['task'] = 'beads'
    lowH_exp_df['block_label'] = 'lowH'
    lowH_exp_df.loc[:,'trial_number'] = lowH_exp_df.trial_number + 1
    lowH_exp_df['hazard_rate'] = 0.01
    lowH_exp_df['score'] = lowH_exp_df['correct'].cumsum()
    lowH_exp_df['state2_choice'] = np.nan
    
    lowH_exp_df.rename(columns={'state1_action':'state1_choice', 'state2_visited':'state2'})
    
    if gdf.first_task[jj] == 'beads':
        lowH_exp_df['task_num'] = 1
    else:
        lowH_exp_df['task_num'] = 2
        
    if gdf.first_bead_block[jj] == 'lowH':
        lowH_exp_df['block_num'] = 1
    else:
        lowH_exp_df['block_num'] = 2
        
    highH_exp_df['subject'] = jj + 1
    highH_exp_df['data_file'] = sjfile
    highH_exp_df['task'] = 'beads'
    highH_exp_df['block_label'] = 'highH'
    highH_exp_df.loc[:,'trial_number'] = highH_exp_df.trial_number + 1
    highH_exp_df['hazard_rate'] = 0.99
    highH_exp_df['score'] = highH_exp_df['correct'].cumsum()
    highH_exp_df['state2_choice'] = np.nan
    
    highH_exp_df.rename(columns={'state1_action':'state1_choice', 'state2_visited':'state2'})
    
    if gdf.first_task[jj] == 'beads':
        highH_exp_df['task_num'] = 1
    else:
        highH_exp_df['task_num'] = 2
        
    if gdf.first_bead_block[jj] == 'highH':
        highH_exp_df['block_num'] = 1
    else:
        highH_exp_df['block_num'] = 2
        
    two_arm24_df['subject'] = jj + 1
    two_arm24_df['data_file'] = sjfile
    two_arm24_df['task'] = 'two_arm'
    two_arm24_df['block_label'] = 'seq24'
    two_arm24_df['hazard_rate'] = np.nan
    two_arm24_df['score'] = two_arm24_df['rewarded'].cumsum()
    two_arm24_df['state2_choice'] = np.nan
    
    two_arm24_df.rename(columns={'state1_action':'state1_choice', 'state2_visited':'state2'})
    
    if gdf.first_task[jj] == 'two_arm':
        two_arm24_df['task_num'] = 1
    else:
        two_arm24_df['task_num'] = 2
        
    if gdf.first_two_arm_seq[jj] == 'seq24':
        two_arm24_df['block_num'] = 1
    else:
        two_arm24_df['block_num'] = 2
        
    two_arm28_df['subject'] = jj + 1
    two_arm28_df['data_file'] = sjfile
    two_arm28_df['task'] = 'two_arm'
    two_arm28_df['block_label'] = 'seq28'
    two_arm28_df['hazard_rate'] = np.nan
    two_arm28_df['score'] = two_arm28_df['rewarded'].cumsum()
    two_arm28_df['state2_choice'] = np.nan
    
    two_arm28_df.rename(columns={'state1_action':'state1_choice', 'state2_visited':'state2'})
    
    if gdf.first_task[jj] == 'two_arm':
        two_arm28_df['task_num'] = 1
    else:
        two_arm28_df['task_num'] = 2
        
    if gdf.first_two_arm_seq[jj] == 'seq28':
        two_arm28_df['block_num'] = 1
    else:
        two_arm28_df['block_num'] = 2
    
    
    jj += 1
    
sjreport.save()
gdf.to_csv(path_or_buf=datadir + 'group_df.csv')

#%% basic group analysis and figures
from scipy.stats import rankdata

if skip_data_extract:
    gdf = pd.read_csv(datadir + 'group_df.csv')
    
gdf.plot.scatter('Ipast_beads','Ipast_two_arm')
plt.savefig(figdir + 'group_Ipast-beads_vs_Ipast-two-arm.png',dpi=150)

fig1, axs1 = plt.subplots()
axs1.scatter(rankdata(gdf.Ipast_beads.to_numpy()),rankdata(gdf.Ipast_two_arm.to_numpy()))
axs1.set_xlabel('Ipast_beads rank')
axs1.set_ylabel('Ipast_two_arm rank')
plt.savefig(figdir + 'group_Ipast-beads_rank_vs_Ipast-two-arm_rank.png',dpi=150)