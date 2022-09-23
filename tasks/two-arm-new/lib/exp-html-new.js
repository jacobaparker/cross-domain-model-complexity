var compose_experiment_display = function(background,objs) {
  dict = {
    bottomleft: "",
    bottommiddle: "",
    bottomright: "",
    topleft: "",
    topmiddle: "",
    topright: ""
  }
  for (let ii = 0; ii < objs.length; ii++) {
    //html_text += `<div id="jspsych-space-daw-` + objs[ii].tb + `-stim-` + objs[ii].side + `" `;
    if (objs[ii].selected) {dict[objs[ii].tb+objs[ii].side] += `class="jspsych-space-daw-bottom-stim-border" `;}
    dict[objs[ii].tb+objs[ii].side] += `style="background-image: url('` + objs[ii].get_url() + `')"`
  }
  html_text = `<div style="background-image: url('` + background + `')">`;
  html_text += `<div id="jspsych-space-daw-bottom-stim-left" ` + dict["bottomleft"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-bottom-stim-middle" ` + dict["bottommiddle"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-bottom-stim-right" ` + dict["bottomright"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-top-stim-left" ` + dict["topleft"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-top-stim-middle" ` + dict["topmiddle"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-top-stim-right" ` + dict["topright"] + `></div>`;
  html_text += `</div>`;
}

class alien_stim = {
  constructor(color,num,state,side,path) {
    this.color = color;
    this.num = num;
    this.state = state;
    this.side = side;
    this.path = path;
    this.selected = false;
    this.tb = 'bottom';
  }

  get_url() {
    return this.path + this.color + '_stim_' + String(this.num) + '.png'
  }

  update_selected(response) {
    
  }
}

class reward_stim = {
  constructor(side) {
    this.side = side;
    this.tb = 'top';
    this.reward_files = ['noreward.png','treasure.png'];
  }
}

class two_arm_practice = {
  constructor(spec) {
    this.color = spec.color;
    this.path = spec.path;
    this.alien1_rew = spec.alien1_rew;
    this.alien2_rew = spec.alien2_rew;
    // this.state_files = ['_sad',''];

    this.planet = spec.path + spec.color + '_planet.png';
    this.alien1 = new alien_stim(spec.color,1,spec.alien1_state.'left',spec.path);
    this.alien2 = new alien_stim(spec.color,2, spec.alien2_state,'right',spec.path);
  }

  get_response_options() {

  }

  choice_response_html() {

  }

  register_response(response) {

  }

  determine_reward() {

  }

  determine_reward_prob() {

  }

  update_alien_states() {

  }

  reward_html() {

  }

  trial_end() {

  }
}

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
