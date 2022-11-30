#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Nov 13 12:26:45 2022

@author: jparker
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
import platform

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

#%% load data
if platform.system() == 'Windows':
    rootdir = 'C:\\Users\\parja\\Projects\\cross-domain-model-complexity\\'
    datadir = rootdir + 'data\\'
    andir = rootdir + 'analysis\\'
    figdir = rootdir + 'analysis\\figures\\group\\'
    two_arm_seq24 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq24_optim.csv')
    two_arm_seq28 = pd.read_csv(rootdir + 'tasks\\two-arm-new\\stimuli\\seq28_optim.csv')
    fig_pre = "file:///"
else:
    rootdir = '/home/jparker/Projects/cross-domain-model-complexity/'
    datadir = rootdir + 'data/'
    andir = rootdir + 'analysis/'
    figdir = rootdir + 'analysis/figures/group/'
    two_arm_seq24 = pd.read_csv(rootdir + 'tasks/two-arm-new/stimuli/seq24_optim.csv')
    two_arm_seq28 = pd.read_csv(rootdir + 'tasks/two-arm-new/stimuli/seq28_optim.csv')
    fig_pre = ''

gdf = pd.read_csv(datadir + 'group_df.csv')
sdf = pd.read_csv(datadir + 'all_sj_df.csv')

#%% Ipast beads VS Ipast two arm
from scipy.stats import rankdata

gdf.plot.scatter('Ipast_beads','Ipast_two_arm',figsize=(6,4))
plt.savefig(figdir + 'group_Ipast-beads_vs_Ipast-two-arm.png',dpi=150)

pd.plotting.scatter_matrix(gdf[['Ipast_beads','Ipast_two_arm']])
plt.savefig(figdir + 'group_Ipast-beads_vs_Ipast-two-arm_matrix.png',dpi=150)

fig1, axs1 = plt.subplots()
axs1.scatter(rankdata(gdf.Ipast_beads.to_numpy()),rankdata(gdf.Ipast_two_arm.to_numpy()))
axs1.set_xlabel('Ipast_beads rank')
axs1.set_ylabel('Ipast_two_arm rank')
plt.savefig(figdir + 'group_Ipast-beads_rank_vs_Ipast-two-arm_rank.png',dpi=150)

fig2, axs2 = plt.subplots()
axs2.scatter(gdf.Ipast_beads[gdf['Ipast_two_arm'] < 0.1],gdf.Ipast_two_arm[gdf['Ipast_two_arm'] < 0.1])
axs2.set_xlabel('Ipast_beads')
axs2.set_ylabel('Ipast_two_arm')
axs2.set_title('Only subjects with Ipast two arm < 0.1')
plt.savefig(figdir + 'group_comp-IpastbeadsVSIpasttwoarm_by-IpasttwoarmLT0.1.png',dpi=150)

#%% Ipast beads vs beads task variables

gdf['beads_total_score'] = gdf['lowH_score'] + gdf['highH_score']
gdf['beads_total_duration'] = gdf['lowH_duration'] + gdf['highH_duration']
gdf['beads_task_first'] = np.nan
gdf.loc[gdf['first_task'] == 'beads','beads_task_first'] = 1
gdf.loc[gdf['first_task'] == 'two_arm','beads_task_first'] = 0
gdf['beads_lowH_first'] = np.nan
gdf.loc[gdf['first_bead_block'] == 'lowH','beads_lowH_first'] = 1
gdf.loc[gdf['first_bead_block'] == 'highH','beads_lowH_first'] = 0

beads_median_rts = sdf[sdf['task']=='beads'].groupby('subject')['rt'].median()
gdf = gdf.join(beads_median_rts,on='subject')
gdf.rename(columns={'rt':'beads_med_rt'},inplace=True)

beads_cols = ['Ipast_beads','beads_total_score','beads_med_rt','beads_task_first','beads_lowH_first','beads_total_duration']

pd.plotting.scatter_matrix(gdf[beads_cols],figsize=(12,12),s=100)
plt.savefig(figdir + 'group_comp-allbeadsvars.png',dpi=100)

