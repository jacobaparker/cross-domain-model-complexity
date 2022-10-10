var FreshBlock = 'on';
var ChoiceDirection = '';
var PreviousTrialIndex = 0;
var Correct = 0;
var TaskType = '';
var Block_Index = 0;
var instruction_picker = 1;
var beads_path = './tasks/HMM-beads/';
var beads_quiz_correct = false;
var beads_practice_file = './tasks/HMM-beads/stimuli/low_hazard_H10.json';
var beads_lowH_file = './tasks/HMM-beads/stimuli/low_hazard_H01.json';
var beads_highH_file = './tasks/HMM-beads/stimuli/high_hazard_H99.json';
var beads_trial_num = 1;

// Session order - uncomment the order you want
// var All_Type = ['Low_HMMActual', 'Low_HMMActual', 'Low_HMMActual', 'Low_HMMActual'];
//var All_Type = ['Low_HMMActual','High_HMMActual','Low_MMActual','High_MMActual']
// var Block_Type = All_Type[Block_Index];

//script_number = Math.floor(Math.random() * 90) + 1;
// var script_picker = 17

if (Math.random() >= 0.5) {
  var block_order = ['practice','lowH','highH'];
} else {
  var block_order = ['practice','highH','lowH'];
}
var Block_Type = block_order[Block_Index];

readTextFile(beads_practice_file, function(text){
  beads_prac_data = JSON.parse(text);
});

readTextFile(beads_lowH_file, function(text){
  beads_lowH_data = JSON.parse(text);
});

readTextFile(beads_highH_file, function(text){
  beads_highH_data = JSON.parse(text);
});

// Low_HMMData = $ .get(beads_path + `stimuli/low_hazard_HMM10/low_hazard_HMM_Actual.csv`, function(){
//     Low_HMMActual = Papa.parse(Low_HMMData.responseText, {
//         dynamicTyping: true
//     });
// });


function centered_message(message) {
    return '<div class="container" style="height:800px;width:800px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font-weight:normal;font-family:Arial;font-size:20px">' + message + '<div>';
}

function centered_message_image(message) {
return '<div class="container" style="height:200px;width:800px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:left;font-weight:normal;font-family:Arial;font-size:20px">' + message + '<div>';
}

var beads_images = ["tutorial/tutorial-01.png",
"tutorial/tutorial-02.png",
"tutorial/tutorial-03.png",
"tutorial/tutorial-04.png",
"tutorial/tutorial-05.png",
"tutorial/tutorial-06.png",
"tutorial/tutorial-07.png",
"tutorial/tutorial-08.png",
"tutorial/tutorial-09.png",
"tutorial/tutorial-10.png",
"tutorial/tutorial-11.png",
"tutorial/tutorial-12.png",
"tutorial/tutorial-13.png",
"tutorial/tutorial-14.png",
"tutorial/tutorial-15.png",
"tutorial/tutorial-16.png",
"tutorial/tutorial-17.png",
"tutorial/tutorial-18.png",
"tutorial/tutorial-19.png",
"tutorial/tutorial-20.png",
"tutorial/tutorial-21.png",
"tutorial/tutorial-22.png",
"Images/BlackBeadChoice.png",
"Images/BlackBeadChoiceCorrect.png",
"Images/BlackBeadChoiceCorrectMM.png",
"Images/BlackBeadChoiceMM.png",
"Images/BlackBeadChoiceWrong.png",
"Images/BlackBeadChoiceWrongMM.png",
"Images/NewTrialBC.png",
"Images/NewTrialBCMM.png",
"Images/NewTrialWC.png",
"Images/NewTrialWCMM.png",
"Images/NoChoice.png",
"Images/NoChoiceMM.png",
"Images/TutorialBlackJarDrawHMMC.png",
"Images/TutorialBlackJarDrawHMMI.png",
"Images/TutorialBlackJarDrawMM.png",
"Images/TutorialQuestion1.png",
"Images/TutorialQuestion2.png",
"Images/TutorialWhiteJarDrawHMMC.png",
"Images/TutorialWhiteJarDrawMM.png",
"Images/WhiteBeadChoice.png",
"Images/WhiteBeadChoiceCorrect.png",
"Images/WhiteBeadChoiceCorrectMM.png",
"Images/WhiteBeadChoiceMM.png",
"Images/WhiteBeadChoiceWrong.png",
"Images/WhiteBeadChoiceWrongMM.png",
"Images/BlackBall.png",
"Images/WhiteBall.png",
"Images/BlackJar_HMM.png",
"Images/WhiteJar_HMM.png",
"Images/NewTrialScreen.png",
"Instructions/Slide1.png",
"Instructions/Slide2.png",
"Instructions/Slide3.png"
];

