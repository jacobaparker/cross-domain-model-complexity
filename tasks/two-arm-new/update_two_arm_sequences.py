#!/usr/bin/env python

import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

seqnum = 8

tdf = pd.read_csv("stimuli/seq"+str(seqnum)+".csv")

tdf['Rw1'] = np.empty((len(tdf)))
tdf['Rw2'] = np.empty((len(tdf)))
tdf['Rw3'] = np.empty((len(tdf)))
tdf['Rw4'] = np.empty((len(tdf)))

for t in range(len(tdf)):
    tdf.Rw1.iloc[t] = int(tdf.PRw1[t] > random.random())
    tdf.Rw2.iloc[t] = int(tdf.PRw2[t] > random.random())
    tdf.Rw3.iloc[t] = int(tdf.PRw3[t] > random.random())
    tdf.Rw4.iloc[t] = int(tdf.PRw4[t] > random.random())

Rw1_ind = np.nonzero(tdf.Rw1)
Rw2_ind = np.nonzero(tdf.Rw2)
Rw3_ind = np.nonzero(tdf.Rw3)
Rw4_ind = np.nonzero(tdf.Rw4)

fig3, ax3 = plt.subplots(1,1)
ax3.scatter(Rw1_ind+1,1*np.ones(len(Rw1_ind)),'k')
ax3.scatter(Rw2_ind+1,1*np.ones(len(Rw2_ind)),'k')
ax3.scatter(Rw3_ind+1,1*np.ones(len(Rw3_ind)),'k')
ax3.scatter(Rw4_ind+1,1*np.ones(len(Rw4_ind)),'k')
plt.savefig("stimuli/seq"+str(seqnum)+"_rew-actual.png")

tdf.to_csv(
    path_or_buf="stimuli/seq"+str(seqnum)+".csv",
    header=True,
    index=False
)