#%% Ipast two arm vs two arm task vars
gdf['two_arm_total_score'] = gdf['two_arm24_score'] + gdf['two_arm28_score']
gdf['two_arm_total_duration'] = gdf['two_arm24_duration'] + gdf['two_arm28_duration']
gdf['two_arm24_first'] = np.nan
gdf.loc[gdf['first_two_arm_seq'] == 'seq24','two_arm24_first'] = 1
gdf.loc[gdf['first_two_arm_seq'] == 'seq28','two_arm24_first'] = 0
gdf['com_rew_stay_prob'] = (gdf['com_rew_stay24']+gdf['com_rew_stay28'])/(gdf['com_rew_total24']+gdf['com_rew_total28'])
gdf['rare_rew_stay_prob'] = (gdf['rare_rew_stay24']+gdf['rare_rew_stay28'])/(gdf['rare_rew_total24']+gdf['rare_rew_total28'])
gdf['com_norew_stay_prob'] = (gdf['com_norew_stay24']+gdf['com_norew_stay28'])/(gdf['com_norew_total24']+gdf['com_norew_total28'])
gdf['rare_norew_stay_prob'] = (gdf['rare_norew_stay24']+gdf['rare_norew_stay28'])/(gdf['rare_norew_total24']+gdf['rare_norew_total28'])
gdf['model_based_proxy'] = (gdf['com_rew_stay_prob']/gdf['rare_rew_stay_prob']) + (gdf['rare_norew_stay_prob']/gdf['com_norew_stay_prob'])

two_arm_median_rts = sdf[sdf['task']=='two_arm'].groupby('subject')['state1_rt'].median()
gdf = gdf.join(two_arm_median_rts,on='subject')
gdf.rename(columns={'state1_rt':'two_arm_med_rt'},inplace=True)

two_arm_cols = ['Ipast_two_arm','two_arm_total_score','two_arm_med_rt','beads_task_first','two_arm24_first','two_arm_total_duration','model_based_proxy']

pd.plotting.scatter_matrix(gdf[two_arm_cols])

#%% inter block consistency

# two_arm_seq24.rename(columns={'Trial':'trial_number'},inplace=True)
# two_arm_seq28.rename(columns={'Trial':'trial_number'},inplace=True)
sdf['state1_choice_optim'] = np.nan
for tt in sdf.trial_number[sdf['task']=='two_arm'].unique():
    sdf.state1_choice_optim[(sdf['trial_number']==tt) & (sdf['block_label']=='seq24')] = two_arm_seq24.loc[two_arm_seq24['Trial']==tt,'S0_A_star'].to_numpy()
    sdf.state1_choice_optim[(sdf['trial_number']==tt) & (sdf['block_label']=='seq28')] = two_arm_seq28.loc[two_arm_seq28['Trial']==tt,'S0_A_star'].to_numpy()

