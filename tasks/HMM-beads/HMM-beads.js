var FreshBlock = 'on';
var ChoiceDirection = '';
var PreviousTrialIndex = 0;
var RelativeTrialIndex = 1;
var Correct = 0;
var TaskType = '';
var Block_Index = 0;
var instruction_picker = 1;
var beads_path = './tasks/HMM-beads/'

// Session order - uncomment the order you want
var All_Type = ['Low_HMMActual', 'Low_HMMActual', 'Low_HMMActual', 'Low_HMMActual'];
//var All_Type = ['Low_HMMActual','High_HMMActual','Low_MMActual','High_MMActual']
var Block_Type = All_Type[Block_Index];

//script_number = Math.floor(Math.random() * 90) + 1;
// var script_picker = 17

Low_HMMData = $ .get(beads_path + `stimuli/low_hazard_HMM10/low_hazard_HMM_Actual.csv`, function(){
    Low_HMMActual = Papa.parse(Low_HMMData.responseText, {
        dynamicTyping: true
    });
});


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
preload.push(beads_preload)

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
timeline.push(beads_intro_block)


LHMM_text = '<p style="font-family:Arial;text-align:center;width:800px;font-size:18px"> Press the SPACEBAR to continue.</p>';

var beads_load_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: centered_message('<p>Loading episode&hellip;</p>'),
    choices: [' '],
    prompt: '',
    on_start: function(trial) {
    // script_picker += 1
        var Block_Type = All_Type[Block_Index];

        switch(Block_Type) {
            case 'Low_HMMActual':
                trial.prompt = LHMM_text;
                break;
        }
    },
    on_finish: function(trial) {
        var Block_Type = All_Type[Block_Index]

        switch(Block_Type) {
            case 'Low_HMMActual':
            CurrentBlock = Low_HMMActual
            TaskType = ''
            break;
        }

        //jsPsych.setProgressBar(0);
    }
};


var beads_TrialStart = {

    type: jsPsychImageButtonResponse,
    stimulus: '',
    stimulus_width: 900,
    maintain_aspect_ratio: true,
    prompt: "<p>Please select a bead color and your confidence in that choice.</p>",
    button_html: ['<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
                    '<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
                    '<button class="jspsych-btn" style="background-color:white; color:black; display:block">%choice%</button>',
                    '<button class="jspsych-btn"style="background-color:white; color:black; display:block">%choice%</button>' ],
    choices: ['Black Bead - HIGH Confidence', 'Black Bead - LOW Confidence', 'White Bead - HIGH Confidence', 'White Bead - LOW Confidence'],
    /*
    button_html: ['<button class="jspsych-btn" style="background-color:black; color:white">%choice%</button>',
    '<button class="jspsych-btn" style="background-color:black; color:white">%choice%</button>',
    '<button class="jspsych-btn" style="background-color:white; color:black">%choice%</button>',
    '<button class="jspsych-btn"style="background-color:white; color:black">%choice%</button>' ],
    choices: ['Black Bead - LOW Confidence', 'Black Bead - HIGH Confidence', 'White Bead - LOW Confidence', 'White Bead - HIGH Confidence'],
    */
    on_start: function(trial){

        switch(FreshBlock) {
        case 'on':
            trial.stimulus = beads_path + 'Images/NoChoice' + TaskType + '.png';
            BeadColor = CurrentBlock.data[RelativeTrialIndex][1];
            FreshBlock = 'off';
            break;
        case 'off':
            BeadColor = CurrentBlock.data[RelativeTrialIndex][1];
            PreviousBeadColor = CurrentBlock.data[RelativeTrialIndex-1][1];

            switch(PreviousBeadColor) {
                case 1:
                    trial.stimulus = beads_path + 'Images/NewTrialBC' + TaskType + '.png';
                    break;
                case 2:
                    trial.stimulus = beads_path + 'Images/NewTrialWC'  + TaskType + '.png';
                    break;
            }
        }
    },

    on_finish: function(trial){
        if(trial.response === 0 || trial.response === 1) {
            ChoiceDirection = '1';
        }
        if(trial.response === 2 || trial.response === 3) {
            ChoiceDirection = '2';
        }
    },
};

var beads_SubjectChoice = {
    type: jsPsychImageButtonResponse,
    stimulus: '',
    button_html: ['<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
                '<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
                '<button class="jspsych-btn" style="background-color:white; color:black; display:block">%choice%</button>',
                '<button class="jspsych-btn"style="background-color:white; color:black; display:block">%choice%</button>' ],
    choices: ['Black Bead - HIGH Confidence', 'Black Bead - LOW Confidence', 'White Bead - HIGH Confidence', 'White Bead - LOW Confidence'],
    prompt: "<p>Please select a bead color and your confidence in that choice.</p>",
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
    type: jsPsychImageButtonResponse,
    stimulus: '',
    button_html: ['<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
                '<button class="jspsych-btn" style="background-color:black; color:white; display:block">%choice%</button>',
                '<button class="jspsych-btn" style="background-color:white; color:black; display:block">%choice%</button>',
                '<button class="jspsych-btn"style="background-color:white; color:black; display:block">%choice%</button>' ],
    choices: ['Black Bead - HIGH Confidence', 'Black Bead - LOW Confidence', 'White Bead - HIGH Confidence', 'White Bead - LOW Confidence'],
    prompt: "<p>Please select a bead color and your confidence in that choice.</p>",
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
    RelativeTrialIndex += 1;

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
        //RelativeTrialIndex = 1
        Block_Index += 1
        Correct = 0

    }
};

var beads_training_trials = {
    timeline: [beads_TrialStart,beads_SubjectChoice,beads_BeadAppears],
    repetitions: 2
};

var beads_training_block = {
  timeline: [beads_load_trial, beads_training_trials, beads_reset_trial]
}
timeline.push(beads_training_block)

var beads_experiment_trials = {
    timeline: [beads_TrialStart,beads_SubjectChoice,beads_BeadAppears],
    repetitions: 3
};

var beads_experiment_block = {
  timeline: [beads_load_trial, beads_experiment_trials, beads_reset_trial]
}
// timeline.push(beads_instruction_trial)
// timeline.push(beads_experiment_block)
// timeline.push(beads_instruction_trial)
// timeline.push(beads_instruction_trial)
// timeline.push(beads_experiment_block)
