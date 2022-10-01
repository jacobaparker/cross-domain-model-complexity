var instructions_1a_text = function(){
	var instructions = ["<div align=center>Welcome to this HIT!<br><br>Please read all following instructions very carefully.<br><br>It takes some time, but otherwise you will not know what to do.</div>",
	"<div align=center>In this HIT, you will be taking a spaceship from earth<br> to look for space treasure on two different planets:<br><br><img style='margin:0px auto;display:block;height:200px' src='img/example_planets.png'/></div>",
	"<div align=center>Each planet has two aliens on it and each alien has its own space treasure mine.<br><br><img style='margin:0px auto;display:block;height:100px' src='img/example_aliens.png'/><br>Once you arrive to each planet, you will ask one of the aliens for space treasure from its mine.</div>",
	"<div align=justify>These aliens are nice, so if an alien just brought treasure up from the mine, it will share it with you. Space treasure looks like this:<br><br><img style='margin:0px auto;display:block' src='img/treasure.png'/><br>Sometimes, the alien will not bring up any treasure and you'll see an empty circle:<br><br><img style='margin:0px auto;display:block' src='img/noreward.png'/></div>",
	"<div align=justify>If an alien has a good mine, it means it can easily dig up space treasure and it will be very likely to have some to share. It might not have treasure every time you ask, but it will most of the time.<br><br>Another alien might have a bad mine that is hard to dig through at the moment and won't have treasure to share most times you ask.<br><br>At the end of each trial, the space treasure that you earned will be converted to points.<br><Br>Each piece of space treasure will be worth one point.</div>",
	"<div align=justify>On each planet, you can choose the left alien by pressing the 'F' key and the right alien by pressing the 'J' key. You will then see whether you got treasure.<br><br>Try practicing this a few times. In the following practice phase, always pick the alien that is highlighted.</div>"];
	return instructions
};

var instructions_1b_text = function(){
	var instructions = ["<div align=center>You may have noticed that this alien's mine was good. It gave you space treasure most of the time.<br><br>The mines of other aliens might be less good. To see this, you are going to ask another alien for treasure a few times.</div>"];
	return instructions
};

var instructions_1c_text = function(){
	var instructions = ["<div align=justify>See, this alien was not in a very good part of the mine, and could share very little space treasure.<br><br>Every alien has treasure in its mine, but they can't share every time. Some will be more likely to share because it is easier to dig right now.<br><br>In the following practice phase, you can choose between two aliens and try to figure out which one has more treasure to share.<br><br>Each alien will sometimes come up on the right, and sometimes come up on the left.<br><br>Which side an alien appears on does not matter. For instance, left is not luckier than right.</div>"];
	return instructions
};

var instructions_1d_text = function(){
	var instructions = ["<div align=justify>Good! You might have learned that this alien had treasure more often:<br><br><img style='margin:0px auto;display:block;height:100px' src='img/green_stim_2.png'/><br>Also, even if this alien had a better mine, you couldn't be sure if it had treasure all the time.<br><br>The treasure an alien can give will change during the game. Those with a good mine might get to a part of the mine that is hard to dig. Those with little to share might find easier treasure to dig.<br><br>Any changes in an alien's mine will happen slowly, so try to focus to get as much treasure as possible.</div>",
	"<div align=justify>While the chance an alien has treasure to share changes over time, it changes slowly. So an alien with a good treasure mine right now will stay good for a while.<br><br>To find the alien with the best mine at each point in time, you must concentrate.</div>",
	"<div align=justify>Now that you know how to pick aliens, you can learn how the play the whole game.<br><br>You will travel from earth to one of two planets, a green planet and a yellow planet:<br><br><img style='margin:0px auto;display:block;height:200px' src='img/example_planets.png'/></div>",
	"<div align=justify>On each trial, you will first choose which spaceship to take.<br><br><img style='margin:0px auto;display:block;height:100px' src='img/example_rockets.png'/><br>The spaceships can fly to either planet, but one will mostly fly to the green planet, and the other mostly to the yellow planet.<br><br>The planet a spaceship goes to most won't change during the game.<br><br>Pick the one that you think will take you to the alien with the best mine, but remember sometimes you'll go to the other planet!</div>",
	"<div align=justify>Lets's practice before doing the full game. Here are a few hints before you start: <br><br>Hint #1:<br>Remember which aliens have treasure. How good a mine is changes slowly, so an alien that has a lot of treasure to share now will be very likely to share with you in the near future.<br><br>Hint #2:<br>Remember, each alien has its own mine. Just because one alien has a bad mine, does not mean another has a good mine. Also, there are no funny patterns in how likely it is that an alien shares treasure with you, like every other time you ask, or depending on which spaceship you took. The aliens are not tricking you.<br><br>Hint #3:<br>The spaceship you choose is important because often the alien on one planet is better than the ones on another planet. You can find more treasure by finding the spaceship that takes you to the right planet.</div>",
	"<div align=justify>In the real experiment, we are only going to give you 2 seconds for each response (2 seconds for the spaceships, and 2 seconds for the aliens). At the beginning that won't seem like very much time and you may find the task difficult. Over time, as you learn to play, you will find that 2 seconds is enough time to make good decisions.<br><br>Our advice is to think carefully about your strategy, but also to trust your instincts. By concentrating you can increase the number of points you win by a lot. There is an element of chance, but a lot of room for skill as well.<br><br>Now, you will do 25 practice trials. These don't count, and have no time limit in order to help you learn.</div>"];
	return instructions
};