Ipast_beads_block1 = []
Ipast_beads_block2 = []
Ipast_beads_lowH = []
Ipast_beads_highH = []
Ipast_two_arm_block1 = []
Ipast_two_arm_block2 = []
two_arm_MIs = []
lowH_MIs = []
highH_MIs = []
for sj in sdf['subject'].unique():
    sjdf = sdf[sdf['subject']==sj].copy()
    
    task_var, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)],['bead','bead','bead','bead'],np.array([1,2,3,4]))
    preds = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)].to_numpy() - 1
    preds = preds[4:]
    Ipast_beads_block1.append(mutual_inf(task_var,preds))
    
    task_var, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)],['bead','bead','bead','bead'],np.array([1,2,3,4]))
    preds = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)].to_numpy() - 1
    preds = preds[4:]
    Ipast_beads_block2.append(mutual_inf(task_var,preds))
    
    task_var, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_label'] == 'lowH')],['bead','bead','bead','bead'],np.array([1,2,3,4]))
    preds = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_label'] == 'lowH')].to_numpy() - 1
    preds = preds[4:]
    Ipast_beads_lowH.append(mutual_inf(task_var,preds))
    
    actual = sjdf.bead[(sjdf['task'] == 'beads') & (sjdf['block_label'] == 'lowH')].to_numpy() - 1
    actual = actual[4:]
    lowH_MIs.append(mutual_inf(task_var,actual))
    
    task_var, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_label'] == 'highH')],['bead','bead','bead','bead'],np.array([1,2,3,4]))
    preds = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_label'] == 'highH')].to_numpy() - 1
    preds = preds[4:]
    Ipast_beads_highH.append(mutual_inf(task_var,preds))
    
    actual = sjdf.bead[(sjdf['task'] == 'beads') & (sjdf['block_label'] == 'highH')].to_numpy() - 1
    actual = actual[4:]
    highH_MIs.append(mutual_inf(task_var,actual))
    
    #['state1_action','rewarded','state2_visited','S0_A_star']
    task_var, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)],['state1_choice','rewarded','state2','state1_choice_optim'],np.array([1,1,1,1]))
    choices = sjdf.state1_choice[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)].to_numpy() - 1
    choices = choices[1:]
    Ipast_two_arm_block1.append(mutual_inf(task_var,choices))
    
    task_var, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)],['state1_choice','rewarded','state2','state1_choice_optim'],np.array([1,1,1,1]))
    choices = sjdf.state1_choice[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)].to_numpy() - 1
    choices = choices[1:]
    Ipast_two_arm_block2.append(mutual_inf(task_var,choices))
    
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)],['state1_choice','rewarded','state2','state1_choice_optim'],np.array([1,1,1,1]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)],['state1_choice','rewarded','state2','state1_choice_optim'],np.array([1,1,1,1]))
    task_var = np.concatenate((task_var1,task_var2))
    
    optim1 = sjdf.state1_choice_optim[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)].to_numpy() - 1
    optim2 = sjdf.state1_choice_optim[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)].to_numpy() - 1
    optim1 = optim1[1:]
    optim2 = optim2[1:]
    optim = np.concatenate((optim1,optim2))
    
    two_arm_MIs.append(mutual_inf(task_var,optim))
    
    
fig3, axs3 = plt.subplots()
axs3.plot(range(2),c='gray')
axs3.scatter(Ipast_beads_block1,Ipast_beads_block2)
axs3.set_xlabel('Ipast beads block 1')
axs3.set_ylabel('Ipast beads block 2')
plt.savefig(figdir + 'group_Ipast-beads_block1_vs_Ipast-beads_block2.png',dpi=150)

fig4, axs4 = plt.subplots()
axs4.plot(range(2),c='gray')
axs4.scatter(Ipast_two_arm_block1,Ipast_two_arm_block2)
axs4.set_xlabel('Ipast two arm block 1')
axs4.set_ylabel('Ipast two arm block 2')
plt.savefig(figdir + 'group_Ipast-two_arm_block1_vs_Ipast-two-arm_block2.png',dpi=150)

fig5, axs5 = plt.subplots()
axs5.plot(range(2),c='gray')
axs5.scatter(Ipast_beads_lowH,Ipast_beads_highH)
axs5.set_xlabel('Ipast beads low Hazard')
axs5.set_ylabel('Ipast beads high Hazard')
plt.savefig(figdir + 'group_Ipast-beads_lowH_vs_Ipast-beads_highH.png',dpi=150)

#%% two arm rank
gdf['Ipast_two_arm_rank'] = gdf['Ipast_two_arm'].rank()

two_arm_cols_rank = ['Ipast_two_arm_rank','two_arm_total_score','two_arm_med_rt','beads_task_first','two_arm24_first','two_arm_total_duration','model_based_proxy']

pd.plotting.scatter_matrix(gdf[two_arm_cols_rank],figsize=(14,14),s=100)
plt.savefig(figdir + 'group_comp-all_two-arm_vars_rank.png',dpi=100)

#%%
gdf['Ipast_beads_H'] = np.nan
gdf['Ipast_beads_b1'] = np.nan
gdf['Ipast_beads_b2'] = np.nan
gdf['Ipast_beads_b3'] = np.nan

