import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

seqnum = 28

tdf = pd.read_csv("stimuli/seq"+str(seqnum)+".csv")

tdf['S0_A_star'] = np.empty((len(tdf)))
tdf['S1_A_star'] = np.empty((len(tdf)))

# because the first state transition probabilities are equal in this study, the
# best actions correspond to the second state option with the highest reward
# probablity
A_map = [0,0,1,1]
Rw_probs = np.array(tdf[['PRw1','PRw2','PRw3','PRw4']])
for t in range(len(tdf)):
    Rw_ind = Rw_probs[t,:].argmax()
    tdf.loc[t,'S0_A_star'] = A_map[Rw_ind]
    tdf.loc[t,'S1_A_star'] = Rw_ind

tdf.to_csv(
    path_or_buf="stimuli/seq"+str(seqnum)+"_optim.csv",
    header=True,
    index=False
)