for (let jj = 0; jj < beads_images.length; jj++) {
  beads_images[jj] = beads_path + beads_images[jj];
}

// function prependString(arr, str) {
//   for (let ii = 0; ii < arr.length; ii++) {
//     arr[ii] = str + arr[ii];
//   }
//   return arr
// }
//
// beads_images = prependString(beads_images, beads_path);

var beads_preload = {
  type: jsPsychPreload,
	images: beads_images
};
// preload.push(beads_preload)

var beads_instructions_block1 = {
	type: jsPsychInstructions,
	pages: beads_instructions_1_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}
// timeline.push(beads_instructions_block1)

var beads_quiz1_Q1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div align=center>Your goal is to predict…?<br><br></div>`,
  choices: ['The color of the previous bead','The color of the next bead','The jar being selected'],
  on_finish: function(trial) {
    if (trial.response === 1) {beads_quiz_correct = true;}
    else {beads_quiz_correct = false;}
  }
}

var beads_quiz1_Q1_wrapper = {
  timeline: [beads_quiz1_Q1],
  loop_function: function(trial) {
    if (beads_quiz_correct) {
      alert("Correct!");
      return false;
    } else {
      alert("Incorrect, please try again.");
      return true;
    }
  }
}

var beads_quiz1_Q2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div align=center>In the jar with mostly white beads, there are ___% white beads and ___% black beads?<br><br></div>`,
  choices: ['50%, 50%','25%, 75%','80%, 20%'],
  on_finish: function(trial) {
    if (trial.response === 2) {beads_quiz_correct = true;}
    else {beads_quiz_correct = false;}
  }
}

var beads_quiz1_Q2_wrapper = {
  timeline: [beads_quiz1_Q2],
  loop_function: function(trial) {
    if (beads_quiz_correct) {
      alert("Correct!");
      return false;
    } else {
      alert("Incorrect, please try again.");
      return true;
    }
  }
}

var beads_quiz1_Q3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div align=center>When there is a 1% probability that the jars will switch, the next bead will most likely be drawn from the…<br><br></div>`,
  choices: ['Same jar','Different jar'],
  on_finish: function(trial) {
    if (trial.response === 0) {beads_quiz_correct = true;}
    else {beads_quiz_correct = false;}
  }
}

var beads_quiz1_Q3_wrapper = {
  timeline: [beads_quiz1_Q3],
  loop_function: function(trial) {
    if (beads_quiz_correct) {
      alert("Correct!");
      return false;
    } else {
      alert("Incorrect, please try again.");
      return true;
    }
  }
}

var beads_quiz1_Q4 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div align=center>When there is a 99% probability that the jars will switch, the next bead will most likely be drawn from the…<br><br></div>`,
  choices: ['Same jar','Different jar'],
  on_finish: function(trial) {
    if (trial.response === 1) {beads_quiz_correct = true;}
    else {beads_quiz_correct = false;}
  }
}

var beads_quiz1_Q4_wrapper = {
  timeline: [beads_quiz1_Q4],
  loop_function: function(trial) {
    if (beads_quiz_correct) {
      alert("Correct!");
      return false;
    } else {
      alert("Incorrect, please try again.");
      return true;
    }
  }
}

var beads_quiz1 = {
  timeline: [beads_quiz1_Q1_wrapper, beads_quiz1_Q2_wrapper, beads_quiz1_Q3_wrapper, beads_quiz1_Q4_wrapper]
}

var beads_instructions_block2 = {
	type: jsPsychInstructions,
	pages: beads_instructions_2_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}

var beads_instructions_block3 = {
	type: jsPsychInstructions,
	pages: beads_instructions_3_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}

var beads_instructions_block4 = {
	type: jsPsychInstructions,
	pages: beads_instructions_4_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}

// var beads_test_instr = {
//   type: jsPsychImageKeyboardResponse,
//   stimulus: beads_path + 'instructions/Slide1.PNG',
//   choices: [' ']
// }
// timeline.push(beads_test_instr)