var instructions_2_text = function(){
	var instructions_2 = ["<div align=justify>Ok, you've finished all practice phases. In the real game, you will find new planets, new aliens and new mines, but the rules and the spaceships will be the same.<br><br>Let's review everything we've learned and then begin playing.<br><br>Remember, you want to find as much space treasure as you can by flying to planets and asking an alien to mine for you. The chance that an alien can share space treasure with you changes slowly over time, so you need to concentrate and be flexible to keep track of which spaceships and aliens are good right now.</div>",
	"<div align=justify>How much bonus money you make is based on how much space treasure you find. You will get a bonus payment of 1 cent for every point you earn. On average people win about $0.75, and some have won more than $1.00.<br><br>The game lasts for 125 trials and you will have two seconds for each choice, and that takes most people about 20 minutes. Good luck!</div>"];
	return instructions_2
}

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
    if (objs[ii].selected) {dict[objs[ii].tb+objs[ii].side] += `class="jspsych-space-daw-bottom-stim-border" `;}
    dict[objs[ii].tb+objs[ii].side] += `style="background-image: url('` + objs[ii].get_url() + `')"`
  }
  html_text = `<div style="background-image: url('` + background + `')">`;
  html_text += `<div id="jspsych-space-daw-top-stim-left" ` + dict["topleft"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-top-stim-middle" ` + dict["topmiddle"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-top-stim-right" ` + dict["topright"] + `></div>`;
  html_text += `<div style="clear:both"></div>`;
  html_text += `<div id="jspsych-space-daw-bottom-stim-left" ` + dict["bottomleft"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-bottom-stim-middle" ` + dict["bottommiddle"] + `></div>`;
  html_text += `<div id="jspsych-space-daw-bottom-stim-right" ` + dict["bottomright"] + `></div>`;
  html_text += `</div>`;
  return html_text
}

class alien_stim {
  constructor(color,num,state,side,path) {
    this.color = color;
    this.num = num;
    this.state = state;
    this.side = side;
    if (this.state === '_deact') {this.choice = '';}
    else {
      if (this.side === 'left') {this.choice = 'f'}
      else if (this.side === 'right') {this.choice = 'j'}
    }
    this.path = path;
    this.selected = false;
    this.tb = 'bottom';
    this.state_names = ['_sad','','_deact'];
  }

  get_url() {
    return this.path + this.color + '_stim_' + String(this.num) + this.state + '.png'
  }

  update_selected(response) {
    if (this.choice === response) {this.selected = true;}
  }

  update_side(side) {
    this.side = side;
    if (this.state === '_deact') {this.choice = '';}
    else {
      if (this.side === 'left') {this.choice = 'f';}
      else if (this.side === 'right') {this.choice = 'j';}
    }
  }

  update_state(rew_flag) {
    if (this.state != '_deact') {this.state = this.state_names[rew_flag]}
  }
}