gdf['Ipast_two_arm_S1A'] = np.nan
gdf['Ipast_two_arm_R'] = np.nan
gdf['Ipast_two_arm_S2'] = np.nan
gdf['Ipast_two_arm_S1Aoptim'] = np.nan

for sj in sdf['subject'].unique():
    sjdf = sdf[sdf['subject']==sj].copy()
    
    # Hazard
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)],['bead','bead','bead'],np.array([1,2,3]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)],['bead','bead','bead'],np.array([1,2,3]))
    task_var = np.concatenate((task_var1,task_var2))
    
    preds1 = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)].to_numpy() - 1
    preds1 = preds1[3:]
    preds2 = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)].to_numpy() - 1
    preds2 = preds2[3:]
    preds = np.concatenate((preds1,preds2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_beads_H'] = gdf.loc[gdf['subject']==sj,'Ipast_beads'] - mutual_inf(task_var,preds)
    
    # bead t-1
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)],['hazard_rate','bead','bead'],np.array([0,2,3]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)],['hazard_rate','bead','bead'],np.array([0,2,3]))
    task_var = np.concatenate((task_var1,task_var2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_beads_b1'] = gdf.loc[gdf['subject']==sj,'Ipast_beads'] - mutual_inf(task_var,preds)
    
    # bead t-2
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)],['hazard_rate','bead','bead'],np.array([0,1,3]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)],['hazard_rate','bead','bead'],np.array([0,1,3]))
    task_var = np.concatenate((task_var1,task_var2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_beads_b2'] = gdf.loc[gdf['subject']==sj,'Ipast_beads'] - mutual_inf(task_var,preds)
    
    # bead t-3
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)],['hazard_rate','bead','bead'],np.array([0,1,2]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)],['hazard_rate','bead','bead'],np.array([0,1,2]))
    task_var = np.concatenate((task_var1,task_var2))
    
    preds1 = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 1)].to_numpy() - 1
    preds1 = preds1[2:]
    preds2 = sjdf.choice[(sjdf['task'] == 'beads') & (sjdf['block_num'] == 2)].to_numpy() - 1
    preds2 = preds2[2:]
    preds = np.concatenate((preds1,preds2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_beads_b3'] = gdf.loc[gdf['subject']==sj,'Ipast_beads'] - mutual_inf(task_var,preds)
    
    #two arm
    #S1 choice t-1
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)],['rewarded','state2','state1_choice_optim'],np.array([1,1,1]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)],['rewarded','state2','state1_choice_optim'],np.array([1,1,1]))
    task_var = np.concatenate((task_var1,task_var2))
    
    choices1 = sjdf.state1_choice[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)].to_numpy() - 1
    choices1 = choices1[1:]
    choices2 = sjdf.state1_choice[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)].to_numpy() - 1
    choices2 = choices2[1:]
    choices = np.concatenate((choices1,choices2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_two_arm_S1A'] = gdf.loc[gdf['subject']==sj,'Ipast_two_arm'] - mutual_inf(task_var,choices)
    
    #R t-1
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)],['state1_choice','state2','state1_choice_optim'],np.array([1,1,1]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)],['state1_choice','state2','state1_choice_optim'],np.array([1,1,1]))
    task_var = np.concatenate((task_var1,task_var2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_two_arm_R'] = gdf.loc[gdf['subject']==sj,'Ipast_two_arm'] - mutual_inf(task_var,choices)
    
    #S2 t-1
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)],['state1_choice','rewarded','state1_choice_optim'],np.array([1,1,1]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)],['state1_choice','rewarded','state1_choice_optim'],np.array([1,1,1]))
    task_var = np.concatenate((task_var1,task_var2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_two_arm_S2'] = gdf.loc[gdf['subject']==sj,'Ipast_two_arm'] - mutual_inf(task_var,choices)
    
    #S1A optim t-1
    task_var1, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 1)],['state1_choice','rewarded','state2'],np.array([1,1,1]))
    task_var2, feat_num = encode_task_variables(sjdf[(sjdf['task'] == 'two_arm') & (sjdf['block_num'] == 2)],['state1_choice','rewarded','state2'],np.array([1,1,1]))
    task_var = np.concatenate((task_var1,task_var2))
    
    gdf.loc[gdf['subject']==sj,'Ipast_two_arm_S1Aoptim'] = gdf.loc[gdf['subject']==sj,'Ipast_two_arm'] - mutual_inf(task_var,choices)
    
