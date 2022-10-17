var seq_num = 8;
var seq_file = "./tasks/two-arm-new/stimuli/seq" + String(seq_num) + "_new.json";
var p_alien_1_ps = [1, 1, 1, 0, 1];
var p_alien_2_ps = [0, 1, 0, 0, 0];
var Ntrials_full_exp = two_arm_exp_ntrials;
var Ntrials_full_prac = two_arm_prac_ntrials;
var Ntrials_aliens_prac = two_arm_prac_ntrials;
var two_arm_path = "./tasks/two-arm-new/";
var prac_seq_file = "./tasks/two-arm-new/stimuli/seq2_new.json";

var two_arm_images = [
  "img/earth_planet.png",
  "img/earth_stim_1.png",
  "img/earth_stim_1_deact.png",
  "img/earth_stim_2.png",
  "img/earth_stim_2_deact.png",
  "img/example_aliens.png",
  "img/example_planets.png",
  "img/example_rockets.png",
  "img/green_planet.png",
  "img/green_stim_1.png",
  "img/green_stim_1_deact.png",
  "img/green_stim_1_sad.png",
  "img/green_stim_2.png",
  "img/green_stim_2_deact.png",
  "img/green_stim_2_sad.png",
  "img/noreward.png",
  "img/purple_planet.png",
  "img/purple_stim_1.png",
  "img/purple_stim_1_deact.png",
  "img/purple_stim_1_sad.png",
  "img/purple_stim_2.png",
  "img/purple_stim_2_deact.png",
  "img/purple_stim_2_sad.png",
  "img/red_planet.png",
  "img/red_stim_1.png",
  "img/red_stim_1_deact.png",
  "img/red_stim_1_sad.png",
  "img/red_stim_2.png",
  "img/red_stim_2_deact.png",
  "img/red_stim_2_sad.png",
  "img/treasure.png",
  "img/yellow_planet.png",
  "img/yellow_stim_1.png",
  "img/yellow_stim_1_deact.png",
  "img/yellow_stim_1_sad.png",
  "img/yellow_stim_2.png",
  "img/yellow_stim_2_deact.png",
  "img/yellow_stim_2_sad.png"
];
for (let jj = 0; jj < two_arm_images.length; jj++) {
  two_arm_images[jj] = two_arm_path + two_arm_images[jj];
}

var two_arm_preload = {
  type: jsPsychPreload,
	images: two_arm_images
};
// preload.push(two_arm_preload)

readTextFile(seq_file, function(text){
  seq_data = JSON.parse(text);
});

readTextFile(prac_seq_file, function(text){
  prac_seq_data = JSON.parse(text);
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
  stim1_rew: p_alien_1_ps,
  stim2_rew: p_alien_1_ps,
  stim1_state: '',
  stim2_state: '_deact',
};

var alien_1_practice = new two_arm_state(alien_practice_spec);
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
  stim1_rew: p_alien_2_ps,
  stim2_rew: p_alien_2_ps,
  stim1_state: '',
  stim2_state: '_deact',
};
var alien_2_practice = new two_arm_state(alien_practice_spec);
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
  stim1_rew: 0.1,
  stim2_rew: 0.9,
  stim1_state: '',
  stim2_state: '',
};
var aliens_practice = new two_arm_state(alien_practice_spec);
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
    aliens_practice.determine_reward()
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
  repetitions: Ntrials_aliens_prac
}
// timeline.push(aliens_practice_block)

var instructions_1d_block = {
	type: jsPsychInstructions,
	pages: instructions_1d_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}
// timeline.push(instructions_1d_block)


var full_spec = {
  path: './tasks/two-arm-new/img/',
  state1_color: 'earth',
  state2a_color: 'green',
  state2b_color: 'yellow',
  trial_seq: prac_seq_data,
  display_score: true
};
var two_arm_practice = new two_arm_full(full_spec);

var state1_choice_prac = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select a rocket',
  on_start: function(trial) {
    two_arm_practice.trial_start()
    trial.stimulus =  two_arm_practice.state1_choice_response_html()
    trial.choices = two_arm_practice.state1.get_response_options()
  },
  on_finish: function(trial) {
    two_arm_practice.state1.register_response(trial.response)
    two_arm_practice.register_response_state1(trial.response, trial.rt)
  }
};

var state1_response_prac = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select a rocket',
  trial_duration: 500,
  on_start: function(trial) {
    trial.stimulus =  two_arm_practice.state1_choice_response_html()
  },
  on_finish: function(trial) {
    two_arm_practice.prepare_carryover_stim()
  }
};

var state2_choice_prac = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  on_start: function(trial) {
    trial.stimulus =  two_arm_practice.state2_choice_response_html()
    trial.choices = two_arm_practice.state2_get_response_options()
  },
  on_finish: function(trial) {
    two_arm_practice.register_response_state2(trial.response, trial.rt)
    two_arm_practice.determine_reward()
  }
}

var state2_response_prac = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 500,
  on_start: function(trial) {
    trial.stimulus =  two_arm_practice.state2_choice_response_html()
  },
  on_finish: function(trial) {
    two_arm_practice.update_alien_states()
    two_arm_practice.update_score()
  }
};

