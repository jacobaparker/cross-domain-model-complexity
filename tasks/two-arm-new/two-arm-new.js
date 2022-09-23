// var seq_num = Math.floor(Math.random() * 10) + 1;
var seq_num = 8;
var seq_file = "./tasks/two-arm-new/stimuli/seq" + String(seq_num) + ".json";
var p_alien_1_ps = [1, 1, 1, 0, 1];
var p_alien_2_ps = [0, 1, 0, 0, 0];

readTextFile(seq_file, function(text){
  seq_data = JSON.parse(text);
});

var change_colors = {
	type: jsPsychCallFunction,
	func: function(){
		$('.jspsych-display-element').css('background-color', 'black');
		$('.jspsych-display-element').css('color', 'white');
	}
}
var change_colors_back = {
	type: jsPsychCallFunction,
	func: function(){
		$('.jspsych-display-element').css('background-color', 'white');
		$('.jspsych-display-element').css('color', 'black');
	}
}

var instructions_1a_block = {
	type: jsPsychInstructions,
	pages: instructions_1a_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}
// timeline.push(instructions_1a_block)

var alien_practice_spec = {
  path: './tasks/two-arm-new/img/',
  color: 'green',
  alien1_rew: p_alien_1_ps,
  alien2_rew: p_alien_1_ps,
  alien1_state: '',
  alien2_state: '_deact',
};

var alien_1_practice = new two_arm_practice(alien_practice_spec);
var alien_1_practice_choice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  on_start: function(trial) {
    trial.stimulus =  alien_1_practice.choice_response_html()
    trial.choices = alien_1_practice.get_response_options()
  },
  on_finish: function(trial) {
    alien_1_practice.register_response(trial.response)
    alien_1_practice.determine_reward()
    jsPsych.data.get().addToLast({
      block: 'good_alien_practice',
      trial_number: alien_1_practice.trial,
      state: alien_1_practice.color,
      choice: alien_1_practice.choice,
      rewarded: alien_1_practice.rewarded
    });
  }
}

var alien_1_practice_response = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 500,
  on_start: function(trial) {
    trial.stimulus =  alien_1_practice.choice_response_html()
    // trial.choices = alien_1_practice.get_response_options()
  },
  on_finish: function(trial) {
    alien_1_practice.update_alien_states()
  }
}

var alien_1_practice_reward = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 1000,
  on_start: function(trial) {
    trial.stimulus =  alien_1_practice.reward_html()
    // trial.choices = alien_1_practice.get_response_options()
  },
  on_finish: function(trial) {
    alien_1_practice.trial_end()
  }
}

var alien_1_practice_block = {
  timeline: [alien_1_practice_choice, alien_1_practice_response, alien_1_practice_reward],
  repetitions: 5
}
// timeline.push(alien_1_practice_block)

var instructions_1b_block = {
	type: jsPsychInstructions,
	pages: instructions_1b_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}
// timeline.push(instructions_1b_block)

var alien_practice_spec = {
  path: './tasks/two-arm-new/img/',
  color: 'yellow',
  alien1_rew: p_alien_2_ps,
  alien2_rew: p_alien_2_ps,
  alien1_state: '',
  alien2_state: '_deact',
};
var alien_2_practice = new two_arm_practice(alien_practice_spec);
var alien_2_practice_choice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  on_start: function(trial) {
    trial.stimulus =  alien_2_practice.choice_response_html()
    trial.choices = alien_2_practice.get_response_options()
  },
  on_finish: function(trial) {
    alien_2_practice.register_response(trial.response)
    alien_2_practice.determine_reward()
    jsPsych.data.get().addToLast({
      block: 'bad_alien_practice',
      trial_number: alien_2_practice.trial,
      state: alien_2_practice.color,
      choice: alien_2_practice.choice,
      rewarded: alien_2_practice.rewarded
    });
  }
}

var alien_2_practice_response = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 500,
  on_start: function(trial) {
    trial.stimulus =  alien_2_practice.choice_response_html()
    // trial.choices = alien_1_practice.get_response_options()
  },
  on_finish: function(trial) {
    alien_2_practice.update_alien_states()
  }
}