# fig6, axs6 = plt.subplots(2,2,figsize=(6,6))
gdf.plot(x='Ipast_beads',y='beads_total_score',kind='scatter')
plt.savefig(figdir + 'group_Ipast_beads_VS_beads_score.png',dpi=150)
gdf.plot(x='Ipast_beads',y='beads_total_score',c='Ipast_beads_H',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_beads_H_VS_beads_score.png',dpi=150)
gdf.plot(x='Ipast_beads',y='beads_total_score',c='Ipast_beads_b1',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_beads_b1_VS_beads_score.png',dpi=150)
gdf.plot(x='Ipast_beads',y='beads_total_score',c='Ipast_beads_b2',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_beads_b2_VS_beads_score.png',dpi=150)
gdf.plot(x='Ipast_beads',y='beads_total_score',c='Ipast_beads_b3',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_beads_b3_VS_beads_score.png',dpi=150)

gdf.loc[7,'Ipast_two_arm_R'] = np.nan
gdf.loc[7,'Ipast_two_arm_S1Aoptim'] = np.nan
gdf.plot(x='Ipast_two_arm',y='two_arm_total_score',kind='scatter')
plt.savefig(figdir + 'group_Ipast_two_arm_VS_two_arm_score.png',dpi=150)
gdf.plot(x='Ipast_two_arm',y='two_arm_med_rt',kind='scatter')
plt.savefig(figdir + 'group_Ipast_two_arm_VS_two_arm_rt.png',dpi=150)
gdf.plot(x='Ipast_two_arm',y='two_arm_total_score',c='Ipast_two_arm_S1A',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_two_arm_S1A_VS_two_arm_score.png',dpi=150)
gdf.plot(x='Ipast_two_arm',y='two_arm_total_score',c='Ipast_two_arm_R',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_two_arm_R_VS_two_arm_score.png',dpi=150)
gdf.plot(x='Ipast_two_arm',y='two_arm_total_score',c='Ipast_two_arm_S2',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_two_arm_S2_VS_two_arm_score.png',dpi=150)
gdf.plot(x='Ipast_two_arm',y='two_arm_total_score',c='Ipast_two_arm_S1Aoptim',kind='scatter',cmap='viridis')
plt.savefig(figdir + 'group_Ipast_two_arm_S1Aoptim_VS_two_arm_score.png',dpi=150)

gdf.plot(x='Ipast_two_arm_rank',y='two_arm_total_score',kind='scatter')
plt.savefig(figdir + 'group_Ipast_two_arm_rank_VS_two_arm_score.png',dpi=150)
gdf.plot(x='Ipast_two_arm_rank',y='two_arm_med_rt',kind='scatter')
plt.savefig(figdir + 'group_Ipast_two_arm_rank_VS_two_arm_rt.png',dpi=150)
gdf.plot(x='Ipast_two_arm_rank',y='two_arm_total_score',c='Ipast_two_arm_S1A',kind='scatter',cmap='viridis')
gdf.plot(x='Ipast_two_arm_rank',y='two_arm_total_score',c='Ipast_two_arm_R',kind='scatter',cmap='viridis')
gdf.plot(x='Ipast_two_arm_rank',y='two_arm_total_score',c='Ipast_two_arm_S2',kind='scatter',cmap='viridis')
gdf.plot(x='Ipast_two_arm_rank',y='two_arm_total_score',c='Ipast_two_arm_S1Aoptim',kind='scatter',cmap='viridis')


gdf.plot(x='Ipast_two_arm',y='two_arm_total_score',c='model_based_proxy',kind='scatter',cmap='viridis')
gdf.plot(x='Ipast_two_arm_rank',y='two_arm_total_score',c='model_based_proxy',kind='scatter',cmap='viridis')

gdf.plot(x='model_based_proxy',y='Ipast_two_arm_S2',kind='scatter')