var beads_instruction_trial = {
  type: jsPsychImageKeyboardResponse,
  stimulus: '',
  choices: [' '],
  stimulus_width: 800,
  on_start: function(trial){
    trial.stimulus = beads_path + 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
  },
  on_finish: function(trial){
    instruction_picker = instruction_picker + 1;
  }
};

var beads_instruction_block = {
    timeline: [beads_instruction_trial],
    repetitions: 14
};

var beads_Instruction_trialQ1 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: '',
  choices: ['ArrowUp'],
  stimulus_width: 800,
  prompt: '',
  on_start: function(trial){
    trial.stimulus = beads_path + 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
  },
  on_finish: function(info) {
    alert('Correct!');
    instruction_picker = instruction_picker + 1;
  }
};
var beads_Instruction_trialQ2 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: '',
  choices: ['ArrowRight'],
  stimulus_width: 800,
  prompt: '',
  on_start: function(trial){
    trial.stimulus = beads_path + 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
  },
  on_finish: function(info) {
    alert('Correct!');
    instruction_picker = instruction_picker + 1;
  }
};
var beads_Instruction_trialQ3 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: '',
  choices: ['ArrowLeft'],
  stimulus_width: 800,
  prompt: '',
  on_start: function(trial){
    trial.stimulus = beads_path + 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
  },
  on_finish: function(info) {
    alert('Correct!');
    instruction_picker = instruction_picker + 1;
  }
};
var beads_Instruction_trialQ4 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: '',
  choices: ['ArrowLeft'],
  stimulus_width: 800,
  prompt: '',
  on_start: function(trial){
    trial.stimulus = beads_path + 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
  },
  on_finish: function(info) {
    alert('Correct!');
    instruction_picker = instruction_picker + 1;
  }
};

var beads_intro_block = {
  timeline: [beads_instruction_block, beads_Instruction_trialQ1,beads_Instruction_trialQ2,beads_Instruction_trialQ3,beads_instruction_trial]
}
// timeline.push(beads_intro_block)


LHMM_text = '<p style="font-family:Arial;text-align:center;width:800px;font-size:18px"> Press the SPACEBAR to continue.</p>';

var beads_load_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: [' '],
    prompt: 'Press SPACEBAR to start.',
    on_start: function(trial) {
        Block_Type = block_order[Block_Index];

        switch(Block_Type) {
            case 'practice':
              CurrentBlock = beads_prac_data;
              TaskType = ''
              trial.stimulus = `<div align=center>In this practice block, there will be a <b>10% chance</b> that the jar on the next trial will be different from the jar on the current trial.<br><br></div>`
              break;
            case 'lowH':
              CurrentBlock = beads_lowH_data;
              TaskType = ''
              trial.stimulus = `<div align=center>In this block, there will be a <b>1% chance</b> that the jar on the next trial will be different from the jar on the current trial.<br><br></div>`
              break;
            case 'highH':
              CurrentBlock = beads_highH_data;
              TaskType = ''
              trial.stimulus = `<div align=center>In this block, there will be a <b>99%</b> chance that the jar on the next trial will be different from the jar on the current trial.<br><br></div>`
              break;
        }
        beads_trial_num = 0;
    },
};


var beads_TrialStart = {

    type: jsPsychImageKeyboardResponse,
    stimulus: '',
    stimulus_width: 900,
    maintain_aspect_ratio: true,
    prompt: "<p>Use the F or J key to select a color.</p>",
    choices: ['f','j'],
    on_start: function(trial){

        switch(FreshBlock) {
        case 'on':
            trial.stimulus = beads_path + 'Images/NoChoice' + TaskType + '.png';
            BeadColor = CurrentBlock[beads_trial_num].Bead;
            PreviousBeadColor = 0;
            FreshBlock = 'off';
            break;
        case 'off':
            BeadColor = CurrentBlock[beads_trial_num].Bead;
            PreviousBeadColor = CurrentBlock[beads_trial_num-1].Bead;

            switch(PreviousBeadColor) {
                case '1':
                    trial.stimulus = beads_path + 'Images/NewTrialBC' + TaskType + '.png';
                    break;
                case '2':
                    trial.stimulus = beads_path + 'Images/NewTrialWC'  + TaskType + '.png';
                    break;
            }
        }
    },

    on_finish: function(trial){
        if (trial.response === 'f') {
            ChoiceDirection = '1';
        } else if (trial.response ==='j') {
            ChoiceDirection = '2';
        }
        jsPsych.data.get().addToLast({
          block: Block_Type,
          trial_number: beads_trial_num,
          jar: CurrentBlock[beads_trial_num].Urn,
          bead: BeadColor,
          previous_bead: PreviousBeadColor,
          choice: ChoiceDirection,
          correct: ChoiceDirection === BeadColor
        })
    },
};