var alien_2_practice_reward = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 1000,
  on_start: function(trial) {
    trial.stimulus =  alien_2_practice.reward_html()
    // trial.choices = alien_1_practice.get_response_options()
  },
  on_finish: function(trial) {
    alien_2_practice.trial_end()
  }
}

var alien_2_practice_block = {
  timeline: [alien_2_practice_choice, alien_2_practice_response, alien_2_practice_reward],
  repetitions: 5
}
// timeline.push(alien_2_practice_block)

var instructions_1c_block = {
	type: jsPsychInstructions,
	pages: instructions_1c_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}
// timeline.push(instructions_1c_block)

var alien_practice_spec = {
  path: './tasks/two-arm-new/img/',
  color: 'green',
  alien1_rew: 0.1,
  alien2_rew: 0.9,
  alien1_state: '',
  alien2_state: '',
};
var aliens_practice = new two_arm_practice(alien_practice_spec);
var aliens_practice_choice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  on_start: function(trial) {
    trial.stimulus =  aliens_practice.choice_response_html()
    trial.choices = aliens_practice.get_response_options()
  },
  on_finish: function(trial) {
    aliens_practice.register_response(trial.response)
    aliens_practice.determine_reward_prob()
    jsPsych.data.get().addToLast({
      block: 'aliens_practice',
      trial_number: aliens_practice.trial,
      state: aliens_practice.color,
      choice: aliens_practice.choice,
      rewarded: aliens_practice.rewarded
    });
  }
}

var aliens_practice_response = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 500,
  on_start: function(trial) {
    trial.stimulus =  aliens_practice.choice_response_html()
  },
  on_finish: function(trial) {
    aliens_practice.update_alien_states()
  }
}

var aliens_practice_reward = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 1000,
  on_start: function(trial) {
    trial.stimulus =  aliens_practice.reward_html()
  },
  on_finish: function(trial) {
    aliens_practice.trial_end()
  }
}

var aliens_practice_block = {
  timeline: [aliens_practice_choice, aliens_practice_response, aliens_practice_reward],
  repetitions: 20
}
timeline.push(aliens_practice_block)



// experiment.push(change_colors);
// experiment.push(check_id_block);
// experiment.push(consent_block);
// experiment.push(welcome_block);
// experiment.push(instructions_1a_block);
// experiment.push(alien_1_practice_block);
// experiment.push(instructions_1b_block);
// experiment.push(alien_2_practice_block);
// experiment.push(instructions_1c_block);
// experiment.push(aliens_practice_block);
// experiment.push(instructions_1d_block);
// experiment.push(space_practice_block);
// experiment.push(instructions_2_block);
// experiment.push(space_block);
// experiment.push(save_data_block);
// experiment.push(check_demographics_block);
// experiment.push(save_subinfo_block);
// experiment.push(debriefing_block);
// experiment.push(score_block);
// experiment.push(change_colors_back);
// experiment.push(end_block);

// var border_side = -1;
// var alien_1_practice_choice = {
//   type: jsPsychHtmlKeyboardResponse,
//   stimulus: alien_1_practice_html(1),
//   choices: ['f','j'],
//   prompt: 'Press F or J to select an alien',
//   on_finish: function(trial) {
//     if (trial.response === 'f') {
//       border_side = 0;
//     } else if (trial.response === 'j') {
//       border_side = 1;
//     }
//   }
// }
//
// var alien_1_practice_response = {
//   type: jsPsychHtmlKeyboardResponse,
//   stimulus: alien_1_practice_html(1,1),
//   choices: [],
//   // trial_duration: 500
//   prompt: ''
// }
//
// timeline.push(alien_1_practice_choice)
// timeline.push(alien_1_practice_response)

// var alien_1_practice_block = {
// 	type: "space-daw-alien-stim",
// 	choices: "space",
// 	p: function() {
// 		return p_alien_1_ps.splice(0,1)
// 	},
// 	timing_post_trial: 0,
// 	nrtrials: 5,
// };
