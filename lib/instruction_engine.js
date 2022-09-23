function instruction_engine(instr_start_page, instr_stop_page, instr_spec_file, instr_path) {
  var instr_correct_resp;
  var instr_correct_flag;
  var instr_ind = instr_start_page - 1;
  var instr_iters = instr_stop_page - instr_start_page + 1;
  var instr_images = [];

  readTextFile(instr_spec_file, function(text){
    instr_spec = JSON.parse(text);
  });

  for (let ii = instr_ind; ii < instr_stop_page; ii++) {
    instr_images.push(instr_path + '/Slide' + instr_spec[ii].Page + '.PNG')
  }

  var instruction_preload = {
    type: jsPsychPreload,
    images: instr_images
  }

  var instruction_trial = {
    type: jsPsychImageButtonResponse,
    stimulus: "",
    choices: "",
    on_start: function(trial) {
      trial.stimulus = instr_path + '/Slide' + instr_spec[instr_ind].Page + '.PNG';
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
    repetitions: instr_iters
  };

  var instruction_all = {
    timeline: [instruction_preload, instruction_block]
  }

  return instruction_all
}
