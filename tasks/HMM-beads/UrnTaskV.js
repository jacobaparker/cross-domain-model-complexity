var FreshBlock = 'on';
var ChoiceDirection = '';
var PreviousTrialIndex = 0;
var RelativeTrialIndex = 1;
var Correct = 0;
var TaskType = '';
var Block_Index = 0;
var instruction_picker = 1;

// Session order - uncomment the order you want
var All_Type = ['Low_HMMActual', 'Low_HMMActual', 'Low_HMMActual', 'Low_HMMActual'];
//var All_Type = ['Low_HMMActual','High_HMMActual','Low_MMActual','High_MMActual']
var Block_Type = All_Type[Block_Index];

//script_number = Math.floor(Math.random() * 90) + 1;
// var script_picker = 17

Low_HMMData = $ .get(`stimuli/low_hazard_HMM10/low_hazard_HMM_Actual.csv`, function(){
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

var images = ["tutorial/tutorial-01.png",
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

var beads_preload = {
    type: 'preload',
    auto_preload: true,
	images: images
};
preload.push(beads_preload)

var Gender_options = ["Male", "Female", "Transgender", "Do Not Wish To Say"];
var Ethnicity_options = ["American Indian or Alaskan Native","Asian","Black or African American","Native Hawaiian or Pacific Islander","White","Hispanic or Latino","Other","Do Not Wish to Respond"];
var demographics = {
	type: "survey-multi-choice",
	questions: [{prompt:"Gender Orientation:", options: Gender_options, required:true,},
	{prompt:"Ethnicity:", options: Ethnicity_options, required:true}]
};
var age = {
    type: "survey-text",
    questions: [{prompt: "How old are you?"}],
    post_trial_gap: 100
};

var ProlificID = {
    type: "survey-text",
    questions: [{prompt: "Please Enter your Prolific ID"}],
    post_trial_gap: 100
};


var instruction_trial = {
  	 type: 'image-keyboard-response',
  	 stimulus: '',
  	 choices: [' '],
  	 stimulus_width: 800,
  	 on_start: function(trial){
  	     trial.stimulus = 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
  	 },
  	 on_finish: function(trial){
  	     instruction_picker = instruction_picker + 1;
  	 }
};

var Instruction_trialQ1 = {
    type: 'image-keyboard-response',
    stimulus: '',
    choices: ['ArrowUp'],
    stimulus_width: 800,
    prompt: '',
    on_start: function(trial){
    trial.stimulus = 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
    },
    on_finish: function(info) {
        alert('Correct!');
        instruction_picker = instruction_picker + 1;
    }
};
var Instruction_trialQ2 = {
    type: 'image-keyboard-response',
    stimulus: '',
    choices: ['ArrowRight'],
    stimulus_width: 800,
    prompt: '',
    on_start: function(trial){
    trial.stimulus = 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
    },
    on_finish: function(info) {
    alert('Correct!');
    instruction_picker = instruction_picker + 1;
    }
};
var Instruction_trialQ3 = {
    type: 'image-keyboard-response',
    stimulus: '',
    choices: ['ArrowLeft'],
    stimulus_width: 800,
    prompt: '',
    on_start: function(trial){
        trial.stimulus = 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
    },
    on_finish: function(info) {
        alert('Correct!');
        instruction_picker = instruction_picker + 1;
    }
};
var Instruction_trialQ4 = {
    type: 'image-keyboard-response',
    stimulus: '',
    choices: ['ArrowLeft'],
    stimulus_width: 800,
    prompt: '',
    on_start: function(trial){
        trial.stimulus = 'tutorial/' + 'tutorial-' + String(instruction_picker).padStart(2, '0') + '.png';
    },
    on_finish: function(info) {
        alert('Correct!');
        instruction_picker = instruction_picker + 1;
    }
};


LHMM_text = '<p style="font-family:Arial;text-align:center;width:800px;font-size:18px"> Press the SPACEBAR to continue.</p>';


var Load_trial = {
    type: 'html-keyboard-response',
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

        jsPsych.setProgressBar(0);
    }
};


var TrialStart = {

    type: 'image-button-response',
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
            trial.stimulus = 'Images/NoChoice' + TaskType + '.png';
            BeadColor = CurrentBlock.data[RelativeTrialIndex][1];
            FreshBlock = 'off';
            break;
        case 'off':
            BeadColor = CurrentBlock.data[RelativeTrialIndex][1];
            PreviousBeadColor = CurrentBlock.data[RelativeTrialIndex-1][1];

            switch(PreviousBeadColor) {
                case 1:
                    trial.stimulus = 'Images/NewTrialBC' + TaskType + '.png';
                    break;
                case 2:
                    trial.stimulus = 'Images/NewTrialWC'  + TaskType + '.png';
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

var SubjectChoice = {
    type: 'image-button-response',
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
                trial.stimulus = 'Images/BlackBeadChoice' + TaskType + '.png';
                break;
            case '2':
                trial.stimulus = 'Images/WhiteBeadChoice'  + TaskType + '.png';
                break;
        }
    },
};


var BeadAppears = {
    type: 'image-button-response',
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
                trial.stimulus = 'Images/WhiteBeadChoiceCorrect'  + TaskType + '.png';
                Correct += 1;
                break;
            case '21':
                trial.stimulus = 'Images/WhiteBeadChoiceWrong' + TaskType + '.png';
                break;
            case '12':
                trial.stimulus = 'Images/BlackBeadChoiceWrong' + TaskType + '.png';
                break;
            case '11':
                trial.stimulus = 'Images/BlackBeadChoiceCorrect' + TaskType + '.png';
                Correct += 1;
                break;
        }
    RelativeTrialIndex += 1;

    },
    on_finish: function() {
    // at the end of each trial, update the progress bar
    // based on the current value and the proportion to update for each trial
        var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
        jsPsych.setProgressBar(curr_progress_bar_value + (1/500));
    }

}