class reward_stim {
  constructor(side,path) {
    this.side = side;
    this.path = path;
    this.tb = 'top';
    this.rew_flag = 0;
    this.reward_files = ['noreward.png','treasure.png'];
  }

  update_side(response) {
    if (response === 'f') {this.side = 'left';}
    else if (response === 'j') {this.side = 'right';}
  }

  update_reward(rew_flag) {
    this.rew_flag = rew_flag;
  }

  get_url() {
    return this.path + this.reward_files[this.rew_flag]
  }
}

class rocket_stim {
  constructor(num,side,state,path) {
    this.num = num;
    this.side = side;
    this.state = state;
    this.path = path;
    this.selected = false;
    this.tb = 'bottom';
    this.state_names = ['','_deact'];
    if (this.state === '_deact') {this.choice = '';}
    else {
      if (this.side === 'left') {this.choice = 'f'}
      else if (this.side === 'right') {this.choice = 'j'}
    }
  }


}

// class two_arm_practice {
//   constructor(spec) {
//     this.color = spec.color;
//     this.path = spec.path;
//     this.alien1_rew = spec.alien1_rew;
//     this.alien2_rew = spec.alien2_rew;
//     this.trial = 0;
//     this.choice = 0;
//
//     this.planet = spec.path + spec.color + '_planet.png';
//     this.alien1 = new alien_stim(spec.color,1,spec.alien1_state,'left',spec.path);
//     this.alien2 = new alien_stim(spec.color,2, spec.alien2_state,'right',spec.path);
//     if (Math.random() > 0.5) {
//       this.alien1.update_side('left');
//       this.alien2.update_side('right');
//     } else {
//       this.alien2.update_side('left');
//       this.alien1.update_side('right');
//     }
//     this.reward_stim = new reward_stim('middle',spec.path);
//   }
//
//   get_response_options() {
//     return [this.alien1.choice, this.alien2.choice]
//   }
//
//   choice_response_html() {
//     return compose_experiment_display(this.planet,[this.alien1, this.alien2])
//   }
//
//   register_response(response) {
//     this.alien1.update_selected(response)
//     this.alien2.update_selected(response)
//     this.reward_stim.update_side(response)
//   }
//
//   determine_reward() {
//     if (this.alien1.selected) {
//       this.choice = 1;
//       this.rewarded = this.alien1_rew[this.trial];
//     }
//     else if (this.alien2.selected) {
//       this.choice = 2;
//       this.rewarded = this.alien2_rew[this.trial];
//     }
//     this.reward_stim.update_reward(this.rewarded)
//   }
//
//   determine_reward_prob() {
//     if (this.alien1.selected) {
//       this.rewarded = Number(this.alien1_rew > Math.random())
//     }
//     else if (this.alien2.selected) {
//       this.rewarded = Number(this.alien2_rew > Math.random())
//     }
//     this.reward_stim.update_reward(this.rewarded)
//   }
//
//   update_alien_states() {
//     if (this.alien1.selected) {this.alien1.update_state(this.reward_stim.rew_flag)}
//     else if (this.alien2.selected) {this.alien2.update_state(this.reward_stim.rew_flag)}
//   }
//
//   reward_html() {
//     return compose_experiment_display(this.planet,[this.alien1, this.alien2, this.reward_stim])
//   }
//
//   trial_end() {
//     if (Math.random() > 0.5) {
//       this.alien1.update_side('left');
//       this.alien2.update_side('right');
//     } else {
//       this.alien2.update_side('left');
//       this.alien1.update_side('right');
//     }
//     this.alien1.selected = false;
//     this.alien2.selected = false;
//     this.alien1.update_state(1);
//     this.alien2.update_state(1);
//     this.trial += 1;
//   }
// }

