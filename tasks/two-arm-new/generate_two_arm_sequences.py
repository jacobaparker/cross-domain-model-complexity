#!/usr/bin/env python

import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

## experiment hyperparameters

# trial parameters
Ntrials = 125
Nsequences = 30 # number of trial sequences generated

# reward probabilities and drift parameters
Rw_prob_pairs = [[0.75, 0.25],[0.6, 0.4]] #initial reward probabilities
Rw_prob_max = 0.75
Rw_prob_min = 0.25
Rw_drift_std = 0.025
Rw_drift_mean = 0

# transition probabilities
trans_probs_A1 = [0.7, 0.3] #transition probabilities from S0 to S1 and S2 by A1
trans_probs_A2 = [0.3, 0.7] #transition probabilities from S0 to S1 and S2 by A2

for s in range(10,Nsequences):

    ## convenience parameters
    PRw_add = [0,0,0,0]
    PRw_init = []
    for pair in Rw_prob_pairs:
        PRw_init.extend(random.sample(pair,2))
    PRw_all = np.zeros((Ntrials,4))

    ## generate sequences of trials using above parameters
    tdf = pd.DataFrame(
        {
        "Trial": np.arange(1,Ntrials+1),
        "S0_A1": np.random.binomial(1,1-trans_probs_A1[0],Ntrials),
        "S0_A2": np.random.binomial(1,1-trans_probs_A2[0],Ntrials),
        "PRw1": np.empty((Ntrials)),
        "PRw2": np.empty((Ntrials)),
        "PRw3": np.empty((Ntrials)),
        "PRw4": np.empty((Ntrials)),
        "Rw1": np.empty((Ntrials)),
        "Rw2": np.empty((Ntrials)),
        "Rw3": np.empty((Ntrials)),
        "Rw4": np.empty((Ntrials))
        }
    )
    # tdf.PRw1[0] = PRw_init[0]
    # tdf.PRw2[0] = PRw_init[1]
    # tdf.PRw3[0] = PRw_init[2]
    # tdf.PRw4[0] = PRw_init[3]
    PRw_all[0,:] = PRw_init

    for t in range(1,Ntrials):
        # tdf.PRw1[t] = tdf.PRw1[t-1] + Rw_add[0]
        # tdf.PRw2[t] = tdf.PRw2[t-1] + Rw_add[1]
        # tdf.PRw3[t] = tdf.PRw3[t-1] + Rw_add[2]
        # tdf.PRw4[t] = tdf.PRw4[t-1] + Rw_add[3]

        for r in range(len(PRw_add)):
            deltaRw = float(np.random.normal(Rw_drift_mean, Rw_drift_std, 1))
            if PRw_all[t-1,r] + deltaRw > Rw_prob_max:
                PRw_add[r] = 2*Rw_prob_max - 2*PRw_all[t-1,r] - deltaRw
            elif PRw_all[t-1,r] + deltaRw < Rw_prob_min:
                PRw_add[r] = 2*Rw_prob_min - 2*PRw_all[t-1,r] - deltaRw
            else:
                PRw_add[r] = deltaRw


        PRw_all[t,:] = PRw_all[t-1,:] + PRw_add

    tdf.PRw1 = PRw_all[:,0]
    tdf.PRw2 = PRw_all[:,1]
    tdf.PRw3 = PRw_all[:,2]
    tdf.PRw4 = PRw_all[:,3]

    for t in range(len(tdf)):
        tdf.loc[t,'Rw1'] = int(tdf.PRw1[t] > random.random())
        tdf.loc[t,'Rw2'] = int(tdf.PRw2[t] > random.random())
        tdf.loc[t,'Rw3'] = int(tdf.PRw3[t] > random.random())
        tdf.loc[t,'Rw4'] = int(tdf.PRw4[t] > random.random())

    ax1 = tdf.plot.line(x="Trial",y=['PRw1','PRw2','PRw3','PRw4'])
    plt.savefig("stimuli/seq" + str(s) + "_rew-prob.png")

    # finish this raster plot
    Rw1_ind = np.array(np.nonzero(tdf.Rw1)).flatten()
    Rw2_ind = np.array(np.nonzero(tdf.Rw2)).flatten()
    Rw3_ind = np.array(np.nonzero(tdf.Rw3)).flatten()
    Rw4_ind = np.array(np.nonzero(tdf.Rw4)).flatten()

    fig3, ax3 = plt.subplots(1,1)
    ax3.scatter(Rw1_ind+1,1*np.ones((Rw1_ind.shape[0])),marker="|")
    ax3.scatter(Rw2_ind+1,2*np.ones((Rw2_ind.shape[0])),marker="|")
    ax3.scatter(Rw3_ind+1,3*np.ones((Rw3_ind.shape[0])),marker="|")
    ax3.scatter(Rw4_ind+1,4*np.ones((Rw4_ind.shape[0])),marker="|")
    plt.savefig("stimuli/seq"+str(s)+"_rew-actual.png")

    ax2 = tdf.plot.scatter(x="Trial",y="S0_A1",c='b')
    tdf.plot.scatter(x="Trial",y="S0_A2",c='orange',ax=ax2)
    plt.savefig("stimuli/seq" + str(s) + "_state-trans.png")

    tdf.to_csv(
        path_or_buf="stimuli/seq"+str(s)+".csv",
        header=True,
        index=False
    )

    # fig1 = plt.figure()
    # ax1 = fig1.add_subplot(1, 1, 1)