var reset_trial = {
    type: 'html-keyboard-response',
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

var experiment_block_training = {
    timeline: [TrialStart,SubjectChoice,BeadAppears],
    repetitions: 10
};

var experiment_block = {
    timeline: [TrialStart,SubjectChoice,BeadAppears],
    repetitions: 500
};

var instruction_block = {
    timeline: [instruction_trial],
    repetitions: 14
};

/* finish connection with pavlovia.org */
var pavlovia_finish = {
	type: "pavlovia",
	command: "finish",
	participantId: jsPsych.data.getURLVariable('PROLIFIC_PID'),
    completedCallback: function() {
        alert('Data successfully submitted! Please click to continue to the questionnaire.');
    }
};

//var finish_page = {
//    type: 'html-keyboard-response',
//    stimulus: '',
//    choices: [' '],
//    prompt: '<p style="height:800px;width:800px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font-weight:normal;font-family:Arial;font-size:20px"> Please wait... Your data is being uploaded. <br><br> You will be redirected to the questionnaire portion of the task soon.<br> The questionnaire consists of roughly 200 multiple choice questions that will ask about your behaviors and personality. Some of the questions may be sensitive in nature. The answers you give will be kept confidential and anonymous: no uniquely identifiable information will be collected at any time. Please do your best to answer all questions.<br><br> Press SPACEBAR to continue. </p>'
//};




jsPsych.init({
    preload: [preload, Low_HMMData],
    timeline: [pavlovia_init, preload, consentdemo_block, instruction_block, Instruction_trialQ1,Instruction_trialQ2,Instruction_trialQ3,instruction_trial, Load_trial, experiment_block_training, reset_trial, instruction_trial, Load_trial, experiment_block, reset_trial, instruction_trial, instruction_trial, Load_trial, experiment_block, reset_trial,pavlovia_finish],
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_data_update: function(data){
        jsPsych.data.get().addToLast({Script_Picker: "Actual"})
        jsPsych.data.get().addToLast({Block_Type: Block_Type})
    },

    on_finish: function() {
        window.location.href = prolific_href;
    }
});