class two_arm_full {
  constructor(spec) {
    this.path = spec.path;
    this.trial = 0;
    this.trial_seq = spec.trial_seq;
    this.state2_current = 0;
    this.action_current = 0;
    var Rw1 = [];
    var Rw2 = [];
    var Rw3 = [];
    var Rw4 = [];
    for (var ii = 0; ii<spec.trial_seq.length; ii++) {
      Rw1.push(spec.trial_seq[ii].PRw1)
      Rw2.push(spec.trial_seq[ii].PRw2)
      Rw3.push(spec.trial_seq[ii].PRw3)
      Rw4.push(spec.trial_seq[ii].PRw4)
    }

    var spec1 = {
      path: spec.path,
      color: spec.state1_color,
      stim1_rew: -1,
      stim2_rew: -1,
      stim1_state: '',
      stim2_state: ''
    }
    this.state1 = new two_arm_state(spec1);

    var spec2a = {
      path: spec.path,
      color: spec.state2a_color,
      stim1_rew: Rw1,
      stim2_rew: Rw2,
      stim1_state: '',
      stim2_state: ''
    };
    this.state2a = new two_arm_state(spec2a);

    var spec2b = {
      path: spec.path,
      color: spec.state2b_color,
      stim1_rew: Rw3,
      stim2_rew: Rw4,
      stim1_state: '',
      stim2_state: ''
    };
    this.state2b = new two_arm_state(spec2b);
  }

  trial_start() {
    this.A1_outcome = this.trial_seq[this.trial].S0_A1
    this.A2_outcome = this.trial_seq[this.trial].S0_A2
  }

  register_response_state1(response) {
    if (this.state1.stim1.choice === response) {
      this.state2_current = Number(this.A1_outcome);
      this.action_current = 0;
      this.state1.stim1.selected = true;
    } else if (this.state1.stim2.choice === response) {
      this.state2_current = Number(this.A2_outcome);
      this.action_current = 1;
      this.state1.stim2.selected = true;
    }
  }

  prepare_carryover_stim() {
    if (this.state1.stim1.selected) {this.state1.stim1.make_carryover()}
    else if (this.state1.stim2.selected) {this.state1.stim2.make_carryover()}
  }

  state2_choice_response_html() {
    if (this.action_current === 0) {var state1_stim = this.state1.stim1}
    else if (this.action_current === 1) {var state1_stim = this.state1.stim2}
    if (this.state2_current === 0) {
      return this.state2a.choice_response_html(state1_stim)
    } else if (this.state2_current === 1) {
      return this.state2b.choice_response_html(state1_stim)
    }
  }

  state2_get_response_options() {
    if (this.state2_current === 0) {
      return this.state2a.get_response_options()
    } else if (this.state2_current === 1) {
      return this.state2b.get_response_options()
    }
  }

  register_response_state2(response) {
    if (this.state2_current === 0) {
      this.state2a.register_response(response)
    } else if (this.state2_current === 1) {
      this.state2b.register_response(response)
    }
  }

  determine_reward() {
    if (this.state2_current === 0) {
      this.state2a.determine_reward()
    } else if (this.state2_current === 1) {
      this.state2b.determine_reward()
    }
  }

  update_alien_states() {
    if (this.state2_current === 0) {
      this.state2a.update_alien_states()
    } else if (this.state2_current === 1) {
      this.state2b.update_alien_states()
    }
  }

  state2_reward_html() {
    if (this.action_current === 0) {var state1_stim = this.state1.stim1}
    else if (this.action_current === 1) {var state1_stim = this.state1.stim2}
    if (this.state2_current === 0) {
      return this.state2a.reward_html(state1_stim)
    } else if (this.state2_current === 1) {
      return this.state2b.reward_html(state1_stim)
    }
  }

  trial_end() {
    this.state1.stim1.reset_carryover()
    this.state1.stim2.reset_carryover()
    this.state1.trial_end()
    this.state2a.trial_end()
    this.state2b.trial_end()
    this.trial += 1;
  }

}

class two_arm_stim {
  constructor(color,num,state,side,path) {
    this.color = color;
    this.num = num;
    this.state = state;
    this.side = side;
    if (this.state === '_deact') {this.choice = '';}
    else {
      if (this.side === 'left') {this.choice = 'f'}
      else if (this.side === 'right') {this.choice = 'j'}
    }
    this.path = path;
    this.selected = false;
    this.tb = 'bottom';
    this.state_names = ['_sad','','_deact'];
  }

  get_url() {
    return this.path + this.color + '_stim_' + String(this.num) + this.state + '.png'
  }

  update_selected(response) {
    if (this.choice === response) {this.selected = true;}
  }