var state2_reward_prac = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 1000,
  on_start: function(trial) {
    trial.stimulus =  two_arm_practice.state2_reward_html()
  },
  on_finish: function(trial) {
    jsPsych.data.get().addToLast({
      block: 'two_arm_practice',
      trial_number: two_arm_practice.trial+1,
      state1_action: two_arm_practice.action_current+1,
      state2_visited: two_arm_practice.state2_current+1,
      choice: two_arm_practice.choice,
      rewarded: two_arm_practice.rewarded,
      state1_key: two_arm_practice.state1_key,
      state2_key: two_arm_practice.state2_key,
      state1_rt: two_arm_practice.state1_rt,
      state2_rt: two_arm_practice.state2_rt
    });
    two_arm_practice.trial_end()
  }
}

var two_arm_practice_block = {
  timeline: [state1_choice_prac, state1_response_prac, state2_choice_prac, state2_response_prac, state2_reward_prac],
  repetitions: Ntrials_full_prac
}
// timeline.push(two_arm_practice_block)

var instructions_2_block = {
	type: jsPsychInstructions,
	pages: instructions_2_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}
// timeline.push(instructions_2_block)

var full_spec = {
  path: './tasks/two-arm-new/img/',
  state1_color: 'earth',
  state2a_color: 'purple',
  state2b_color: 'red',
  trial_seq: seq_data,
  display_score: true
};
var two_arm_exp = new two_arm_full(full_spec);

var lapse_flag = false;

var state1_choice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select a rocket',
  trial_duration: 2000,
  on_start: function(trial) {
    two_arm_exp.trial_start()
    trial.stimulus =  two_arm_exp.state1_choice_response_html()
    trial.choices = two_arm_exp.state1.get_response_options()
  },
  on_finish: function(trial) {
    if (trial.response === 'j' || trial.response === 'f') {
      two_arm_exp.state1.register_response(trial.response)
      two_arm_exp.register_response_state1(trial.response, trial.rt)
      lapse_flag = false;
    } else {
      lapse_flag = true;
    }
  }
};

var state1_response = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select a rocket',
  trial_duration: 500,
  on_start: function(trial) {
    trial.stimulus =  two_arm_exp.state1_choice_response_html()
  },
  on_finish: function(trial) {
    two_arm_exp.prepare_carryover_stim()
  }
};

var state2_choice = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  trial_duration: 2000,
  prompt: 'Press F or J to select an alien',
  on_start: function(trial) {
    trial.stimulus =  two_arm_exp.state2_choice_response_html()
    trial.choices = two_arm_exp.state2_get_response_options()
  },
  on_finish: function(trial) {
    if (trial.response === 'j' || trial.response === 'f') {
      two_arm_exp.register_response_state2(trial.response, trial.rt)
      two_arm_exp.determine_reward()
      lapse_flag = false;
    } else {
      lapse_flag = true;
    }
  }
}

var state2_response = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 500,
  on_start: function(trial) {
    trial.stimulus =  two_arm_exp.state2_choice_response_html()
  },
  on_finish: function(trial) {
    two_arm_exp.update_alien_states()
    two_arm_exp.update_score()
  }
};

var state2_reward = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: [],
  prompt: 'Press F or J to select an alien',
  trial_duration: 1000,
  on_start: function(trial) {
    trial.stimulus =  two_arm_exp.state2_reward_html()
  },
  on_finish: function(trial) {
    jsPsych.data.get().addToLast({
      block: 'two_arm_exp',
      trial_number: two_arm_exp.trial+1,
      state1_action: two_arm_exp.action_current+1,
      state2_visited: two_arm_exp.state2_current+1,
      choice: two_arm_exp.choice,
      rewarded: two_arm_exp.rewarded,
      state1_key: two_arm_exp.state1_key,
      state2_key: two_arm_exp.state2_key,
      state1_rt: two_arm_exp.state1_rt,
      state2_rt: two_arm_exp.state2_rt
    });
    two_arm_exp.trial_end()
  }
}

var response_lapse = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div align=center>Please respond within 2 seconds.<br><br>Trial will now repeat.</div>',
  response_ends_trial: false,
  trial_duration: 2000,
  on_start: function(trial) {
    two_arm_exp.trial_end_lapse()
  }
}

var cond_response_lapse = {
  timeline: [response_lapse],
  conditional_function: function() {return lapse_flag}
}

var post_state2_choice = {
  timeline: [state2_response, state2_reward],
  conditional_function: function() {return ! lapse_flag}
}

var post_state1_choice = {
  timeline: [state1_response, state2_choice, post_state2_choice, cond_response_lapse],
  conditional_function: function() {return ! lapse_flag}
}

var two_arm_exp_trial = {
  timeline: [state1_choice, post_state1_choice, cond_response_lapse]
}

var two_arm_exp_block = {
  // timeline: [state1_choice, state1_response, state2_choice, state2_response, state2_reward],
  // repetitions: Ntrials_full_exp,
  timeline: [two_arm_exp_trial],
  loop_function: function(trial) {return two_arm_exp.trial < Ntrials_full_exp}
}
// timeline.push(two_arm_exp_block)

// var two_arm_exp_block = {
//   timeline: [state1_choice, state1_response, state2_choice, state2_response, state2_reward],
//   repetitions: Ntrials_full_exp,
//   loop_function: function(trial) {
//     if
//   }
// }

var two_arm_task = {
  timeline: [
    two_arm_preload,
    instructions_1a_block,
    alien_1_practice_block,
    instructions_1b_block,
    alien_2_practice_block,
    instructions_1c_block,
    aliens_practice_block,
    instructions_1d_block,
    two_arm_practice_block,
    instructions_2_block,
    two_arm_exp_block
  ]
}
