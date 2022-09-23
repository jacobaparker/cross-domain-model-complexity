var instr_ind = 0;
var instr_correct_resp;
var instr_spec_file = "./instructions_spec.json";
var instr_correct_flag;

// Function to load in JSON files
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile(instr_spec_file, function(text){
  instr_spec = JSON.parse(text);
});

var instruction_trial = {
  type: jsPsychImageButtonResponse,
  stimulus: "",
  choices: "",
  on_start: function(trial) {
    trial.stimulus = 'instructions/Slide' + instr_spec[instr_ind].Page + '.PNG';
    switch(instr_spec[instr_ind].Type) {
      case 'Quiz':
        trial.choices = instr_spec[instr_ind].Options.split(", ");
        instr_correct_resp = trial.choices.indexOf(instr_spec[instr_ind].Correct);
        break;
      case 'Normal':
        trial.choices = ["Next>"];
        break;
    }
  },
  on_finish: function(trial) {
    console.log('trial response is')
    console.log(trial.response)
    if (trial.response === instr_correct_resp) {instr_correct_flag = true}
    else {instr_correct_flag = false}
  }
};

var instruction_trial_wrapper = {
  timeline: [instruction_trial],
  loop_function: function(trial) {
    switch(instr_spec[instr_ind].Type) {
      case 'Quiz':
        if (instr_correct_flag) {
          alert("Correct!");
          instr_ind = instr_ind + 1;
          return false;
        } else {
          alert("Incorrect, please try again.");
          return true;
        }
        break;
      case 'Normal':
        instr_ind = instr_ind + 1;
        return false;
        break;
    }
  }
}

var instruction_block = {
  timeline: [instruction_trial_wrapper],
  repetitions: instr_spec.length
};

timeline.push(instruction_block)