var beads_SubjectChoice = {
    type: jsPsychImageKeyboardResponse,
    stimulus: '',
    // button_html: ['<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
    //             '<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
    //             '<button class="jspsych-btn" style="background-color:white; color:black; display:block">%choice%</button>',
    //             '<button class="jspsych-btn"style="background-color:white; color:black; display:block">%choice%</button>' ],
    // choices: ['Black Bead - HIGH Confidence', 'Black Bead - LOW Confidence', 'White Bead - HIGH Confidence', 'White Bead - LOW Confidence'],
    choices: [],
    prompt: "<p>Use the F or J key to select a color.</p>",
    stimulus_width: 900,
    maintain_aspect_ratio: true,
    trial_duration: 300,
    response_ends_trial: false,
    on_start: function(trial){

        switch(ChoiceDirection) {
            case '1':
                trial.stimulus = beads_path + 'Images/BlackBeadChoice' + TaskType + '.png';
                break;
            case '2':
                trial.stimulus = beads_path + 'Images/WhiteBeadChoice'  + TaskType + '.png';
                break;
        }
    },
};


var beads_BeadAppears = {
    type: jsPsychImageKeyboardResponse,
    stimulus: '',
    choices: [],
    prompt: "<p>Use the F or J key to select a color.</p>",
    stimulus_width: 900,
    maintain_aspect_ratio: true,
    trial_duration: 500,
    response_ends_trial: false,
    on_start: function(trial){

        BeadAppearsImage = ChoiceDirection + BeadColor;

        switch(BeadAppearsImage) {

            case '22':
                trial.stimulus = beads_path + 'Images/WhiteBeadChoiceCorrect'  + TaskType + '.png';
                Correct += 1;
                break;
            case '21':
                trial.stimulus = beads_path + 'Images/WhiteBeadChoiceWrong' + TaskType + '.png';
                break;
            case '12':
                trial.stimulus = beads_path + 'Images/BlackBeadChoiceWrong' + TaskType + '.png';
                break;
            case '11':
                trial.stimulus = beads_path + 'Images/BlackBeadChoiceCorrect' + TaskType + '.png';
                Correct += 1;
                break;
        }
    beads_trial_num += 1;

    },
    on_finish: function() {
    // at the end of each trial, update the progress bar
    // based on the current value and the proportion to update for each trial
        // var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
        // jsPsych.setProgressBar(curr_progress_bar_value + (1/500));
    }

}

var beads_reset_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: [' '],
    prompt: '',
    on_start: function(trial){
        trial.prompt = '<p style="height:800px;width:800px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font-weight:normal;font-family:Arial;font-size:20px">&hellip;end of block. Your score in this block was: ' + Correct + ' <br> Press SPACEBAR to continue.'
    },
    on_finish: function(trial){
        FreshBlock = 'on'
        Block_Index += 1
        Correct = 0

    }
};

var beads_training_trials = {
    timeline: [beads_TrialStart,beads_SubjectChoice,beads_BeadAppears],
    repetitions: beads_prac_ntrials
};

var beads_training_block = {
  timeline: [beads_load_trial, beads_training_trials, beads_reset_trial]
}

var beads_experiment_trials = {
    timeline: [beads_TrialStart,beads_SubjectChoice,beads_BeadAppears],
    repetitions: beads_exp_ntrials
};

var beads_experiment_block = {
  timeline: [beads_load_trial, beads_experiment_trials, beads_reset_trial]
}

var HMM_beads_task = {
  timeline: [
    beads_preload,
    beads_instructions_block1,
    beads_quiz1,
    beads_instructions_block2,
    beads_training_block,
    beads_instructions_block3,
    beads_experiment_block,
    beads_instructions_block4,
    beads_experiment_block
  ]
}
