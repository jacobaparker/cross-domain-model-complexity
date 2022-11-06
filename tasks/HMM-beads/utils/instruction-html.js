var beads_instructions_1_text = function() {
  var html_arr = [
    `<div align=center>In this task, you will see black or white beads being drawn (pulled) from jars.<br><br>On each trial, a bead will be drawn from one of two jars. Once you see this bead, your goal is to predict the color of the <b>NEXT</b> bead.<br><br>Every time you correctly guess the color of the <b>NEXT</b> bead, you will get a point. The more points you get, the higher your bonus will be at the end of the experiment.<br><br></div>`,
    `<div align=justify>There are two types of jars:<br><br>1.   Jars filled with 80% white beads and 20% black beads.<br><br>2.   Jars filled with 20% white beads and 80% black beads.<br><br></div>`,
    `<div align=center><img src="tasks/HMM-beads/Images/WhiteJar_HMM.png" width="200"><br><br>This is a jar filled with 80% white beads and 20% black beads.<br><br></div>`,
    `<div align=center><img src="tasks/HMM-beads/Images/BlackJar_HMM.png" width="200"><br><br>This is a jar filled with 20% white beads and 80% black beads.<br><br></div>`,
    `<div align=center><img src="tasks/HMM-beads/Images/NewTrialScreen.PNG" width="800"><br><br>Here is an example of what you will see on each trial.<br><br></div>`,
    `<div align=center>The jar the beads are drawn from is NOT chosen randomly on each trial.<br><br>After each trial, there will be a chance that the jars will switch, and that the next bead will be pulled from the opposite jar as the previous trial.<br><br>In each block, the chance that a jar will switch will either be LOW (the jars will not switch very often), or HIGH (the jars will switch almost all the time).<br><br>At the start of each block, you will be told the probability that the jars will switch on each trial. This switch probability will stay constant throughout the block.<br><br></div>`,
    `<div align=center>We will now show you some examples of beads being drawn from jars. The bead will appear in the middle of the screen, and the jar the bead was pulled from will be indicated with a green rectangle.<br><br></div>`,
    `<div align=center><img src="tasks/HMM-beads/instructions/Slide1.jpg" width="800"><br><br>A black bead was drawn from the 80% black jar.<br><br></div>`,
    `<div align=center><img src="tasks/HMM-beads/instructions/Slide2.jpg" width="800"><br><br>The jar being used switched.<br><br>Now, a white bead was drawn from the 80% white jar.<br><br></div>`,
    `<div align=center><img src="tasks/HMM-beads/instructions/Slide3.jpg" width="800"><br><br>The jar being used switched again.<br><br>However, a low-probability white bead was drawn from the 80% black jar.<br><br></div>`,
    `<div align=center>Since the jars have both black and white beads, the best strategy to predict the NEXT bead is to first guess which jar the current bead came from, then use the jar-switch probability to predict which jar will be used next.<br><br></div>`,
    // `<div align=center>In summary, there is a <font color="orange">10% chance</font> that the jar being used will <font color="orange">switch</font> between trials. In other words, the jar will almost always stay the same.<br><br>The jar on the left contains <b>80% black beads and 20% white beads</b>.<br><br>The jar on the right contains <b>20% black beads and 80% white beads</b>.<br><br></div>`,
    `<div align=center>You will now be given a 4 question quiz to make sure you understand the task.<br><br></div>`
  ];
  return html_arr
}

var beads_instructions_2_text = function() {
  var html_arr = [
    `<div align=justify><b>You will start with a short practice block of 20 trials.</b><br><br>Remember:<br><ul><li>The jar on the left contains <b>80% black beads and 20% white beads</b>.</li><li>The jar on the right contains <b>20% black beads and 80% white beads</b>.</li></ul><br>The best strategy to predict the <b>NEXT</b> bead is to predict the jar the next bead will come from.<br><br></div>`,
  ];
  return html_arr
}

var beads_instructions_3_text = function() {
  var html_arr = [
    `<div align=center>You've finished the practice block and will now move on to the real experiment.<br><br><b>The percent of beads you predict correctly will determine how much bonus money you make</b>. For every percentage point correct you are, you will receive 1 cent. For example, if you predict 75% of beads accurately, you will receive <b>$0.75</b>.<br><br>On average, people win about <b>$0.70 to $0.75</b>.<br><br>`,
    `<div align=center><b>You will now begin the main block (1/2).</b><br><br>The first block will take about 9 minutes.<br><br></div>`
  ];
  return html_arr
}

var beads_instructions_4_text = function() {
  var html_arr = [
    `<div align=center>You have finished the first block!<br><br>Please feel free to take a break before starting the next block.<br><br></div>`,
    `<div align=justify><b>As a reminder:</b><br><br><ul><li>The jar on the left contains <b>80% black beads and 20% white beads</b>.</li><li>The jar on the right contains <b>20% black beads and 80% white beads</b>.</li></ul><br>The best strategy to predict the <b>NEXT</b> bead is to predict the jar the next bead will come from.<br><br></div>`,
    `<div align=center><b>You will now begin the final block (2/2).</b><br><br>The final block will take about 9 minutes.<br><br></div>`
  ];
  return html_arr
}

var beads_debrief_block_text = function(score, bonus) {
  var html_arr = [
    `<div align=center>Congrats! You have finished the beads prediction game.<br><br>You predicted ` + (score*100/(beads_exp_ntrials*2)).toFixed(2) + `% of beads correctly.<br><br>You won $` + bonus.toFixed(2) + ` cents!<br><br></div>`
  ]
  return html_arr
}
