#!/usr/bin/env python

import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

seqnum = 2

tdf = pd.read_csv("stimuli/seq"+str(seqnum)+".csv")

tdf['Rw1'] = np.empty((len(tdf)))
tdf['Rw2'] = np.empty((len(tdf)))
tdf['Rw3'] = np.empty((len(tdf)))
tdf['Rw4'] = np.empty((len(tdf)))

for t in range(len(tdf)):
    tdf.loc[t,'Rw1'] = int(tdf.PRw1[t] > random.random())
    tdf.loc[t,'Rw2'] = int(tdf.PRw2[t] > random.random())
    tdf.loc[t,'Rw3'] = int(tdf.PRw3[t] > random.random())
    tdf.loc[t,'Rw4'] = int(tdf.PRw4[t] > random.random())

Rw1_ind = np.array(np.nonzero(tdf.Rw1)).flatten()
Rw2_ind = np.array(np.nonzero(tdf.Rw2)).flatten()
Rw3_ind = np.array(np.nonzero(tdf.Rw3)).flatten()
Rw4_ind = np.array(np.nonzero(tdf.Rw4)).flatten()

fig3, ax3 = plt.subplots(1,1)
ax3.scatter(Rw1_ind+1,1*np.ones((Rw1_ind.shape[0])),marker="|")
ax3.scatter(Rw2_ind+1,2*np.ones((Rw2_ind.shape[0])),marker="|")
ax3.scatter(Rw3_ind+1,3*np.ones((Rw3_ind.shape[0])),marker="|")
ax3.scatter(Rw4_ind+1,4*np.ones((Rw4_ind.shape[0])),marker="|")
plt.savefig("stimuli/seq"+str(seqnum)+"_rew-actual.png")

tdf.to_csv(
    path_or_buf="stimuli/seq"+str(seqnum)+"_new.csv",
    header=True,
    index=False
)