  update_side(side) {
    this.side = side;
    if (this.state === '_deact') {this.choice = '';}
    else {
      if (this.side === 'left') {this.choice = 'f';}
      else if (this.side === 'right') {this.choice = 'j';}
    }
  }

  update_state(rew_flag) {
    if (this.state != '_deact') {this.state = this.state_names[rew_flag]}
  }

  make_carryover() {
    this.tb = 'top';
    this.side = 'middle';
    this.state = '_deact';
    this.selected = false;
  }

  reset_carryover() {
    this.tb = 'bottom';
    this.state = '';
  }
}

class two_arm_state {
  constructor(spec) {
    this.color = spec.color;
    this.path = spec.path;
    this.stim1_rew = spec.stim1_rew;
    this.stim2_rew = spec.stim2_rew;
    this.trial = 0;
    this.choice = 0;

    this.planet = spec.path + spec.color + '_planet.png';
    this.stim1 = new two_arm_stim(spec.color,1,spec.stim1_state,'left',spec.path);
    this.stim2 = new two_arm_stim(spec.color,2, spec.stim2_state,'right',spec.path);
    if (Math.random() > 0.5) {
      this.stim1.update_side('left');
      this.stim2.update_side('right');
    } else {
      this.stim2.update_side('left');
      this.stim1.update_side('right');
    }
    this.reward_stim = new reward_stim('middle',spec.path);
  }

  get_response_options() {
    return [this.stim1.choice, this.stim2.choice]
  }

  choice_response_html(add_stims) {
    if (add_stims === undefined) {var stim_objs = [this.stim1, this.stim2];}
    else {var stim_objs = [this.stim1, this.stim2].concat(add_stims);}
    return compose_experiment_display(this.planet,stim_objs)
  }

  register_response(response) {
    this.stim1.update_selected(response)
    this.stim2.update_selected(response)
    this.reward_stim.update_side(response)
  }

  // perhaps undo changes that were just made here and convert stimulus reward
  // info into arrays that are passed directly to each state
  determine_reward() {
    if (this.stim1.selected) {
      this.choice = 1;
      if (this.stim1_rew.length > 1) {
        this.rewarded = Number(this.stim1_rew[this.trial] > Math.random())
      } else {
        this.rewarded = Number(this.stim1_rew > Math.random())
      }
    } else if (this.stim2.selected) {
      this.choice = 2;
      if (this.stim2_rew.length > 1) {
        this.rewarded = Number(this.stim2_rew[this.trial] > Math.random())
      } else {
        this.rewarded = Number(this.stim2_rew > Math.random())
      }
    }
    this.reward_stim.update_reward(this.rewarded)
  }

  // determine_reward() {
  //   if (this.stim1.selected) {
  //     this.choice = 1;
  //     this.rewarded = this.stim1_rew[this.trial];
  //   }
  //   else if (this.stim2.selected) {
  //     this.choice = 2;
  //     this.rewarded = this.stim2_rew[this.trial];
  //   }
  //   this.reward_stim.update_reward(this.rewarded)
  // }
  //
  // determine_reward_prob() {
  //   if (this.stim1.selected) {
  //     this.rewarded = Number(this.stim1_rew > Math.random())
  //   }
  //   else if (this.stim2.selected) {
  //     this.rewarded = Number(this.stim2_rew > Math.random())
  //   }
  //   this.reward_stim.update_reward(this.rewarded)
  // }

  update_alien_states() {
    if (this.stim1.selected) {this.stim1.update_state(this.reward_stim.rew_flag)}
    else if (this.stim2.selected) {this.stim2.update_state(this.reward_stim.rew_flag)}
  }

  reward_html(add_stims) {
    if (add_stims === undefined) {var stim_objs = [this.stim1, this.stim2, this.reward_stim];}
    else {var stim_objs = [this.stim1, this.stim2, this.reward_stim].concat(add_stims);}
    return compose_experiment_display(this.planet,stim_objs)
  }

  trial_end() {
    if (Math.random() > 0.5) {
      this.stim1.update_side('left');
      this.stim2.update_side('right');
    } else {
      this.stim2.update_side('left');
      this.stim1.update_side('right');
    }
    this.stim1.selected = false;
    this.stim2.selected = false;
    this.stim1.update_state(1);
    this.stim2.update_state(1);
    this.trial += 1;
  }
}
